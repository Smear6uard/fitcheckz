"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { WardrobeCategory } from "@/types/wardrobe"

interface WardrobeFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  category: string
  occasion: string
  brand: string
}

export function WardrobeFilters({ onFilterChange }: WardrobeFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    occasion: "",
    brand: "",
  })

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search items..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={filters.category || "all"}
          onValueChange={(value) => updateFilter("category", value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
            <SelectItem value="dress">Dress</SelectItem>
            <SelectItem value="jacket">Jacket</SelectItem>
            <SelectItem value="shoes">Shoes</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="outerwear">Outerwear</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="occasion">Occasion</Label>
        <Input
          id="occasion"
          placeholder="Filter by occasion..."
          value={filters.occasion}
          onChange={(e) => updateFilter("occasion", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          placeholder="Filter by brand..."
          value={filters.brand}
          onChange={(e) => updateFilter("brand", e.target.value)}
        />
      </div>
    </div>
  )
}

