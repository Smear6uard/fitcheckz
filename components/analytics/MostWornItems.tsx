"use client"

import { animated, useSpring, useSprings, config } from "@react-spring/web"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Crown, Flame, Star, TrendingUp } from "lucide-react"
import Image from "next/image"

interface WornItem {
  id: string
  name: string
  category: string
  image_url: string | null
  worn_count: number
}

interface MostWornItemsProps {
  items: WornItem[]
  className?: string
}

export function MostWornItems({ items, className }: MostWornItemsProps) {
  // Entry animation
  const containerSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  })

  // Staggered item animations
  const itemSprings = useSprings(
    items.length,
    items.map((_, index) => ({
      from: { opacity: 0, scale: 0.9, y: 20 },
      to: { opacity: 1, scale: 1, y: 0 },
      delay: 200 + index * 100,
      config: config.gentle,
    }))
  )

  // Get badge for ranking
  const getBadge = (index: number) => {
    switch (index) {
      case 0:
        return {
          icon: Crown,
          label: "MVP",
          gradient: "from-yellow-400 to-amber-500",
          glow: "shadow-amber-500/30",
        }
      case 1:
        return {
          icon: Flame,
          label: "Hot",
          gradient: "from-orange-400 to-red-500",
          glow: "shadow-red-500/30",
        }
      case 2:
        return {
          icon: Star,
          label: "Fave",
          gradient: "from-purple-400 to-pink-500",
          glow: "shadow-pink-500/30",
        }
      default:
        return {
          icon: TrendingUp,
          label: "Rising",
          gradient: "from-blue-400 to-cyan-500",
          glow: "shadow-cyan-500/30",
        }
    }
  }

  if (items.length === 0) {
    return (
      <Card className={cn("card-enhanced", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            Most Worn
          </CardTitle>
          <CardDescription>Your wardrobe MVPs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-2">
              No data yet – mark outfits as worn to see your favorites!
            </p>
            <p className="text-xs text-muted-foreground">
              Your most-loved pieces will appear here
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
            <span className="text-xl">👑</span>
            Most Worn
          </CardTitle>
          <CardDescription>
            Your wardrobe MVPs – the pieces you reach for again and again
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.slice(0, 8).map((item, index) => {
              const badge = getBadge(index)
              const BadgeIcon = badge.icon

              return (
                <animated.div
                  key={item.id}
                  style={{
                    opacity: itemSprings[index]?.opacity,
                    transform: itemSprings[index]?.scale.to(
                      (s) => `scale(${s}) translateY(${itemSprings[index]?.y.get()}px)`
                    ),
                  }}
                  className="group relative"
                >
                  <div className={cn(
                    "relative aspect-square rounded-xl overflow-hidden border-2 border-transparent transition-all",
                    "hover:border-brand-lime hover:shadow-lg",
                    index === 0 && "ring-2 ring-amber-400 ring-offset-2 ring-offset-background"
                  )}>
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-4xl">
                          {item.category === "top" && "👕"}
                          {item.category === "bottom" && "👖"}
                          {item.category === "dress" && "👗"}
                          {item.category === "shoes" && "👟"}
                          {item.category === "accessories" && "👜"}
                          {!["top", "bottom", "dress", "shoes", "accessories"].includes(item.category) && "✨"}
                        </span>
                      </div>
                    )}

                    {/* Ranking badge */}
                    {index < 3 && (
                      <div className={cn(
                        "absolute -top-1 -right-1 flex items-center justify-center",
                        "h-7 w-7 rounded-full bg-gradient-to-br shadow-lg",
                        badge.gradient,
                        badge.glow
                      )}>
                        <BadgeIcon className="h-4 w-4 text-white" />
                      </div>
                    )}

                    {/* Worn count badge */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <Badge
                        variant="secondary"
                        className="w-full justify-center bg-background/80 backdrop-blur-sm"
                      >
                        <Flame className="h-3 w-3 mr-1 text-orange-500" />
                        {item.worn_count}x worn
                      </Badge>
                    </div>
                  </div>

                  {/* Item name */}
                  <p className="mt-2 text-sm font-medium truncate text-center">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground text-center capitalize">
                    {item.category}
                  </p>
                </animated.div>
              )
            })}
          </div>

          {items.length > 8 && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              +{items.length - 8} more well-loved pieces
            </p>
          )}
        </CardContent>
      </Card>
    </animated.div>
  )
}
