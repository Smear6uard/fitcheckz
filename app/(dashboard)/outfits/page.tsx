"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OutfitGenerator } from "@/components/outfits/OutfitGenerator"
import { OutfitCard } from "@/components/outfits/OutfitCard"
import { OutfitCardSkeleton } from "@/components/outfits/OutfitCardSkeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import { History, Heart } from "lucide-react"
import { fetchWithRetry, handleApiError, parseApiError } from "@/lib/utils/api-error-handler"

export default function OutfitsPage() {
  const [generatedOutfits, setGeneratedOutfits] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [loadingFavorites, setLoadingFavorites] = useState(false)

  const handleGenerate = (outfits: any[]) => {
    setGeneratedOutfits(outfits)
    // Refresh history
    fetchHistory()
  }

  const fetchHistory = async () => {
    setLoadingHistory(true)
    try {
      const res = await fetchWithRetry("/api/outfits/history")
      if (!res.ok) {
        throw await parseApiError(res)
      }
      const data = await res.json()
      setHistory(data)
    } catch (error) {
      handleApiError(error, "Fetch History")
    } finally {
      setLoadingHistory(false)
    }
  }

  const fetchFavorites = async () => {
    setLoadingFavorites(true)
    try {
      const res = await fetchWithRetry("/api/outfits/favorites")
      if (!res.ok) {
        throw await parseApiError(res)
      }
      const data = await res.json()
      setFavorites(data)
    } catch (error) {
      handleApiError(error, "Fetch Favorites")
    } finally {
      setLoadingFavorites(false)
    }
  }

  const handleLike = async (id: string, liked: boolean) => {
    try {
      const res = await fetchWithRetry(`/api/outfits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked }),
      })

      if (!res.ok) {
        throw await parseApiError(res)
      }

      // Update local state
      setGeneratedOutfits((prev) =>
        prev.map((o) => (o.id === id ? { ...o, liked } : o))
      )
      setHistory((prev) =>
        prev.map((o) => (o.id === id ? { ...o, liked } : o))
      )
      if (liked) {
        fetchFavorites()
      } else {
        setFavorites((prev) => prev.filter((o) => o.id !== id))
      }
    } catch (error) {
      handleApiError(error, "Update Like")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Outfit Generator</h1>
        <p className="text-muted-foreground">
          Get AI-powered outfit recommendations from your wardrobe
        </p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="history" onClick={fetchHistory}>
            History
          </TabsTrigger>
          <TabsTrigger value="favorites" onClick={fetchFavorites}>
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Outfits</CardTitle>
              <CardDescription>
                Select your preferences and let AI create outfit combinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OutfitGenerator onGenerate={handleGenerate} />
            </CardContent>
          </Card>

          {generatedOutfits.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Generated Outfits</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {generatedOutfits.map((outfit) => (
                  <OutfitCard
                    key={outfit.id}
                    outfit={outfit}
                    onLike={handleLike}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {loadingHistory ? (
            <div className="grid gap-4 md:grid-cols-2">
              <OutfitCardSkeleton />
              <OutfitCardSkeleton />
            </div>
          ) : history.length === 0 ? (
            <EmptyState
              icon={History}
              title="No outfit history yet"
              description="Generate your first outfit to see it here. Your AI-powered style recommendations will appear in this tab."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {history.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  onLike={handleLike}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {loadingFavorites ? (
            <div className="grid gap-4 md:grid-cols-2">
              <OutfitCardSkeleton />
              <OutfitCardSkeleton />
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No favorite outfits yet"
              description="Like outfits you love by clicking the heart icon. Your favorites will be saved here for easy access."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {favorites.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  onLike={handleLike}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

