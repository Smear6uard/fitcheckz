"use client"

import { useState, useEffect } from "react"
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

// Dynamic threshold based on screen size (minimum 80px, scales with viewport)
const getSwipeThreshold = () => {
  if (typeof window === "undefined") return 100
  return Math.max(80, window.innerWidth * 0.2)
}

// Get exit distance (viewport width + padding to ensure card fully exits)
const getExitDistance = () => {
  if (typeof window === "undefined") return 1000
  return window.innerWidth * 1.5
}

export function SwipeCard({ outfit, onSwipeRight, onSwipeLeft }: SwipeCardProps) {
  const [swiped, setSwiped] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(0)

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // This is React's Rules of Hooks - hooks must be called in the same order every render
  useEffect(() => {
    // Get viewport width on mount and resize
    const updateViewport = () => {
      setViewportWidth(window.innerWidth)
    }
    updateViewport()
    window.addEventListener("resize", updateViewport)
    return () => window.removeEventListener("resize", updateViewport)
  }, [])

  const [{ x, y, rotateZ, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotateZ: 0,
    scale: 1,
  }))

  const bind = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx] }) => {
      const swipeThreshold = getSwipeThreshold()
      const exitDistance = getExitDistance()
      const absVx = Math.abs(vx)
      const absMx = Math.abs(mx)
      
      // Velocity threshold for fast flicks (pixels per second)
      const VELOCITY_THRESHOLD = 0.5
      // Distance threshold
      const distanceTrigger = absMx > swipeThreshold
      // Velocity trigger - fast flick even if distance is small
      const velocityTrigger = absVx > VELOCITY_THRESHOLD

      if (!active && (distanceTrigger || velocityTrigger)) {
        const dir = dx > 0 ? 1 : -1
        setSwiped(true)

        // Calculate exit position - ensure card fully exits screen
        const exitX = dir * exitDistance
        const exitRotation = dir * 25

        // Animate card off screen with smooth physics
        api.start({
          x: exitX,
          rotateZ: exitRotation,
          scale: 0.8,
          config: { 
            friction: 30, 
            tension: 300,
            velocity: absVx * 0.5 // Use velocity for smoother exit
          },
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
        // While dragging - follow finger with rotation and slight scale
        const rotation = mx / 15 // More pronounced rotation
        const currentScale = 1 + Math.abs(mx) * 0.0003 // Subtle scale increase
        
        api.start({
          x: mx,
          y: 0,
          rotateZ: rotation,
          scale: currentScale,
          immediate: true,
          config: { friction: 50, tension: 800 },
        })
      } else {
        // Release without threshold - snap back smoothly
        api.start({
          x: 0,
          y: 0,
          rotateZ: 0,
          scale: 1,
          config: { friction: 40, tension: 400 },
        })
      }
    },
    {
      axis: "x",
      bounds: (state) => {
        const exitDist = getExitDistance()
        return { left: -exitDist, right: exitDist, top: 0, bottom: 0 }
      },
      rubberband: true,
      preventScrollAxis: "y",
      filterTaps: true,
    }
  )

  // Improved opacity calculation - fade out as card exits
  const opacity = x.to(
    (val) => {
      const absX = Math.abs(val)
      const vw = viewportWidth || (typeof window !== "undefined" ? window.innerWidth : 400)
      const fadeStart = vw * 0.3
      if (absX < fadeStart) return 1
      const fadeEnd = vw * 0.8
      if (absX > fadeEnd) return 0
      return 1 - (absX - fadeStart) / (fadeEnd - fadeStart)
    }
  )

  // Like indicator opacity - shows when swiping right
  const likeOpacity = x.to((val) => {
    if (val < 0) return 0
    return Math.min(1, val / 100)
  })

  // Nope indicator opacity - shows when swiping left
  const nopeOpacity = x.to((val) => {
    if (val > 0) return 0
    return Math.min(1, Math.abs(val) / 100)
  })

  // Safety check - AFTER all hooks to comply with React's Rules of Hooks
  if (!outfit || !outfit.id) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>Outfit data is missing</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
        willChange: "transform",
      }}
      className="relative w-full max-w-md mx-auto select-none z-50"
    >
      <Card className="overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          {/* Swipe Indicators */}
          <animated.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 right-8 z-10 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-2xl rotate-12 border-4 border-green-600"
            role="status"
            aria-live="polite"
            aria-label="Like indicator"
          >
            <Heart className="inline mr-2 h-6 w-6 fill-current" aria-hidden="true" />
            LIKE
          </animated.div>

          <animated.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 left-8 z-10 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-2xl -rotate-12 border-4 border-red-600"
            role="status"
            aria-live="polite"
            aria-label="Pass indicator"
          >
            <X className="inline mr-2 h-6 w-6" aria-hidden="true" />
            NOPE
          </animated.div>

          {/* Outfit Items Grid */}
          <div className="grid grid-cols-2 gap-2 p-4 bg-muted/50">
            {outfit.items && outfit.items.length > 0 ? (
              outfit.items.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="aspect-square relative rounded-lg overflow-hidden bg-background"
                >
                  {item.photo_url ? (
                    <Image
                      src={item.photo_url}
                      alt={item.item_name || 'Wardrobe item'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {item.item_name || 'Item'}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-muted-foreground py-8">
                No items in this outfit
              </div>
            )}
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
      <div className="mt-4 text-center text-xs text-muted-foreground" role="status" aria-live="polite">
        Swipe right to like, left to pass
      </div>
    </animated.div>
  )
}
