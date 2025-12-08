"use client"

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  TouchEvent,
} from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { Loader2, Shirt, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { haptics } from "@/lib/haptics"

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  className?: string
  disabled?: boolean
  threshold?: number
  messages?: string[]
}

const DEFAULT_MESSAGES = [
  "Finding fresh fits...",
  "Consulting the style gods...",
  "Curating your looks...",
  "Almost there...",
]

export function PullToRefresh({
  children,
  onRefresh,
  className,
  disabled = false,
  threshold = 80,
  messages = DEFAULT_MESSAGES,
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)

  // Cycle through messages during refresh
  useEffect(() => {
    if (!isRefreshing) return

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [isRefreshing, messages.length])

  // Animation for the pull indicator
  const pullSpring = useSpring({
    y: isPulling || isRefreshing ? Math.min(pullDistance, threshold + 20) : 0,
    opacity: isPulling || isRefreshing ? 1 : 0,
    rotate: isPulling ? (pullDistance / threshold) * 360 : isRefreshing ? 360 : 0,
    scale: isRefreshing ? 1 : Math.min(pullDistance / threshold, 1),
    config: isRefreshing ? { tension: 100, friction: 20 } : config.stiff,
  })

  // Continuous spin during refresh
  const spinSpring = useSpring({
    from: { rotate: 0 },
    to: { rotate: isRefreshing ? 360 : 0 },
    loop: isRefreshing,
    config: { duration: 1000 },
  })

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled || isRefreshing) return

      const scrollTop = containerRef.current?.scrollTop || 0
      if (scrollTop > 0) return

      setStartY(e.touches[0].clientY)
      setIsPulling(true)
    },
    [disabled, isRefreshing]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling || disabled || isRefreshing) return

      const scrollTop = containerRef.current?.scrollTop || 0
      if (scrollTop > 0) {
        setIsPulling(false)
        setPullDistance(0)
        return
      }

      const currentY = e.touches[0].clientY
      const distance = Math.max(0, currentY - startY)

      // Apply resistance
      const resistedDistance = distance * 0.5
      setPullDistance(resistedDistance)

      // Haptic feedback at threshold
      if (resistedDistance >= threshold && pullDistance < threshold) {
        haptics.pullRefresh()
      }
    },
    [isPulling, disabled, isRefreshing, startY, threshold, pullDistance]
  )

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return

    setIsPulling(false)

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      haptics.medium()

      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
        haptics.success()
      }
    } else {
      setPullDistance(0)
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh])

  const pullProgress = Math.min(pullDistance / threshold, 1)
  const isTriggered = pullDistance >= threshold

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Pull indicator */}
      <animated.div
        style={{
          y: pullSpring.y,
          opacity: pullSpring.opacity,
        }}
        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      >
        <div
          className={cn(
            "flex flex-col items-center gap-2 py-4 px-6 rounded-full",
            "bg-card/90 backdrop-blur-sm shadow-lg border",
            isTriggered && "border-brand-teal"
          )}
        >
          <animated.div
            style={{
              scale: pullSpring.scale,
              rotate: isRefreshing
                ? spinSpring.rotate.to((r) => `${r}deg`)
                : pullSpring.rotate.to((r) => `${r}deg`),
            }}
          >
            {isRefreshing ? (
              <Loader2
                className={cn(
                  "h-6 w-6",
                  isTriggered ? "text-brand-teal" : "text-muted-foreground"
                )}
              />
            ) : (
              <div className="relative">
                <Shirt
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isTriggered ? "text-brand-teal" : "text-muted-foreground"
                  )}
                />
                {isTriggered && (
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-brand-lime" />
                )}
              </div>
            )}
          </animated.div>

          <span
            className={cn(
              "text-xs font-medium transition-colors",
              isTriggered || isRefreshing
                ? "text-brand-teal"
                : "text-muted-foreground"
            )}
          >
            {isRefreshing
              ? messages[messageIndex]
              : isTriggered
              ? "Release to refresh"
              : "Pull to refresh"}
          </span>
        </div>
      </animated.div>

      {/* Content with offset during pull */}
      <animated.div
        style={{
          y: pullSpring.y,
        }}
      >
        {children}
      </animated.div>
    </div>
  )
}

/**
 * Hook to use pull-to-refresh logic without the component wrapper
 */
export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  options?: { threshold?: number; disabled?: boolean }
) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    if (isRefreshing || options?.disabled) return

    setIsRefreshing(true)
    haptics.pullRefresh()

    try {
      await onRefresh()
      haptics.success()
    } catch (error) {
      haptics.error()
      throw error
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing, onRefresh, options?.disabled])

  return { isRefreshing, refresh }
}
