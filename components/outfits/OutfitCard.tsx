"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink } from "lucide-react"
import type { WardrobeItem } from "@/types/wardrobe"

interface OutfitCardProps {
  outfit: {
    id: string
    wardrobe_item_ids: string[]
    items: WardrobeItem[]
    ai_explanation?: string
    risk_level?: number
    occasion?: string
    liked?: boolean
  }
  onLike?: (id: string, liked: boolean) => void
}

export function OutfitCard({ outfit, onLike }: OutfitCardProps) {
  const handleLike = async () => {
    if (onLike) {
      onLike(outfit.id, !outfit.liked)
    }
  }

  return (
    <Card>
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
            className={outfit.liked ? "text-red-500" : ""}
          >
            <Heart
              className={`h-4 w-4 ${outfit.liked ? "fill-current" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {outfit.items?.slice(0, 4).map((item) => (
            <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden bg-muted">
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
        {outfit.ai_explanation && (
          <p className="text-sm text-muted-foreground mb-4">
            {outfit.ai_explanation}
          </p>
        )}
        <Button variant="outline" asChild className="w-full">
          <Link href={`/outfits/${outfit.id}`}>
            View Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

