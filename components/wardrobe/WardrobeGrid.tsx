"use client"

import { useRouter } from "next/navigation"
import { ItemCard } from "./ItemCard"
import { EmptyState } from "@/components/ui/empty-state"
import { Shirt } from "lucide-react"
import type { WardrobeItem } from "@/types/wardrobe"

interface WardrobeGridProps {
  items: WardrobeItem[]
}

export function WardrobeGrid({ items }: WardrobeGridProps) {
  const router = useRouter()

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Shirt}
        title="Your wardrobe is empty"
        description="Start building your digital closet by adding your first clothing item. Take a photo or upload from your gallery."
        action={{
          label: "Add Your First Item",
          onClick: () => router.push("/wardrobe/upload"),
        }}
      />
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

