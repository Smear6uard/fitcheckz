"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WardrobeItem } from "@/types/wardrobe"

interface ItemCardProps {
  item: WardrobeItem
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/wardrobe/${item.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square relative bg-muted overflow-hidden">
          <Image
            src={item.photo_url}
            alt={item.item_name}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23808080' filter='url(%23b)'/%3E%3C/svg%3E"
            loading="lazy"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold truncate">{item.item_name}</h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary">{item.category}</Badge>
            {item.brand && (
              <Badge variant="outline" className="text-xs">
                {item.brand}
              </Badge>
            )}
            {item.primary_color && (
              <div
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: item.primary_color }}
                title={item.primary_color}
                aria-label={`Color: ${item.primary_color}`}
                role="img"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

