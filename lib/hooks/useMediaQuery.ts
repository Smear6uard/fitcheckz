"use client"

import { useState, useEffect } from "react"

/**
 * Hook for responsive media query detection
 *
 * @param query - Media query string (e.g., "(max-width: 767px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    mediaQuery.addEventListener("change", handler)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [query])

  return matches
}

/**
 * Convenience hook for detecting mobile viewport
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)")
}

/**
 * Convenience hook for detecting tablet viewport
 */
export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
}

/**
 * Convenience hook for detecting desktop viewport
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)")
}
