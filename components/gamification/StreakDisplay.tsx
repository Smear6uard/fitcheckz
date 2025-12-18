"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Trophy, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDaysActive: number
  lastActiveDate: string | null
}

export function StreakDisplay() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStreak()
  }, [])

  const fetchStreak = async () => {
    try {
      const res = await fetch("/api/streak/update", {
        method: "POST",
      })
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

  if (loading || !streak) {
    return null
  }

  // Don't show if streak is 0
  if (streak.currentStreak === 0 && streak.totalDaysActive === 0) {
    return null
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" role="region" aria-label="Daily streak information">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-full p-2",
                streak.currentStreak > 0
                  ? "bg-gradient-to-br from-rose-500/20 to-orange-500/20 text-orange-500"
                  : "bg-muted text-muted-foreground"
              )}
              aria-hidden="true"
            >
              <Flame className={cn(
                "h-5 w-5",
                streak.currentStreak > 0 && "fill-orange-500"
              )} />
            </div>
            <div>
              <div className="text-2xl font-bold" aria-label={`Current streak: ${streak.currentStreak} days`}>
                {streak.currentStreak}
              </div>
              <div className="text-xs text-muted-foreground">
                Day {streak.currentStreak === 1 ? "Streak" : "Streak"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {streak.longestStreak > streak.currentStreak && (
              <div className="flex items-center gap-1.5 text-muted-foreground" aria-label={`Best streak: ${streak.longestStreak} days`}>
                <Trophy className="h-4 w-4" aria-hidden="true" />
                <span>Best: {streak.longestStreak}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground" aria-label={`Total days active: ${streak.totalDaysActive}`}>
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>{streak.totalDaysActive} days</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

