"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { animated } from "@react-spring/web"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink, ThumbsDown } from "lucide-react"
import type { WardrobeItem } from "@/types/wardrobe"
import type { OutfitScores } from "@/lib/ai/outfit-scorer"
import { VisualizationButton } from "./VisualizationButton"
import { OutfitScoreCard } from "./OutfitScoreCard"
import { ShareButton } from "@/components/social/ShareButton"
import { useSwipeGesture } from "@/lib/hooks/useSwipeGesture"
import { toast } from "sonner"

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
  }
  onLike?: (id: string, liked: boolean) => void
}

export function OutfitCard({ outfit, onLike }: OutfitCardProps) {
  const [visualizationUrl, setVisualizationUrl] = useState(outfit.visualization_url)

  const handleLike = async () => {
    if (onLike) {
      onLike(outfit.id, !outfit.liked)
    }
  }

  const handleSwipeRight = () => {
    if (!outfit.liked) {
      handleLike()
      toast.success("Added to favorites!")
    }
  }

  const handleSwipeLeft = () => {
    if (outfit.liked) {
      handleLike()
      toast("Removed from favorites")
    } else {
      toast("Not interested in this outfit")
    }
  }

  const { bind, style } = useSwipeGesture({
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
    threshold: 100,
  })

  const AnimatedCard = animated(Card)

  return (
    <AnimatedCard {...bind()} style={style}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Outfit Suggestion</CardTitle>
            <CardDescription>
              {outfit.occasion && (
                <Badge variant="secondary" className="mr-2">
                  {outfit.occasion}
                </Badge>
              )}
              {outfit.risk_level && (
                <span className="text-xs text-muted-foreground">
                  Boldness: {outfit.risk_level}/5
                </span>
              )}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={`touch-target ${outfit.liked ? "text-red-500" : ""}`}
          >
            <Heart
              className={`h-4 w-4 ${outfit.liked ? "fill-current" : ""}`}
            />
          </Button>
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

        {/* Swipe gesture hint */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground md:hidden">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>Swipe right</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown className="h-3 w-3" />
            <span>Swipe left</span>
          </div>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}

