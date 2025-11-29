"use client"

import { useState, useEffect } from "react"

export function useOutfits() {
  const [outfits, setOutfits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOutfits()
  }, [])

  const fetchOutfits = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/outfits/history")
      if (!res.ok) throw new Error("Failed to fetch outfits")
      const data = await res.json()
      setOutfits(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { outfits, loading, error, refetch: fetchOutfits }
}

