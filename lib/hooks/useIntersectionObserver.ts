"use client"

import { useRef, useEffect, useCallback, useState } from "react"

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | null
}

/**
 * Hook for observing when an element enters the viewport
 * Useful for infinite scroll, lazy loading, and scroll animations
 */
export function useIntersectionObserver(
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px", root = null } = options
  const targetRef = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(callback)

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current()
        }
      },
      { threshold, rootMargin, root }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, root])

  return targetRef
}

/**
 * Hook for tracking if an element is visible
 * Returns boolean state instead of calling a callback
 */
export function useIsVisible(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px", root = null } = options
  const [isVisible, setIsVisible] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold, rootMargin, root }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, root])

  return { ref: targetRef, isVisible }
}

/**
 * Hook specifically for infinite scroll
 * Includes debouncing and loading state awareness
 */
export function useInfiniteScroll({
  onLoadMore,
  hasNextPage,
  isFetching,
  rootMargin = "200px",
}: {
  onLoadMore: () => void
  hasNextPage: boolean
  isFetching: boolean
  rootMargin?: string
}) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      onLoadMore()
    }
  }, [hasNextPage, isFetching, onLoadMore])

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleLoadMore()
        }
      },
      { threshold: 0, rootMargin }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [handleLoadMore, rootMargin])

  return loadMoreRef
}
