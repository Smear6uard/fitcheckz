"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WardrobeItem } from "@/types/wardrobe"

interface OutfitViewerProps {
  outfit: {
    id: string
    wardrobe_item_ids: string[]
    items: WardrobeItem[]
    ai_explanation?: string
    risk_level?: number
    occasion?: string
    season?: string
    mood?: string
  }
}

export function OutfitViewer({ outfit }: OutfitViewerProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Outfit Details</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {outfit.occasion && (
                <Badge variant="secondary">{outfit.occasion}</Badge>
              )}
              {outfit.season && (
                <Badge variant="outline">{outfit.season}</Badge>
              )}
              {outfit.mood && (
                <Badge variant="outline">{outfit.mood}</Badge>
              )}
              {outfit.risk_level && (
                <Badge variant={outfit.risk_level >= 4 ? "default" : "secondary"}>
                  Boldness: {outfit.risk_level}/5
                </Badge>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {outfit.items?.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item.photo_url}
                    alt={item.item_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.item_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.category} {item.brand && `• ${item.brand}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {outfit.ai_explanation && (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold mb-2">Why This Works</h3>
              <p className="text-sm text-muted-foreground">
                {outfit.ai_explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

