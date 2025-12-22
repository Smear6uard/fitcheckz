"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { OutfitCard } from "./OutfitCard"
import { OutfitEndState } from "./OutfitEndState"
import { DoubleTapHeart } from "./DoubleTapHeart"
import { useDoubleTap } from "@/lib/hooks/useDoubleTap"
import { haptics } from "@/lib/haptics"
import type { WardrobeItem } from "@/types/wardrobe"
import type { OutfitScores } from "@/lib/ai/outfit-scorer"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface Outfit {
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
  is_public?: boolean
}

interface OutfitFeedProps {
  outfits: Outfit[]
  onLike?: (id: string, liked: boolean) => void
  onFavorite?: (id: string, favorited: boolean) => void
  onCurateMore?: () => void
  className?: string
}

export function OutfitFeed({
  outfits,
  onLike,
  onFavorite,
  onCurateMore,
  className,
}: OutfitFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false)
  const [doubleTapPosition, setDoubleTapPosition] = useState({ x: 0, y: 0 })
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const lastSnapTime = useRef<number>(0)

  // Track which card is currently visible using IntersectionObserver
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observers: IntersectionObserver[] = []

    outfits.forEach((outfit, index) => {
      const cardEl = cardRefs.current.get(outfit.id)
      if (!cardEl) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Higher threshold (0.6) to prevent accidental swipe while scrolling text/buttons
            if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
              const now = Date.now()
              // Debounce to prevent rapid updates
              if (now - lastSnapTime.current > 100) {
                setCurrentIndex(index)
                lastSnapTime.current = now
                // Haptic feedback on snap
                haptics.swipe()
              }
            }
          })
        },
        {
          root: container,
          threshold: 0.6,
        }
      )

      observer.observe(cardEl)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [outfits])

  // Double-tap to like
  const handleDoubleTapLike = useCallback(
    (outfitId: string, event: React.MouseEvent | React.TouchEvent) => {
      // Get tap position for heart animation
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      let clientX: number, clientY: number

      if ("touches" in event) {
        clientX = event.touches[0]?.clientX ?? rect.left + rect.width / 2
        clientY = event.touches[0]?.clientY ?? rect.top + rect.height / 2
      } else {
        clientX = event.clientX
        clientY = event.clientY
      }

      setDoubleTapPosition({
        x: clientX - rect.left,
        y: clientY - rect.top,
      })
      setShowDoubleTapHeart(true)

      // Trigger like
      onLike?.(outfitId, true)
      haptics.like()

      // Hide heart after animation
      setTimeout(() => setShowDoubleTapHeart(false), 800)
    },
    [onLike]
  )

  const currentOutfit = outfits[currentIndex]
  const isEndReached = currentIndex >= outfits.length - 1
  const likedCount = outfits.filter((o) => o.liked).length

  // Scroll to specific card
  const scrollToCard = useCallback((index: number) => {
    const outfit = outfits[index]
    if (!outfit) return

    const cardEl = cardRefs.current.get(outfit.id)
    cardEl?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [outfits])

  if (outfits.length === 0) {
    return null
  }

  return (
    <div className={cn("relative", className)}>
      {/* Progress indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
        <span className="text-xs font-medium text-white">
          {currentIndex + 1} of {outfits.length}
        </span>
      </div>

      {/* Feed container - truly full-screen fixed overlay */}
      <div
        ref={containerRef}
        className="outfit-feed-fullscreen"
      >
        {outfits.map((outfit, index) => (
          <div
            key={outfit.id}
            ref={(el) => {
              if (el) cardRefs.current.set(outfit.id, el)
            }}
            className="outfit-card-fullscreen relative"
          >
            <DoubleTapWrapper
              onDoubleTap={(e) => handleDoubleTapLike(outfit.id, e)}
            >
              <OutfitCard
                outfit={outfit}
                variant="fullscreen"
                onLike={onLike}
                onFavorite={onFavorite}
              />

              {/* Double-tap heart overlay (only for current card) */}
              {showDoubleTapHeart && currentIndex === index && (
                <DoubleTapHeart
                  x={doubleTapPosition.x}
                  y={doubleTapPosition.y}
                />
              )}

              {/* Swipe affordance hint - only on first card when at first position */}
              {index === 0 && currentIndex === 0 && outfits.length > 1 && (
                <div className="absolute bottom-24 left-1/2 animate-bounce-subtle pointer-events-none">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <ChevronDown className="w-4 h-4" />
                    Swipe for more
                  </span>
                </div>
              )}
            </DoubleTapWrapper>
          </div>
        ))}

        {/* End state */}
        <div className="outfit-card-fullscreen">
          <OutfitEndState
            totalOutfits={outfits.length}
            likedCount={likedCount}
            onCurateMore={onCurateMore}
            onViewFavorites={() => {
              // Could navigate to favorites tab
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Helper component for double-tap detection
function DoubleTapWrapper({
  children,
  onDoubleTap,
}: {
  children: React.ReactNode
  onDoubleTap: (e: React.MouseEvent | React.TouchEvent) => void
}) {
  const lastTapRef = useRef<number>(0)
  const DOUBLE_TAP_DELAY = 300

  const handleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const now = Date.now()
      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        onDoubleTap(e)
        lastTapRef.current = 0
      } else {
        lastTapRef.current = now
      }
    },
    [onDoubleTap]
  )

  return (
    <div
      onClick={handleTap}
      className="h-full w-full"
    >
      {children}
    </div>
  )
}
