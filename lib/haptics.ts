/**
 * Haptic Feedback System for Mobile Excellence
 *
 * Provides tactile feedback on key user interactions using the
 * Vibration API with intelligent fallbacks.
 */

type HapticPattern = "light" | "medium" | "heavy" | "success" | "error" | "warning" | "selection"

// Vibration patterns in milliseconds
const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 30], // Quick double tap
  error: [50, 30, 50, 30, 50], // Triple buzz
  warning: [30, 50, 30], // Attention pattern
  selection: 15, // Subtle selection feedback
}

/**
 * Check if haptic feedback is supported
 */
export function isHapticsSupported(): boolean {
  if (typeof window === "undefined") return false
  return "vibrate" in navigator
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Trigger haptic feedback
 */
export function haptic(pattern: HapticPattern = "light"): void {
  // Skip if server-side, not supported, or user prefers reduced motion
  if (typeof window === "undefined") return
  if (!isHapticsSupported()) return
  if (prefersReducedMotion()) return

  try {
    const vibrationPattern = PATTERNS[pattern]
    navigator.vibrate(vibrationPattern)
  } catch (e) {
    // Silently fail if vibration is blocked
  }
}

/**
 * Convenience methods for common haptic patterns
 */
export const haptics = {
  /** Light tap - for button presses, selections */
  light: () => haptic("light"),

  /** Medium tap - for confirmations, toggles */
  medium: () => haptic("medium"),

  /** Heavy tap - for important actions, deletions */
  heavy: () => haptic("heavy"),

  /** Success pattern - for completed actions */
  success: () => haptic("success"),

  /** Error pattern - for failed actions */
  error: () => haptic("error"),

  /** Warning pattern - for attention-needed states */
  warning: () => haptic("warning"),

  /** Selection pattern - for list selections, chips */
  selection: () => haptic("selection"),

  /** Achievement unlock - special celebration pattern */
  achievement: () => {
    if (!isHapticsSupported() || prefersReducedMotion()) return
    try {
      // Dramatic escalating pattern for achievements
      navigator.vibrate([20, 30, 30, 30, 50, 50, 100])
    } catch (e) {
      // Silently fail
    }
  },

  /** Streak milestone - exciting pattern */
  streak: (days: number) => {
    if (!isHapticsSupported() || prefersReducedMotion()) return
    try {
      // More intense for longer streaks
      if (days >= 30) {
        navigator.vibrate([30, 20, 30, 20, 50, 30, 100, 50, 150])
      } else if (days >= 7) {
        navigator.vibrate([25, 25, 35, 25, 50])
      } else {
        navigator.vibrate([20, 30, 40])
      }
    } catch (e) {
      // Silently fail
    }
  },

  /** Pull-to-refresh trigger */
  pullRefresh: () => {
    if (!isHapticsSupported() || prefersReducedMotion()) return
    try {
      navigator.vibrate([15, 20, 25])
    } catch (e) {
      // Silently fail
    }
  },

  /** Like/heart animation */
  like: () => {
    if (!isHapticsSupported() || prefersReducedMotion()) return
    try {
      navigator.vibrate([15, 30, 20])
    } catch (e) {
      // Silently fail
    }
  },

  /** Swipe complete */
  swipe: () => {
    if (!isHapticsSupported() || prefersReducedMotion()) return
    try {
      navigator.vibrate(20)
    } catch (e) {
      // Silently fail
    }
  },
}

/**
 * React hook for haptic feedback with automatic cleanup
 */
export function useHaptics() {
  return haptics
}

/**
 * Higher-order function to add haptic feedback to event handlers
 */
export function withHaptic<T extends (...args: unknown[]) => unknown>(
  handler: T,
  pattern: HapticPattern = "light"
): T {
  return ((...args: Parameters<T>) => {
    haptic(pattern)
    return handler(...args)
  }) as T
}

/**
 * Create a haptic-enhanced click handler
 */
export function hapticClick(
  onClick: () => void,
  pattern: HapticPattern = "light"
): () => void {
  return () => {
    haptic(pattern)
    onClick()
  }
}
