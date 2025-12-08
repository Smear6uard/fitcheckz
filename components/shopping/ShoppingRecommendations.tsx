"use client"

import { useState, useEffect } from "react"
import { animated, useTransition, config } from "@react-spring/web"
import {
  Loader2,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Shirt,
  Palette,
  Sun,
  Moon,
  Briefcase,
  PartyPopper,
} from "lucide-react"
import { RecommendationCard } from "./RecommendationCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EmptyState } from "@/components/ui/empty-state"
import { toast } from "@/lib/utils/toast-personality"
import { cn } from "@/lib/utils"

interface WardrobeAnalysis {
  totalItems: number
  categoryBreakdown: Record<string, number>
  colorDistribution: Record<string, number>
  seasonalCoverage: Record<string, number>
  occasionCoverage: Record<string, number>
  missingEssentials: string[]
  styleGaps: string[]
}

interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  suggestedColors: string[]
  priceRange: "budget" | "mid" | "luxury"
  priority: "high" | "medium" | "low"
  reason: string
  searchQuery: string
  imagePrompt: string
}

export function ShoppingRecommendations() {
  const [analysis, setAnalysis] = useState<WardrobeAnalysis | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [useAI, setUseAI] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])

  // Animation for cards
  const transitions = useTransition(recommendations, {
    keys: (rec) => rec.id,
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    config: config.gentle,
    trail: 100,
  })

  const fetchRecommendations = async (withAI = false) => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/shopping/recommendations?ai=${withAI}`
      )

      if (res.ok) {
        const data = await res.json()
        setAnalysis(data.analysis)
        setRecommendations(data.recommendations || [])
      } else {
        throw new Error("Failed to fetch recommendations")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to load recommendations")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchRecommendations(useAI)
    setIsRefreshing(false)
    toast.success("Recommendations refreshed!")
  }

  const handleToggleAI = async () => {
    const newUseAI = !useAI
    setUseAI(newUseAI)
    setIsRefreshing(true)
    await fetchRecommendations(newUseAI)
    setIsRefreshing(false)
    if (newUseAI) {
      toast.success("AI-powered recommendations activated!")
    }
  }

  const handleAddToWishlist = (id: string) => {
    setWishlist((prev) => [...prev, id])
    toast.success("Added to your style goals!")
  }

  useEffect(() => {
    fetchRecommendations(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal mb-4" />
        <p className="text-muted-foreground">Analyzing your wardrobe...</p>
      </div>
    )
  }

  if (!analysis || analysis.totalItems === 0) {
    return (
      <EmptyState
        icon={Shirt}
        title="Add items to get recommendations"
        description="Upload some items to your wardrobe first, and we'll suggest pieces to complete your style."
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Wardrobe Analysis Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shirt className="h-4 w-4" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analysis.totalItems}</p>
          </CardContent>
        </Card>

        {/* Color Variety */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Color Variety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {Object.keys(analysis.colorDistribution).length}
            </p>
            <p className="text-xs text-muted-foreground">unique colors</p>
          </CardContent>
        </Card>

        {/* Season Coverage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Seasonal Mix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {Object.entries(analysis.seasonalCoverage).map(
                ([season, count]) => (
                  <div key={season} className="text-center">
                    <span className="text-lg">
                      {
                        {
                          spring: "🌸",
                          summer: "☀️",
                          fall: "🍂",
                          winter: "❄️",
                        }[season]
                      }
                    </span>
                    <p className="text-xs font-medium">{count}</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gaps Identified */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Gaps Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-teal">
              {analysis.missingEssentials.length + analysis.styleGaps.length}
            </p>
            <p className="text-xs text-muted-foreground">areas to improve</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wardrobe Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analysis.categoryBreakdown).map(
              ([category, count]) => {
                const total = analysis.totalItems
                const percentage = Math.round((count / total) * 100)
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{category}</span>
                      <span className="text-muted-foreground">
                        {count} items ({percentage}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Identified Gaps */}
      {(analysis.missingEssentials.length > 0 ||
        analysis.styleGaps.length > 0) && (
        <Card className="border-brand-teal/50 bg-brand-teal/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-brand-teal" />
              Wardrobe Gaps Identified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {[...analysis.missingEssentials, ...analysis.styleGaps].map(
                (gap, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                    {gap}
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-lime" />
            Recommended For You
          </h2>
          <p className="text-muted-foreground">
            {useAI
              ? "AI-powered personalized suggestions"
              : "Based on your wardrobe analysis"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={useAI ? "default" : "outline"}
            onClick={handleToggleAI}
            disabled={isRefreshing}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {useAI ? "AI Active" : "Use AI"}
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </Button>
        </div>
      </div>

      {/* Recommendation Cards */}
      {recommendations.length === 0 ? (
        <EmptyState
          icon={PartyPopper}
          title="Your wardrobe is looking great!"
          description="No urgent recommendations right now. Keep building your collection!"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transitions((style, recommendation) => (
            <animated.div style={style}>
              <RecommendationCard
                recommendation={recommendation}
                onAddToWishlist={handleAddToWishlist}
                isInWishlist={wishlist.includes(recommendation.id)}
              />
            </animated.div>
          ))}
        </div>
      )}

      {/* Wishlist Summary */}
      {wishlist.length > 0 && (
        <Card className="bg-gradient-to-r from-brand-lime/10 to-brand-teal/10">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">
                {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} in your
                style goals
              </p>
              <p className="text-sm text-muted-foreground">
                Track your progress as you build your dream wardrobe
              </p>
            </div>
            <Button variant="outline">View All Goals</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
