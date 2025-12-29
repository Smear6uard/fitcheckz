"use client"

import { useState, useCallback } from "react"
import { OutfitCardSkeleton } from "@/components/outfits/OutfitCardSkeleton"
import { OutfitGrid } from "@/components/outfits/OutfitGrid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import { History, Heart } from "lucide-react"
import { fetchWithRetry, handleApiError, parseApiError } from "@/lib/utils/api-error-handler"

export default function SavedOutfitsPage() {
  const [history, setHistory] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  const [initialLoad, setInitialLoad] = useState({ history: true, favorites: true })

  const fetchHistory = async () => {
    if (!initialLoad.history) return
    setLoadingHistory(true)
    try {
      const res = await fetchWithRetry("/api/outfits/history")
      if (!res.ok) {
        throw await parseApiError(res)
      }
      const data = await res.json()
      setHistory(data.outfits || [])
      setInitialLoad((prev) => ({ ...prev, history: false }))
    } catch (error) {
      handleApiError(error, "Fetch History")
    } finally {
      setLoadingHistory(false)
    }
  }

  const fetchFavorites = async () => {
    if (!initialLoad.favorites) return
    setLoadingFavorites(true)
    try {
      const res = await fetchWithRetry("/api/outfits/favorites")
      if (!res.ok) {
        throw await parseApiError(res)
      }
      const data = await res.json()
      setFavorites(data)
      setInitialLoad((prev) => ({ ...prev, favorites: false }))
    } catch (error) {
      handleApiError(error, "Fetch Favorites")
    } finally {
      setLoadingFavorites(false)
    }
  }

  // Session-only like handler
  const handleSessionLike = useCallback((id: string, liked: boolean) => {
    setHistory((prev) =>
      prev.map((o) => (o.id === id ? { ...o, liked } : o))
    )
  }, [])

  // Favorite handler - persists to DB
  const handleFavorite = async (id: string, favorited: boolean) => {
    try {
      const res = await fetchWithRetry(`/api/outfits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: favorited }),
      })

      if (!res.ok) {
        throw await parseApiError(res)
      }

      setHistory((prev) =>
        prev.map((o) => (o.id === id ? { ...o, liked: favorited } : o))
      )
      if (favorited) {
        // Refresh favorites to include new item
        setInitialLoad((prev) => ({ ...prev, favorites: true }))
        fetchFavorites()
      } else {
        setFavorites((prev) => prev.filter((o) => o.id !== id))
      }
    } catch (error) {
      handleApiError(error, "Update Favorite")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Saved Outfits</h1>
        <p className="text-muted-foreground">
          Your outfit history and favorites
        </p>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history" onClick={fetchHistory}>
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="favorites" onClick={fetchFavorites}>
            <Heart className="h-4 w-4 mr-2" />
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {loadingHistory ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <OutfitCardSkeleton />
              <OutfitCardSkeleton />
              <OutfitCardSkeleton />
            </div>
          ) : history.length === 0 ? (
            <EmptyState
              icon={History}
              title="No outfit history yet"
              description="Use the Style Me tab to curate your first outfit. Your style recommendations will appear here."
            />
          ) : (
            <OutfitGrid
              outfits={history}
              onLike={handleSessionLike}
              onFavorite={handleFavorite}
              showPublicToggle
            />
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {loadingFavorites ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <OutfitCardSkeleton />
              <OutfitCardSkeleton />
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No favorite outfits yet"
              description="Star outfits you love by clicking the star icon. Your favorites will be saved here for easy access."
            />
          ) : (
            <OutfitGrid
              outfits={favorites}
              onLike={handleSessionLike}
              onFavorite={handleFavorite}
              showPublicToggle
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
