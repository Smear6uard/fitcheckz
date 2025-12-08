"use client"

import { useMemo, useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { TrendingUp, Zap, Palette, Scale, Sparkles, ChevronRight } from "lucide-react"
import { calculateStyleScore, STYLE_LEVELS, type StyleScoreResult } from "@/lib/analytics/style-score"

interface StyleScoreProps {
  stats: {
    totalItems: number
    categoryBreakdown: Record<string, number>
    colorBreakdown: Record<string, number>
  }
  outfitsGenerated?: number
  outfitsWorn?: number
  avgOutfitScore?: number
  className?: string
}

export function StyleScore({
  stats,
  outfitsGenerated,
  outfitsWorn,
  avgOutfitScore,
  className,
}: StyleScoreProps) {
  const [showDetails, setShowDetails] = useState(false)

  const result = useMemo(
    () =>
      calculateStyleScore({
        ...stats,
        outfitsGenerated,
        outfitsWorn,
        avgOutfitScore,
      }),
    [stats, outfitsGenerated, outfitsWorn, avgOutfitScore]
  )

  // Entry animation
  const containerSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  })

  // Score counter animation
  const scoreSpring = useSpring({
    from: { score: 0 },
    to: { score: result.score },
    delay: 300,
    config: { tension: 120, friction: 14 },
  })

  // Circle progress animation
  const circleSpring = useSpring({
    from: { strokeDashoffset: 283 },
    to: { strokeDashoffset: 283 - (result.score / 100) * 283 },
    delay: 300,
    config: { tension: 120, friction: 14 },
  })

  // Breakdown bars animation
  const breakdownSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: showDetails ? 1 : 0 },
    config: config.gentle,
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-brand-lime"
    if (score >= 40) return "text-amber-500"
    if (score >= 20) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500"
    if (score >= 60) return "from-brand-lime to-brand-teal"
    if (score >= 40) return "from-amber-500 to-yellow-500"
    if (score >= 20) return "from-orange-500 to-amber-500"
    return "from-red-500 to-orange-500"
  }

  const breakdownItems = [
    { key: "versatility", label: "Versatility", icon: Zap, value: result.breakdown.versatility },
    { key: "variety", label: "Variety", icon: Palette, value: result.breakdown.variety },
    { key: "balance", label: "Balance", icon: Scale, value: result.breakdown.balance },
    { key: "activity", label: "Activity", icon: TrendingUp, value: result.breakdown.activity },
  ]

  if (stats.totalItems < 3) {
    return (
      <Card className={cn("card-enhanced", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            Style Score
          </CardTitle>
          <CardDescription>Your wardrobe rating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <p className="font-medium">Add at least 3 items to unlock</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your Style Score awaits!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <animated.div style={containerSpring}>
      <Card className={cn("card-enhanced overflow-hidden", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            Style Score
          </CardTitle>
          <CardDescription>
            {result.level.title} – {result.level.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Score Circle */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg width="160" height="160" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                {/* Progress circle */}
                <animated.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  style={{
                    strokeDashoffset: circleSpring.strokeDashoffset,
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a3e635" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Score number in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <animated.span className={cn("text-4xl font-bold", getScoreColor(result.score))}>
                  {scoreSpring.score.to((s) => Math.round(s))}
                </animated.span>
                <span className="text-xs text-muted-foreground">out of 100</span>
              </div>
            </div>

            {/* Level badge */}
            <div className="mt-4 flex items-center gap-2">
              <Badge
                className={cn(
                  "text-lg px-4 py-1 bg-gradient-to-r text-white",
                  getScoreGradient(result.score)
                )}
              >
                {result.level.emoji} {result.level.title}
              </Badge>
            </div>

            {/* Progress to next level */}
            {result.nextLevel && (
              <div className="mt-4 w-full max-w-xs">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{result.level.emoji} {result.level.name}</span>
                  <span>{result.nextLevel.emoji} {result.nextLevel.name}</span>
                </div>
                <Progress
                  value={
                    ((result.score - result.level.minScore) /
                      (result.nextLevel.minScore - result.level.minScore)) *
                    100
                  }
                  className="h-2"
                />
                <p className="text-center text-xs text-muted-foreground mt-1">
                  {result.pointsToNextLevel} points to {result.nextLevel.title}
                </p>
              </div>
            )}
          </div>

          {/* Toggle details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDetails ? "Hide" : "Show"} breakdown
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                showDetails && "rotate-90"
              )}
            />
          </button>

          {/* Score Breakdown */}
          <animated.div style={breakdownSpring} className={cn(!showDetails && "hidden")}>
            <div className="space-y-3 pt-2 border-t border-border">
              {breakdownItems.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.key} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className={getScoreColor(item.value)}>{item.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-1">
                        <div
                          className={cn(
                            "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                            getScoreGradient(item.value)
                          )}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Insights */}
            {result.insights.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-lime" />
                  Tips to improve
                </h4>
                <ul className="space-y-1">
                  {result.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-brand-lime">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </animated.div>
        </CardContent>
      </Card>
    </animated.div>
  )
}
