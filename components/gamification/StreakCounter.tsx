"use client"

import { useEffect, useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { cn } from "@/lib/utils"
import { Flame, AlertTriangle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  getStreakStatusMessage,
  getStreakMilestone,
  getStreakIntensity,
  type StreakData,
} from "@/lib/gamification/streaks"

interface StreakCounterProps {
  className?: string
  variant?: "compact" | "full"
}

export function StreakCounter({ className, variant = "compact" }: StreakCounterProps) {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStreak()
  }, [])

  const fetchStreak = async () => {
    try {
      const res = await fetch("/api/gamification/streak")
      if (res.ok) {
        const data = await res.json()
        setStreak(data)
      }
    } catch (error) {
      console.error("Failed to fetch streak:", error)
    } finally {
      setLoading(false)
    }
  }

  // Animation for streak number
  const countSpring = useSpring({
    from: { number: 0 },
    to: { number: streak?.currentStreak || 0 },
    config: { tension: 200, friction: 20 },
  })

  // Pulsing animation for fire
  const pulseSpring = useSpring({
    loop: true,
    from: { scale: 1, opacity: 0.8 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.1, opacity: 1 })
        await next({ scale: 1, opacity: 0.8 })
      }
    },
    config: { duration: 1000 },
  })

  if (loading) {
    return (
      <div className={cn("h-8 w-16 animate-pulse rounded-full bg-muted", className)} />
    )
  }

  if (!streak) return null

  const status = getStreakStatusMessage(streak)
  const milestone = getStreakMilestone(streak.currentStreak)
  const intensity = getStreakIntensity(streak.currentStreak)

  // Color intensity based on streak length
  const fireColors = [
    "text-orange-400", // Level 1
    "text-orange-500", // Level 2
    "text-red-500",    // Level 3
    "text-red-600",    // Level 4
    "text-rose-600",   // Level 5
  ]
  const fireColor = fireColors[intensity - 1]

  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <animated.div
              style={streak.currentStreak > 0 && streak.isActiveToday ? pulseSpring : {}}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 cursor-default",
                streak.currentStreak > 0
                  ? "bg-gradient-to-r from-orange-500/20 to-red-500/20"
                  : "bg-muted",
                streak.willExpireToday && "ring-2 ring-[#C4515E] ring-offset-2 ring-offset-background",
                className
              )}
            >
              {streak.willExpireToday ? (
                <AlertTriangle className="h-4 w-4 text-[#C4515E] animate-pulse" />
              ) : (
                <Flame className={cn("h-4 w-4", fireColor)} />
              )}
              <animated.span className="font-bold text-sm">
                {countSpring.number.to((n) => Math.round(n))}
              </animated.span>
            </animated.div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-center">
            <p className="font-semibold">{status.message}</p>
            <p className="text-xs text-muted-foreground">{status.subtext}</p>
            {milestone && (
              <p className="text-xs text-muted-foreground mt-1">
                {milestone.rewardEmoji} {milestone.next - milestone.current} days to next milestone
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Full variant
  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <div className="flex items-center gap-4">
        <animated.div
          style={streak.currentStreak > 0 && streak.isActiveToday ? pulseSpring : {}}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            streak.currentStreak > 0
              ? "bg-gradient-to-br from-orange-500 to-red-500"
              : "bg-muted"
          )}
        >
          <Flame className="h-8 w-8 text-white" />
        </animated.div>

        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <animated.span className="text-3xl font-bold">
              {countSpring.number.to((n) => Math.round(n))}
            </animated.span>
            <span className="text-muted-foreground">day streak</span>
          </div>
          <p className="text-sm text-muted-foreground">{status.subtext}</p>
        </div>

        {streak.willExpireToday && (
          <div className="flex items-center gap-2 rounded-lg bg-[#C4515E]/20 px-3 py-2">
            <AlertTriangle className="h-5 w-5 text-[#C4515E]" />
            <span className="text-sm font-medium text-[#C4515E]">
              Expires today!
            </span>
          </div>
        )}
      </div>

      {milestone && streak.currentStreak > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{milestone.current} days</span>
            <span>{milestone.rewardEmoji} {milestone.next} days</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
              style={{ width: `${milestone.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>🏆 Best: {streak.longestStreak} days</span>
        <span>📅 Total: {streak.totalActiveDays} active days</span>
      </div>
    </div>
  )
}
