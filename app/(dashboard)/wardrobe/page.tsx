"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WardrobeGrid } from "@/components/wardrobe/WardrobeGrid"
import { WardrobeFilters, type FilterState } from "@/components/wardrobe/WardrobeFilters"
import type { WardrobeItem } from "@/types/wardrobe"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WardrobeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/wardrobe")
      if (!res.ok) throw new Error("Failed to fetch items")
      const data = await res.json()
      setItems(data)
      setFilteredItems(data)
    } catch (error: any) {
      toast.error(error.message || "Failed to load wardrobe")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...items]

    if (filters.search) {
      filtered = filtered.filter((item) =>
        item.item_name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category)
    }

    if (filters.brand) {
      filtered = filtered.filter(
        (item) =>
          item.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      )
    }

    if (filters.occasion) {
      filtered = filtered.filter(
        (item) =>
          item.occasions?.some((occ) =>
            occ.toLowerCase().includes(filters.occasion.toLowerCase())
          )
      )
    }

    setFilteredItems(filtered)
  }

  if (loading) {
    return <div className="text-center py-8">Loading wardrobe...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wardrobe</h1>
          <p className="text-muted-foreground">
            Manage your digital closet ({items.length} items)
          </p>
        </div>
        <Button asChild>
          <Link href="/wardrobe/upload">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Link>
        </Button>
      </div>

      <WardrobeFilters onFilterChange={handleFilterChange} />
      <WardrobeGrid items={filteredItems} />
    </div>
  )
}

