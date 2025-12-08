"use client"

import { useMemo } from "react"
import { animated, useSpring, useSprings, config } from "@react-spring/web"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ColorData {
  color: string
  count: number
  percentage: number
}

interface ColorDistributionChartProps {
  colorBreakdown: Record<string, number>
  className?: string
}

// Map common color names to CSS colors
const colorMap: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f5f5f5",
  navy: "#1e3a5f",
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  pink: "#ec4899",
  purple: "#a855f7",
  brown: "#92400e",
  gray: "#6b7280",
  grey: "#6b7280",
  beige: "#d4c4a8",
  cream: "#fffdd0",
  tan: "#d2b48c",
  olive: "#556b2f",
  maroon: "#800000",
  burgundy: "#722f37",
  teal: "#14b8a6",
  coral: "#ff7f50",
  lavender: "#e6e6fa",
  mint: "#98fb98",
  peach: "#ffcba4",
  khaki: "#c3b091",
  denim: "#1560bd",
  charcoal: "#36454f",
  ivory: "#fffff0",
  rust: "#b7410e",
  mustard: "#ffdb58",
  sage: "#87ae73",
  blush: "#de5d83",
  terracotta: "#e2725b",
  camel: "#c19a6b",
}

function getColorCSS(colorName: string): string {
  const normalized = colorName.toLowerCase().trim()

  // Check if it's already a hex/rgb color
  if (normalized.startsWith("#") || normalized.startsWith("rgb")) {
    return normalized
  }

  // Check our color map
  if (colorMap[normalized]) {
    return colorMap[normalized]
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value
    }
  }

  // Fallback to a neutral color
  return "#9ca3af"
}

export function ColorDistributionChart({ colorBreakdown, className }: ColorDistributionChartProps) {
  const colorData = useMemo(() => {
    const total = Object.values(colorBreakdown).reduce((sum, count) => sum + count, 0)

    return Object.entries(colorBreakdown)
      .map(([color, count]) => ({
        color,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // Top 8 colors
  }, [colorBreakdown])

  // Entry animation
  const containerSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  })

  // Staggered bar animations
  const barSprings = useSprings(
    colorData.length,
    colorData.map((_, index) => ({
      from: { width: "0%", opacity: 0 },
      to: { width: "100%", opacity: 1 },
      delay: 100 + index * 80,
      config: { tension: 200, friction: 20 },
    }))
  )

  if (colorData.length === 0) {
    return (
      <Card className={cn("card-enhanced", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            Color Palette
          </CardTitle>
          <CardDescription>Your wardrobe colors</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Add items to see your color distribution
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate donut chart segments
  const donutRadius = 80
  const donutStroke = 24
  const circumference = 2 * Math.PI * donutRadius
  let cumulativePercent = 0

  return (
    <animated.div style={containerSpring}>
      <Card className={cn("card-enhanced overflow-hidden", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            Color Palette
          </CardTitle>
          <CardDescription>Your wardrobe&apos;s color story</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Donut Chart */}
            <div className="relative flex-shrink-0">
              <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                {colorData.map((item, index) => {
                  const strokeDasharray = (item.percentage / 100) * circumference
                  const strokeDashoffset = -(cumulativePercent / 100) * circumference
                  cumulativePercent += item.percentage

                  return (
                    <circle
                      key={item.color}
                      cx="100"
                      cy="100"
                      r={donutRadius}
                      fill="none"
                      stroke={getColorCSS(item.color)}
                      strokeWidth={donutStroke}
                      strokeDasharray={`${strokeDasharray} ${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  )
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{colorData.length}</div>
                  <div className="text-xs text-muted-foreground">colors</div>
                </div>
              </div>
            </div>

            {/* Color Legend */}
            <div className="flex-1 space-y-3 w-full">
              {colorData.map((item, index) => (
                <animated.div
                  key={item.color}
                  style={barSprings[index]}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-border shadow-sm"
                        style={{ backgroundColor: getColorCSS(item.color) }}
                      />
                      <span className="capitalize font-medium">{item.color}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <animated.div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: barSprings[index].width.to(w => `${(item.percentage / 100) * parseFloat(w)}%`),
                        backgroundColor: getColorCSS(item.color),
                      }}
                    />
                  </div>
                </animated.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </animated.div>
  )
}
