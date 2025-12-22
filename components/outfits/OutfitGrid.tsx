"use client"

import { OutfitCard } from "./OutfitCard"
import type { WardrobeItem } from "@/types/wardrobe"
import type { OutfitScores } from "@/lib/ai/outfit-scorer"
import { cn } from "@/lib/utils"

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

interface OutfitGridProps {
  outfits: Outfit[]
  onLike?: (id: string, liked: boolean) => void
  onFavorite?: (id: string, favorited: boolean) => void
  showPublicToggle?: boolean
  className?: string
}

export function OutfitGrid({
  outfits,
  onLike,
  onFavorite,
  showPublicToggle = false,
  className,
}: OutfitGridProps) {
  if (outfits.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "grid gap-6 justify-items-center",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        className
      )}
    >
      {outfits.map((outfit) => (
        <div key={outfit.id} className="w-full max-w-md">
          <OutfitCard
            outfit={outfit}
            variant="grid"
            onLike={onLike}
            onFavorite={onFavorite}
            showPublicToggle={showPublicToggle}
          />
        </div>
      ))}
    </div>
  )
}
