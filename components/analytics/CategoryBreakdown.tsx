"use client"

import { useMemo } from "react"
import { animated, useSpring, useSprings, config } from "@react-spring/web"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Shirt, Footprints, Watch, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface CategoryBreakdownProps {
  categoryBreakdown: Record<string, number>
  className?: string
}

interface CategoryInfo {
  icon: LucideIcon
  emoji: string
  label: string
  gradient: string
  bgColor: string
}

const categoryConfig: Record<string, CategoryInfo> = {
  top: {
    icon: Shirt,
    emoji: "👕",
    label: "Tops",
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
  },
  bottom: {
    icon: Shirt,
    emoji: "👖",
    label: "Bottoms",
    gradient: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-500/10",
  },
  dress: {
    icon: Sparkles,
    emoji: "👗",
    label: "Dresses",
    gradient: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-500/10",
  },
  jacket: {
    icon: Shirt,
    emoji: "🧥",
    label: "Jackets",
    gradient: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-500/10",
  },
  outerwear: {
    icon: Shirt,
    emoji: "🧥",
    label: "Outerwear",
    gradient: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-500/10",
  },
  shoes: {
    icon: Footprints,
    emoji: "👟",
    label: "Shoes",
    gradient: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  accessories: {
    icon: Watch,
    emoji: "👜",
    label: "Accessories",
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
  },
}

const defaultCategoryInfo: CategoryInfo = {
  icon: Sparkles,
  emoji: "✨",
  label: "Other",
  gradient: "from-gray-500 to-gray-600",
  bgColor: "bg-gray-500/10",
}

export function CategoryBreakdown({ categoryBreakdown, className }: CategoryBreakdownProps) {
  const categoryData = useMemo(() => {
    const total = Object.values(categoryBreakdown).reduce((sum, count) => sum + count, 0)

    return Object.entries(categoryBreakdown)
      .map(([category, count]) => ({
        category,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        config: categoryConfig[category.toLowerCase()] || defaultCategoryInfo,
      }))
      .sort((a, b) => b.count - a.count)
  }, [categoryBreakdown])

  const total = categoryData.reduce((sum, item) => sum + item.count, 0)

  // Entry animation
  const containerSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  })

  // Staggered animations for each category bar
  const barSprings = useSprings(
    categoryData.length,
    categoryData.map((item, index) => ({
      from: { width: 0, opacity: 0, x: -20 },
      to: { width: item.percentage, opacity: 1, x: 0 },
      delay: 150 + index * 100,
      config: { tension: 180, friction: 20 },
    }))
  )

  if (categoryData.length === 0) {
    return (
      <Card className={cn("card-enhanced", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            Category Mix
          </CardTitle>
          <CardDescription>Your wardrobe composition</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Add items to see your category breakdown
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <animated.div style={containerSpring}>
      <Card className={cn("card-enhanced", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            Category Mix
          </CardTitle>
          <CardDescription>
            {total} items across {categoryData.length} categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryData.map((item, index) => {
            const Icon = item.config.icon

            return (
              <animated.div
                key={item.category}
                style={{
                  opacity: barSprings[index].opacity,
                  transform: barSprings[index].x.to(x => `translateX(${x}px)`),
                }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      item.config.bgColor
                    )}>
                      <span className="text-lg">{item.config.emoji}</span>
                    </div>
                    <div>
                      <p className="font-medium capitalize">{item.config.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} {item.count === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{item.percentage.toFixed(0)}%</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <animated.div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r",
                      item.config.gradient
                    )}
                    style={{
                      width: barSprings[index].width.to(w => `${w}%`),
                    }}
                  />
                </div>
              </animated.div>
            )
          })}

          {/* Visual breakdown summary */}
          <div className="pt-4 mt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {categoryData.slice(0, 5).map((item) => (
                <div
                  key={item.category}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                    item.config.bgColor
                  )}
                >
                  <span>{item.config.emoji}</span>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </animated.div>
  )
}
