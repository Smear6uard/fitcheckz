"use client"

import { ShoppingBag, Sparkles, Target } from "lucide-react"
import { ShoppingRecommendations } from "@/components/shopping/ShoppingRecommendations"
import { WeatherBadge } from "@/components/weather/WeatherBadge"

export default function ShopPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            Style Shop
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered recommendations to complete your wardrobe
          </p>
        </div>
        <WeatherBadge variant="compact" />
      </div>

      {/* Features banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Gap Analysis</p>
              <p className="text-sm text-muted-foreground">
                Find what's missing
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-secondary to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">AI Suggestions</p>
              <p className="text-sm text-muted-foreground">
                Personalized picks
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Shop Direct</p>
              <p className="text-sm text-muted-foreground">
                Find similar items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <ShoppingRecommendations />
    </div>
  )
}
