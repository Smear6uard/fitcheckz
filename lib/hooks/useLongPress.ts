import { useCallback, useRef, useState } from 'react'

export interface LongPressOptions {
  onLongPress: () => void
  onClick?: () => void
  delay?: number
  enabled?: boolean
}

export function useLongPress(options: LongPressOptions) {
  const { onLongPress, onClick, delay = 500, enabled = true } = options

  const [isPressed, setIsPressed] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()
  const isLongPressRef = useRef(false)

  const start = useCallback(() => {
    if (!enabled) return

    setIsPressed(true)
    isLongPressRef.current = false

    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true
      onLongPress()
      setIsPressed(false)
    }, delay)
  }, [enabled, delay, onLongPress])

  const clear = useCallback(() => {
    timerRef.current && clearTimeout(timerRef.current)
    setIsPressed(false)
  }, [])

  const handleClick = useCallback(() => {
    if (!enabled) return

    // Only trigger onClick if it wasn't a long press
    if (!isLongPressRef.current && onClick) {
      onClick()
    }
    clear()
  }, [enabled, onClick, clear])

  return {
    handlers: {
      onMouseDown: start,
      onMouseUp: handleClick,
      onMouseLeave: clear,
      onTouchStart: start,
      onTouchEnd: handleClick,
    },
    isPressed,
  }
}
