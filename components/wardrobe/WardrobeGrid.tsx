"use client"

import { ItemCard } from "./ItemCard"
import type { WardrobeItem } from "@/types/wardrobe"

interface WardrobeGridProps {
  items: WardrobeItem[]
}

export function WardrobeGrid({ items }: WardrobeGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No items in your wardrobe yet</p>
        <a
          href="/wardrobe/upload"
          className="text-primary hover:underline"
        >
          Add your first item
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

