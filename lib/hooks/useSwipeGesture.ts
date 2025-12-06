import { useEffect, useRef } from 'react'
import { useDrag } from '@use-gesture/react'
import { useSpring, config } from '@react-spring/web'

export interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  enabled?: boolean
}

export function useSwipeGesture(options: SwipeGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    enabled = true,
  } = options

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

  const bind = useDrag(
    ({ movement: [mx, my], direction: [dx, dy], distance, cancel, last }) => {
      if (!enabled) return

      // Update spring while dragging
      if (!last) {
        api.start({ x: mx, y: my, immediate: true })
      }

      // Detect swipe on release
      if (last && distance > threshold) {
        const isHorizontal = Math.abs(mx) > Math.abs(my)

        if (isHorizontal) {
          if (dx > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (dx < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        } else {
          if (dy > 0 && onSwipeDown) {
            onSwipeDown()
          } else if (dy < 0 && onSwipeUp) {
            onSwipeUp()
          }
        }

        // Reset position with animation
        api.start({ x: 0, y: 0, config: config.wobbly })
      }

      // Reset position on cancel
      if (!last) {
        api.start({ x: 0, y: 0, config: config.wobbly })
      }
    },
    {
      filterTaps: true,
      axis: undefined, // Allow both directions
    }
  )

  return { bind, style: { x, y } }
}
