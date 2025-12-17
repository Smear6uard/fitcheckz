"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OutfitGenerator } from "@/components/outfits/OutfitGenerator"
import { OutfitCard } from "@/components/outfits/OutfitCard"
import { OutfitCardSkeleton } from "@/components/outfits/OutfitCardSkeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { History, Heart, Shirt, Plus, ArrowRight } from "lucide-react"
import { fetchWithRetry, handleApiError, parseApiError } from "@/lib/utils/api-error-handler"
import Link from "next/link"

export default function OutfitsPage() {
  const router = useRouter()
  const [generatedOutfits, setGeneratedOutfits] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  const [wardrobeItemCount, setWardrobeItemCount] = useState<number | null>(null)
  const [checkingWardrobe, setCheckingWardrobe] = useState(true)

  useEffect(() => {
    const checkWardrobe = async () => {
      try {
        const res = await fetch("/api/wardrobe/stats")
        if (res.ok) {
          const data = await res.json()
          setWardrobeItemCount(data.totalItems || 0)
        }
      } catch (error) {
        console.error("Failed to check wardrobe:", error)
      } finally {
        setCheckingWardrobe(false)
      }
    }
    checkWardrobe()
  }, [])

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
      setHistory(data.outfits || [])
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
          {checkingWardrobe ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              </CardContent>
            </Card>
          ) : wardrobeItemCount !== null && wardrobeItemCount < 2 ? (
            <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Shirt className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Build Your Wardrobe First</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  You need at least 2 items in your wardrobe to generate AI-powered outfit recommendations. 
                  Add your clothing items to unlock the magic of personalized styling!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/wardrobe/upload">
                      <Plus className="h-4 w-4" />
                      Add Items to Wardrobe
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link href="/wardrobe">
                      View Your Wardrobe
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
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
          )}

          {generatedOutfits.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Generated Outfits</h2>
              <div className="grid gap-4 md:grid-cols-2 place-items-center">
                {generatedOutfits.map((outfit) => (
                  <div key={outfit.id} className="w-full max-w-md mx-auto">
                    <OutfitCard
                      outfit={outfit}
                      onLike={handleLike}
                    />
                  </div>
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
            <div className="grid gap-4 md:grid-cols-2 place-items-center">
              {history.map((outfit) => (
                <div key={outfit.id} className="w-full max-w-md mx-auto">
                  <OutfitCard
                    outfit={outfit}
                    onLike={handleLike}
                    showPublicToggle
                  />
                </div>
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
            <div className="grid gap-4 md:grid-cols-2 place-items-center">
              {favorites.map((outfit) => (
                <div key={outfit.id} className="w-full max-w-md mx-auto">
                  <OutfitCard
                    outfit={outfit}
                    onLike={handleLike}
                    showPublicToggle
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

