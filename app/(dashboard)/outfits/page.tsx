"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OutfitGenerator } from "@/components/outfits/OutfitGenerator"
import { OutfitCard } from "@/components/outfits/OutfitCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OutfitsPage() {
  const [generatedOutfits, setGeneratedOutfits] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])

  const handleGenerate = (outfits: any[]) => {
    setGeneratedOutfits(outfits)
    // Refresh history
    fetchHistory()
  }

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/outfits/history")
      if (res.ok) {
        const data = await res.json()
        setHistory(data)
      }
    } catch (error) {
      console.error("Failed to fetch history:", error)
    }
  }

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/outfits/favorites")
      if (res.ok) {
        const data = await res.json()
        setFavorites(data)
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
    }
  }

  const handleLike = async (id: string, liked: boolean) => {
    try {
      // Update in database
      const res = await fetch(`/api/outfits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked }),
      })

      if (res.ok) {
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
      }
    } catch (error) {
      console.error("Failed to update like:", error)
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
          <div className="grid gap-4 md:grid-cols-2">
            {history.length === 0 ? (
              <p className="text-muted-foreground">No outfit history yet</p>
            ) : (
              history.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  onLike={handleLike}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {favorites.length === 0 ? (
              <p className="text-muted-foreground">No favorite outfits yet</p>
            ) : (
              favorites.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  onLike={handleLike}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

