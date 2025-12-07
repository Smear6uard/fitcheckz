"use client"

import { useState } from "react"
import Image from "next/image"
import { animated, useSpring } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, X } from "lucide-react"
import type { WardrobeItem } from "@/types/wardrobe"
import type { OutfitScores } from "@/lib/ai/outfit-scorer"
import { OutfitScoreCard } from "./OutfitScoreCard"

interface SwipeCardProps {
  outfit: {
    id: string
    wardrobe_item_ids: string[]
    items: WardrobeItem[]
    ai_explanation?: string
    risk_level?: number
    occasion?: string
    liked?: boolean
    visualization_url?: string | null
    scores?: OutfitScores
    overall_score?: number
  }
  onSwipeRight: () => void
  onSwipeLeft: () => void
}

const SWIPE_THRESHOLD = 100

export function SwipeCard({ outfit, onSwipeRight, onSwipeLeft }: SwipeCardProps) {
  const [swiped, setSwiped] = useState(false)

  const [{ x, y, rotateZ, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotateZ: 0,
    scale: 1,
  }))

  const bind = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx] }) => {
      const trigger = Math.abs(mx) > SWIPE_THRESHOLD

      if (!active && trigger) {
        const dir = dx > 0 ? 1 : -1
        setSwiped(true)

        // Animate card off screen
        api.start({
          x: dir * 1000,
          rotateZ: dir * 30,
          config: { friction: 50, tension: 200 },
          onRest: () => {
            if (dir > 0) {
              onSwipeRight()
            } else {
              onSwipeLeft()
            }
            // Reset for next card
            api.set({ x: 0, y: 0, rotateZ: 0, scale: 1 })
            setSwiped(false)
          },
        })
      } else if (active) {
        // While dragging
        api.start({
          x: mx,
          y: 0,
          rotateZ: mx / 20,
          scale: active ? 1.05 : 1,
          config: { friction: 50, tension: 800 },
        })
      } else {
        // Release without threshold - snap back
        api.start({
          x: 0,
          y: 0,
          rotateZ: 0,
          scale: 1,
          config: { friction: 50, tension: 500 },
        })
      }
    },
    {
      axis: "x",
      bounds: { left: -1000, right: 1000, top: 0, bottom: 0 },
      rubberband: true,
    }
  )

  const opacity = x.to([-200, -100, 0, 100, 200], [0, 0.5, 1, 0.5, 0])
  const likeOpacity = x.to([0, 100], [0, 1])
  const nopeOpacity = x.to([-100, 0], [1, 0])

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        y,
        rotateZ,
        scale,
        opacity,
        touchAction: "none",
        cursor: "grab",
      }}
      className="relative w-full max-w-md mx-auto select-none"
    >
      <Card className="overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          {/* Swipe Indicators */}
          <animated.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 right-8 z-10 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-2xl rotate-12 border-4 border-green-600"
          >
            <Heart className="inline mr-2 h-6 w-6 fill-current" />
            LIKE
          </animated.div>

          <animated.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 left-8 z-10 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-2xl -rotate-12 border-4 border-red-600"
          >
            <X className="inline mr-2 h-6 w-6" />
            NOPE
          </animated.div>

          {/* Outfit Items Grid */}
          <div className="grid grid-cols-2 gap-2 p-4 bg-muted/50">
            {outfit.items?.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="aspect-square relative rounded-lg overflow-hidden bg-background"
              >
                <Image
                  src={item.photo_url}
                  alt={item.item_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>

          {/* Outfit Details */}
          <div className="p-6 space-y-4">
            {/* Occasion & Risk Level */}
            <div className="flex items-center gap-2">
              {outfit.occasion && (
                <Badge variant="secondary" className="capitalize">
                  {outfit.occasion}
                </Badge>
              )}
              {outfit.risk_level !== undefined && (
                <Badge variant="outline">
                  Boldness: {outfit.risk_level}/5
                </Badge>
              )}
            </div>

            {/* AI Explanation */}
            {outfit.ai_explanation && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {outfit.ai_explanation}
              </p>
            )}

            {/* Outfit Scores */}
            {outfit.scores && (
              <div>
                <OutfitScoreCard scores={outfit.scores} compact />
              </div>
            )}

            {/* Overall Score */}
            {outfit.overall_score !== undefined && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium">Overall Match</span>
                <span className="text-lg font-bold text-primary">
                  {outfit.overall_score}/100
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Swipe Instructions */}
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Swipe right to like, left to pass
      </div>
    </animated.div>
  )
}
