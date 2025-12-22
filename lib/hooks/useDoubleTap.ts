"use client"

import { useCallback, useRef } from "react"

interface UseDoubleTapOptions {
  delay?: number
  onSingleTap?: () => void
}

/**
 * Hook for detecting double-tap gestures (Instagram-style quick like)
 *
 * @param onDoubleTap - Callback fired when double-tap is detected
 * @param options.delay - Max time between taps (default: 300ms)
 * @param options.onSingleTap - Optional callback for single tap (fires after delay if no second tap)
 */
export function useDoubleTap(
  onDoubleTap: () => void,
  options: UseDoubleTapOptions = {}
) {
  const { delay = 300, onSingleTap } = options
  const lastTapRef = useRef<number>(0)
  const singleTapTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleTap = useCallback(
    (event?: React.MouseEvent | React.TouchEvent) => {
      const now = Date.now()
      const timeSinceLastTap = now - lastTapRef.current

      // Clear any pending single tap timeout
      if (singleTapTimeoutRef.current) {
        clearTimeout(singleTapTimeoutRef.current)
        singleTapTimeoutRef.current = null
      }

      if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
        // Double tap detected
        lastTapRef.current = 0
        onDoubleTap()
      } else {
        // First tap - wait to see if there's a second
        lastTapRef.current = now

        if (onSingleTap) {
          singleTapTimeoutRef.current = setTimeout(() => {
            onSingleTap()
            singleTapTimeoutRef.current = null
          }, delay)
        }
      }
    },
    [delay, onDoubleTap, onSingleTap]
  )

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (singleTapTimeoutRef.current) {
      clearTimeout(singleTapTimeoutRef.current)
    }
  }, [])

  return {
    handlers: {
      onClick: handleTap,
    },
    handleTap,
    cleanup,
  }
}
