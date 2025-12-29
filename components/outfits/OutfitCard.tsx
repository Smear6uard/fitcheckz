"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { animated, useSpring, config } from "@react-spring/web"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { WardrobeItem } from "@/types/wardrobe"
import type { OutfitScores } from "@/lib/ai/outfit-scorer"
import { VisualizationButton } from "./VisualizationButton"
import { OutfitScoreCard, OutfitScoreBadge } from "./OutfitScoreCard"
import { OutfitActions } from "./OutfitActions"
import { PublicToggle } from "@/components/social/PublicToggle"
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
    visualization_url?: string | null
    scores?: OutfitScores
    overall_score?: number
    is_public?: boolean
  }
  variant?: "fullscreen" | "grid"
  onLike?: (id: string, liked: boolean) => void
  onFavorite?: (id: string, favorited: boolean) => void
  showPublicToggle?: boolean
  className?: string
}

export function OutfitCard({
  outfit,
  variant = "grid",
  onLike,
  onFavorite,
  showPublicToggle = false,
  className,
}: OutfitCardProps) {
  const [visualizationUrl, setVisualizationUrl] = useState(outfit.visualization_url)
  const [isHovered, setIsHovered] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Card hover animation (grid only)
  const cardSpring = useSpring({
    transform: isHovered && variant === "grid" ? "translateY(-4px) scale(1.02)" : "translateY(0px) scale(1)",
    boxShadow: isHovered && variant === "grid"
      ? "0 12px 28px -8px rgba(20, 184, 166, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.08)"
      : "0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
    config: config.gentle,
  })

  const handleLike = useCallback(
    (liked: boolean) => {
      onLike?.(outfit.id, liked)
    },
    [outfit.id, onLike]
  )

  const handleFavorite = useCallback(
    (favorited: boolean) => {
      onFavorite?.(outfit.id, favorited)
    },
    [outfit.id, onFavorite]
  )

  const AnimatedCard = animated(Card)

  // Fullscreen variant for mobile feed
  if (variant === "fullscreen") {
    return (
      <div className={cn("outfit-card-fullscreen flex flex-col bg-background safe-area-bottom", className)}>
        {/* Header: Occasion + Score */}
        <div className="flex items-center justify-between px-4 py-3 safe-area-top">
          <div className="flex items-center gap-2">
            {outfit.occasion && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-brand-accent/20 to-brand-accent-secondary/20 text-foreground"
              >
                {outfit.occasion}
              </Badge>
            )}
            {outfit.risk_level && (
              <span className="text-xs text-muted-foreground">
                {"🔥".repeat(Math.min(outfit.risk_level, 5))}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showPublicToggle && (
              <PublicToggle
                outfitId={outfit.id}
                initialIsPublic={outfit.is_public}
                showLabel={false}
              />
            )}
            {outfit.overall_score && <OutfitScoreBadge score={outfit.overall_score} />}
          </div>
        </div>

        {/* Main Content: Large Images */}
        <div className="flex-1 px-4 pb-2 min-h-0">
          <div
            onClick={() => visualizationUrl && setIsFlipped(!isFlipped)}
            className={cn(
              "h-full relative rounded-xl overflow-hidden",
              visualizationUrl && "cursor-pointer"
            )}
            style={{ perspective: "1000px" }}
          >
            {visualizationUrl ? (
              <div
                className="relative w-full h-full transition-transform duration-500 ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front: Visualization */}
                <div
                  className="absolute inset-0 rounded-xl overflow-hidden bg-muted"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Image
                    src={visualizationUrl}
                    alt="Outfit visualization"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                </div>

                {/* Back: Items grid */}
                <div
                  className="absolute inset-0 rounded-xl overflow-hidden bg-muted p-3"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="grid grid-cols-2 gap-3 h-full">
                    {outfit.items?.slice(0, 4).map((item) => (
                      <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden bg-background">
                        <Image
                          src={item.photo_url}
                          alt={item.item_name}
                          fill
                          className="object-cover"
                          sizes="50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 h-full">
                {outfit.items?.slice(0, 4).map((item) => (
                  <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.photo_url}
                      alt={item.item_name}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Description + Actions */}
        <div className="px-4 py-3 space-y-3">
          {/* AI Explanation with Read More */}
          {outfit.ai_explanation && (
            <div>
              <p
                className={cn(
                  "text-sm text-muted-foreground",
                  !showFullDescription && "line-clamp-2"
                )}
              >
                {outfit.ai_explanation}
              </p>
              {outfit.ai_explanation.length > 120 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-xs text-brand-accent mt-1 hover:underline"
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {/* Score (collapsible) */}
          {outfit.scores && (
            <OutfitScoreCard scores={outfit.scores} compact />
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            <OutfitActions
              outfitId={outfit.id}
              occasion={outfit.occasion}
              score={outfit.overall_score}
              isLiked={outfit.liked}
              isFavorited={outfit.liked}
              onLike={handleLike}
              onFavorite={handleFavorite}
              size="lg"
            />
            <div className="flex-1">
              <VisualizationButton
                outfitId={outfit.id}
                existingVisualization={visualizationUrl}
                onVisualizationComplete={(url) => setVisualizationUrl(url)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid variant (default) for desktop
  return (
    <AnimatedCard
      style={cardSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("card-enhanced overflow-hidden", className)}
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {outfit.occasion && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-brand-accent/20 to-brand-accent-secondary/20"
              >
                {outfit.occasion}
              </Badge>
            )}
            {outfit.risk_level && (
              <span className="text-xs text-muted-foreground">
                {"🔥".repeat(Math.min(outfit.risk_level, 5))}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showPublicToggle && (
              <PublicToggle
                outfitId={outfit.id}
                initialIsPublic={outfit.is_public}
                showLabel={false}
              />
            )}
            {outfit.overall_score && <OutfitScoreBadge score={outfit.overall_score} />}
          </div>
        </div>
      </div>

      <CardContent className="pt-0">
        {/* 3D Flip Card */}
        <div
          onClick={() => visualizationUrl && setIsFlipped(!isFlipped)}
          className={cn(
            "mb-4 relative",
            visualizationUrl && "cursor-pointer"
          )}
          style={{ perspective: "1000px" }}
        >
          {visualizationUrl ? (
            <div
              className="relative w-full transition-transform duration-500 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front: Visualization */}
              <div
                className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted"
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src={visualizationUrl}
                  alt="Outfit visualization"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>

              {/* Back: Items grid */}
              <div
                className="absolute inset-0 aspect-[3/4] rounded-lg overflow-hidden bg-muted p-2"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="grid grid-cols-2 gap-2 h-full">
                  {outfit.items?.slice(0, 4).map((item) => (
                    <div key={item.id} className="relative rounded-lg overflow-hidden bg-background">
                      <Image
                        src={item.photo_url}
                        alt={item.item_name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {outfit.items?.slice(0, 4).map((item) => (
                <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item.photo_url}
                    alt={item.item_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Explanation with Read More */}
        {outfit.ai_explanation && (
          <div className="mb-4">
            <p
              className={cn(
                "text-sm text-muted-foreground",
                !showFullDescription && "line-clamp-2"
              )}
            >
              {outfit.ai_explanation}
            </p>
            {outfit.ai_explanation.length > 100 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-xs text-brand-accent mt-1 hover:underline"
              >
                {showFullDescription ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* Score (collapsible) */}
        {outfit.scores && (
          <div className="mb-4">
            <OutfitScoreCard scores={outfit.scores} compact />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <OutfitActions
            outfitId={outfit.id}
            occasion={outfit.occasion}
            score={outfit.overall_score}
            isLiked={outfit.liked}
            isFavorited={outfit.liked}
            onLike={handleLike}
            onFavorite={handleFavorite}
            size="md"
          />
        </div>

        {/* Visualization + View Details */}
        <div className="space-y-2">
          <VisualizationButton
            outfitId={outfit.id}
            existingVisualization={visualizationUrl}
            onVisualizationComplete={(url) => setVisualizationUrl(url)}
          />
          <Button variant="outline" asChild className="w-full touch-target">
            <Link href={`/outfits/${outfit.id}`}>
              View Details
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
