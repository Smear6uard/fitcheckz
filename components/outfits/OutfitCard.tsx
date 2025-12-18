"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { animated, useSpring, config } from "@react-spring/web"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Sparkles } from "lucide-react"
import type { WardrobeItem } from "@/types/wardrobe"
import type { OutfitScores } from "@/lib/ai/outfit-scorer"
import { VisualizationButton } from "./VisualizationButton"
import { OutfitScoreCard } from "./OutfitScoreCard"
import { ShareButton } from "@/components/social/ShareButton"
import { PublicToggle } from "@/components/social/PublicToggle"
import { QuickReactions, type ReactionType } from "./QuickReactions"
import { useSwipeGesture } from "@/lib/hooks/useSwipeGesture"
import { toast } from "@/lib/utils/toast-personality"
import { cn } from "@/lib/utils"

interface OutfitCardProps {
  outfit: {
    id: string
    wardrobe_item_ids: string[]
    items: WardrobeItem[]
    ai_explanation?: string
    risk_level?: number
    occasion?: string
    liked?: boolean
    reaction?: ReactionType
    visualization_url?: string | null
    scores?: OutfitScores
    overall_score?: number
    is_public?: boolean
  }
  onLike?: (id: string, liked: boolean) => void
  onReaction?: (id: string, reaction: ReactionType) => void
  showPublicToggle?: boolean
}

export function OutfitCard({ outfit, onLike, onReaction, showPublicToggle = false }: OutfitCardProps) {
  const [visualizationUrl, setVisualizationUrl] = useState(outfit.visualization_url)
  const [currentReaction, setCurrentReaction] = useState<ReactionType>(outfit.reaction || null)
  const [isHovered, setIsHovered] = useState(false)

  // Card hover animation
  const cardSpring = useSpring({
    transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
    boxShadow: isHovered
      ? "0 12px 28px -8px rgba(34, 211, 238, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.08)"
      : "0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
    config: config.gentle,
  })

  const handleReaction = useCallback(
    (reaction: ReactionType) => {
      setCurrentReaction(reaction)

      // Also handle the like state for backwards compatibility
      if (onLike) {
        onLike(outfit.id, reaction === "love")
      }

      if (onReaction) {
        onReaction(outfit.id, reaction)
      }

      // Show appropriate toast
      if (reaction === "love") {
        toast.success("Outfit saved to favorites!")
      } else if (reaction === "maybe") {
        toast.info("Saved for later consideration")
      } else if (reaction === "nope") {
        toast.info("Got it, we'll show you different styles")
      }
    },
    [outfit.id, onLike, onReaction]
  )

  const handleSwipeRight = () => {
    if (currentReaction !== "love") {
      handleReaction("love")
    }
  }

  const handleSwipeLeft = () => {
    if (currentReaction !== "nope") {
      handleReaction("nope")
    }
  }

  const { bind, style } = useSwipeGesture({
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
    threshold: 100,
  })

  const AnimatedCard = animated(Card)

  return (
    <AnimatedCard
      {...bind()}
      style={{ ...style, ...cardSpring }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-enhanced overflow-hidden"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-brand-lime" />
              Outfit Suggestion
            </CardTitle>
            <CardDescription className="mt-1">
              {outfit.occasion && (
                <Badge
                  variant="secondary"
                  className="mr-2 bg-gradient-to-r from-brand-lavender/30 to-brand-teal/20"
                >
                  {outfit.occasion}
                </Badge>
              )}
              {outfit.risk_level && (
                <span className="text-xs text-muted-foreground">
                  Boldness: {"🔥".repeat(Math.min(outfit.risk_level, 5))}
                </span>
              )}
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            {/* Public toggle */}
            {showPublicToggle && (
              <PublicToggle
                outfitId={outfit.id}
                initialIsPublic={outfit.is_public}
                showLabel={false}
              />
            )}

            {/* Overall score badge */}
            {outfit.overall_score && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-lime to-brand-teal text-sm font-bold text-brand-charcoal">
                {outfit.overall_score}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {visualizationUrl && (
          <div className="mb-4">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
              <Image
                src={visualizationUrl}
                alt="Outfit visualization"
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23808080' filter='url(%23b)'/%3E%3C/svg%3E"
                loading="lazy"
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {outfit.items?.slice(0, 4).map((item) => (
            <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden bg-muted">
              <Image
                src={item.photo_url}
                alt={item.item_name}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23808080' filter='url(%23b)'/%3E%3C/svg%3E"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        {outfit.ai_explanation && (
          <p className="text-sm text-muted-foreground mb-4">
            {outfit.ai_explanation}
          </p>
        )}

        {/* Outfit Score */}
        {outfit.scores && (
          <div className="mb-4">
            <OutfitScoreCard scores={outfit.scores} compact />
          </div>
        )}

        {/* Quick Reactions */}
        <div className="mb-4 flex justify-center">
          <QuickReactions
            outfitId={outfit.id}
            currentReaction={currentReaction}
            onReaction={handleReaction}
            size="md"
          />
        </div>

        <div className="space-y-2">
          <VisualizationButton
            outfitId={outfit.id}
            existingVisualization={visualizationUrl}
            onVisualizationComplete={(url) => setVisualizationUrl(url)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" asChild className="touch-target">
              <Link href={`/outfits/${outfit.id}`}>
                View Details
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <ShareButton
              outfitId={outfit.id}
              occasion={outfit.occasion}
              score={outfit.overall_score}
              className="touch-target"
            />
          </div>
        </div>

        {/* Swipe gesture hint - mobile only */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground md:hidden">
          <span className="rounded-full bg-brand-lavender/20 px-2 py-1">
            👈 Swipe to react 👉
          </span>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}

