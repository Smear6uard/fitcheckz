"use client"

import { useMemo } from "react"
import { animated, useSpring, useSprings, config } from "@react-spring/web"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlertTriangle, Info, Lightbulb, Sparkles, CheckCircle2 } from "lucide-react"
import { analyzeWardrobeGaps, getWardrobeStrengths, type WardrobeGap } from "@/lib/analytics/wardrobe-gaps"

interface WardrobeGapsProps {
  stats: {
    totalItems: number
    categoryBreakdown: Record<string, number>
    colorBreakdown: Record<string, number>
  }
  className?: string
}

export function WardrobeGaps({ stats, className }: WardrobeGapsProps) {
  const gaps = useMemo(() => analyzeWardrobeGaps(stats), [stats])
  const strengths = useMemo(() => getWardrobeStrengths(stats), [stats])

  // Entry animation
  const containerSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  })

  // Staggered animations for gap cards
  const gapSprings = useSprings(
    gaps.length,
    gaps.map((_, index) => ({
      from: { opacity: 0, x: -20 },
      to: { opacity: 1, x: 0 },
      delay: 200 + index * 100,
      config: config.gentle,
    }))
  )

  const getSeverityConfig = (severity: WardrobeGap["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          icon: AlertTriangle,
          gradient: "from-red-500/20 to-orange-500/20",
          border: "border-red-500/30",
          badge: "bg-red-500/20 text-red-700 dark:text-red-300",
          iconColor: "text-red-500",
        }
      case "moderate":
        return {
          icon: Info,
          gradient: "from-amber-500/20 to-yellow-500/20",
          border: "border-amber-500/30",
          badge: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
          iconColor: "text-amber-500",
        }
      case "suggestion":
        return {
          icon: Lightbulb,
          gradient: "from-blue-500/20 to-[rgba(20,184,166,0.2)]",
          border: "border-blue-500/30",
          badge: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
          iconColor: "text-blue-500",
        }
    }
  }

  if (stats.totalItems === 0) {
    return (
      <Card className={cn("card-enhanced", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            Style Insights
          </CardTitle>
          <CardDescription>Personalized wardrobe recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-brand-lime mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Add items to get personalized insights!
            </p>
            <p className="text-xs text-muted-foreground">
              We&apos;ll analyze your wardrobe and suggest improvements
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <animated.div style={containerSpring}>
      <Card className={cn("card-enhanced", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            Style Insights
          </CardTitle>
          <CardDescription>
            {gaps.length === 0
              ? "Your wardrobe is looking great!"
              : `${gaps.length} opportunities to level up your closet`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strengths Section */}
          {strengths.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                What&apos;s Working
              </h4>
              <div className="flex flex-wrap gap-2">
                {strengths.map((strength, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300"
                  >
                    ✓ {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Gaps Section */}
          {gaps.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Opportunities
              </h4>
              <div className="space-y-3">
                {gaps.map((gap, index) => {
                  const config = getSeverityConfig(gap.severity)
                  const Icon = config.icon

                  return (
                    <animated.div
                      key={`${gap.type}-${gap.title}`}
                      style={{
                        opacity: gapSprings[index]?.opacity,
                        transform: gapSprings[index]?.x.to(x => `translateX(${x}px)`),
                      }}
                      className={cn(
                        "relative rounded-xl border p-4 bg-gradient-to-r",
                        config.gradient,
                        config.border
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                          "bg-background/60"
                        )}>
                          <span className="text-xl">{gap.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-semibold">{gap.title}</h5>
                            <Badge className={cn("text-xs", config.badge)}>
                              <Icon className={cn("h-3 w-3 mr-1", config.iconColor)} />
                              {gap.severity === "critical" && "Priority"}
                              {gap.severity === "moderate" && "Consider"}
                              {gap.severity === "suggestion" && "Tip"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {gap.description}
                          </p>
                          <p className="text-sm font-medium mt-2 flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-brand-lime flex-shrink-0 mt-0.5" />
                            {gap.recommendation}
                          </p>
                        </div>
                      </div>
                    </animated.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Perfect wardrobe message */}
          {gaps.length === 0 && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="font-medium text-green-600 dark:text-green-400">
                Your wardrobe is well-balanced!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Keep building those fire outfits 🔥
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </animated.div>
  )
}
