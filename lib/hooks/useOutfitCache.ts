"use client"

import { useState, useEffect, useCallback } from "react"

const CACHE_KEY = "styleum_outfits_cache_v1"
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours

interface CachedOutfitData {
  outfits: any[]
  timestamp: number
}

export function useOutfitCache() {
  const [cachedOutfits, setCachedOutfitsState] = useState<any[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CACHE_KEY)
      if (stored) {
        const data: CachedOutfitData = JSON.parse(stored)
        const age = Date.now() - data.timestamp

        // Only use cache if it's fresh
        if (age < CACHE_MAX_AGE_MS && Array.isArray(data.outfits)) {
          setCachedOutfitsState(data.outfits)
        } else {
          // Clear stale cache
          localStorage.removeItem(CACHE_KEY)
        }
      }
    } catch (error) {
      // Ignore localStorage errors
      console.warn("Failed to read outfit cache:", error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save to localStorage
  const setCachedOutfits = useCallback((outfits: any[]) => {
    setCachedOutfitsState(outfits)
    try {
      const data: CachedOutfitData = {
        outfits,
        timestamp: Date.now(),
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    } catch (error) {
      // Ignore localStorage errors (quota exceeded, etc.)
      console.warn("Failed to save outfit cache:", error)
    }
  }, [])

  // Clear cache
  const clearCache = useCallback(() => {
    setCachedOutfitsState([])
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch (error) {
      console.warn("Failed to clear outfit cache:", error)
    }
  }, [])

  return {
    cachedOutfits,
    setCachedOutfits,
    clearCache,
    isHydrated,
  }
}
