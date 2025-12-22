"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { WardrobeItem } from "@/types/wardrobe"
import type { OutfitScores } from "@/lib/ai/outfit-scorer"

// Outfit type matching OutfitCard props
export interface Outfit {
  id: string
  wardrobe_item_ids: string[]
  items: WardrobeItem[]
  ai_explanation?: string
  risk_level?: number
  occasion?: string
  liked?: boolean
  visualization_url?: string | null
  scores?: OutfitScores
  overall_score?: number
  is_public?: boolean
}

export interface OutfitFeedState {
  currentIndex: number
  viewedIds: Set<string>
  likedIds: Set<string>
  favoritedIds: Set<string>
  isEndReached: boolean
}

interface UseOutfitFeedOptions {
  outfits: Outfit[]
  onLike?: (id: string, liked: boolean) => void
  onFavorite?: (id: string, favorited: boolean) => void
}

export function useOutfitFeed({ outfits, onLike, onFavorite }: UseOutfitFeedOptions) {
  const [state, setState] = useState<OutfitFeedState>({
    currentIndex: 0,
    viewedIds: new Set<string>(),
    likedIds: new Set<string>(),
    favoritedIds: new Set<string>(),
    isEndReached: false,
  })

  // Track previous outfits length to detect new batches
  const prevOutfitsLengthRef = useRef(outfits.length)

  // Reset state when new outfits are loaded
  useEffect(() => {
    if (outfits.length > 0 && outfits.length !== prevOutfitsLengthRef.current) {
      // New batch of outfits - reset to beginning
      setState({
        currentIndex: 0,
        viewedIds: new Set<string>(),
        likedIds: new Set<string>(),
        favoritedIds: new Set<string>(),
        isEndReached: false,
      })
    }
    prevOutfitsLengthRef.current = outfits.length
  }, [outfits.length])

  // Initialize liked/favorited from outfit data
  useEffect(() => {
    const likedIds = new Set<string>()
    const favoritedIds = new Set<string>()

    outfits.forEach((outfit) => {
      if (outfit.liked) {
        likedIds.add(outfit.id)
        favoritedIds.add(outfit.id) // liked = favorited in current system
      }
    })

    setState((prev) => ({
      ...prev,
      likedIds,
      favoritedIds,
    }))
  }, [outfits])

  const goToIndex = useCallback((index: number) => {
    if (index < 0 || index >= outfits.length) return

    setState((prev) => ({
      ...prev,
      currentIndex: index,
      isEndReached: index >= outfits.length - 1,
    }))
  }, [outfits.length])

  const goToNext = useCallback(() => {
    setState((prev) => {
      const nextIndex = Math.min(prev.currentIndex + 1, outfits.length - 1)
      return {
        ...prev,
        currentIndex: nextIndex,
        isEndReached: nextIndex >= outfits.length - 1,
      }
    })
  }, [outfits.length])

  const goToPrevious = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
      isEndReached: false,
    }))
  }, [])

  const markViewed = useCallback((id: string) => {
    setState((prev) => {
      const newViewedIds = new Set(prev.viewedIds)
      newViewedIds.add(id)
      return {
        ...prev,
        viewedIds: newViewedIds,
      }
    })
  }, [])

  const toggleLike = useCallback(
    (id: string) => {
      setState((prev) => {
        const newLikedIds = new Set(prev.likedIds)
        const isLiked = newLikedIds.has(id)

        if (isLiked) {
          newLikedIds.delete(id)
        } else {
          newLikedIds.add(id)
        }

        // Notify parent
        onLike?.(id, !isLiked)

        return {
          ...prev,
          likedIds: newLikedIds,
        }
      })
    },
    [onLike]
  )

  const toggleFavorite = useCallback(
    (id: string) => {
      setState((prev) => {
        const newFavoritedIds = new Set(prev.favoritedIds)
        const isFavorited = newFavoritedIds.has(id)

        if (isFavorited) {
          newFavoritedIds.delete(id)
        } else {
          newFavoritedIds.add(id)
        }

        // Notify parent
        onFavorite?.(id, !isFavorited)

        return {
          ...prev,
          favoritedIds: newFavoritedIds,
        }
      })
    },
    [onFavorite]
  )

  const reset = useCallback(() => {
    setState({
      currentIndex: 0,
      viewedIds: new Set<string>(),
      likedIds: new Set<string>(),
      favoritedIds: new Set<string>(),
      isEndReached: false,
    })
  }, [])

  const currentOutfit = outfits[state.currentIndex] || null
  const progress = {
    current: state.currentIndex + 1,
    total: outfits.length,
    percentage: outfits.length > 0 ? ((state.currentIndex + 1) / outfits.length) * 100 : 0,
  }

  return {
    state,
    currentOutfit,
    progress,
    actions: {
      goToIndex,
      goToNext,
      goToPrevious,
      markViewed,
      toggleLike,
      toggleFavorite,
      reset,
    },
    isLiked: (id: string) => state.likedIds.has(id),
    isFavorited: (id: string) => state.favoritedIds.has(id),
    isViewed: (id: string) => state.viewedIds.has(id),
  }
}
