"use client"

import { useState, useEffect } from "react"
import type { WardrobeItem } from "@/types/wardrobe"

export function useWardrobe() {
  const [items, setItems] = useState<WardrobeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/wardrobe")
      if (!res.ok) throw new Error("Failed to fetch items")
      const data = await res.json()
      setItems(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { items, loading, error, refetch: fetchItems }
}

