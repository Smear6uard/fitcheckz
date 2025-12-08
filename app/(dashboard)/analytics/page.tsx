"use client"

import { useEffect, useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Shirt, DollarSign, Sparkles, TrendingUp } from "lucide-react"

// Analytics components
import { ColorDistributionChart } from "@/components/analytics/ColorDistributionChart"
import { CategoryBreakdown } from "@/components/analytics/CategoryBreakdown"
import { MostWornItems } from "@/components/analytics/MostWornItems"
import { WardrobeGaps } from "@/components/analytics/WardrobeGaps"
import { StyleScore } from "@/components/analytics/StyleScore"

interface WornItem {
  id: string
  name: string
  category: string
  image_url: string | null
  worn_count: number
}

interface Stats {
  totalItems: number
  totalCost: number
  categoryBreakdown: Record<string, number>
  colorBreakdown: Record<string, number>
  mostWornItems: WornItem[]
  outfitsGenerated: number
  outfitsWorn: number
  avgOutfitScore?: number
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  delay = 0,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: React.ElementType
  delay?: number
}) {
  const spring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    delay,
    config: config.gentle,
  })

  return (
    <animated.div style={spring}>
      <Card className="card-enhanced">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-brand-lime/20 flex items-center justify-center">
            <Icon className="h-4 w-4 text-brand-lime" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </animated.div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/wardrobe/stats")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      toast.error("Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  // Header animation
  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  })

  if (loading) {
    return <AnalyticsSkeleton />
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Sparkles className="h-16 w-16 text-brand-lime mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Data Yet</h2>
        <p className="text-muted-foreground max-w-md">
          Start adding items to your wardrobe to see personalized insights and analytics!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <animated.div style={headerSpring}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span className="text-4xl">📊</span>
          Wardrobe Insights
        </h1>
        <p className="text-muted-foreground mt-1">
          Deep dive into your style – data meets drip
        </p>
      </animated.div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Items"
          value={stats.totalItems}
          subtitle="pieces in your closet"
          icon={Shirt}
          delay={100}
        />
        <StatCard
          title="Wardrobe Value"
          value={`$${stats.totalCost.toLocaleString()}`}
          subtitle="total investment"
          icon={DollarSign}
          delay={150}
        />
        <StatCard
          title="Outfits Generated"
          value={stats.outfitsGenerated}
          subtitle="AI-curated looks"
          icon={Sparkles}
          delay={200}
        />
        <StatCard
          title="Outfits Worn"
          value={stats.outfitsWorn}
          subtitle="looks you've rocked"
          icon={TrendingUp}
          delay={250}
        />
      </div>

      {/* Style Score & Category Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StyleScore
          stats={{
            totalItems: stats.totalItems,
            categoryBreakdown: stats.categoryBreakdown,
            colorBreakdown: stats.colorBreakdown,
          }}
          outfitsGenerated={stats.outfitsGenerated}
          outfitsWorn={stats.outfitsWorn}
          avgOutfitScore={stats.avgOutfitScore}
        />
        <CategoryBreakdown categoryBreakdown={stats.categoryBreakdown} />
      </div>

      {/* Color Distribution & Gaps */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ColorDistributionChart colorBreakdown={stats.colorBreakdown} />
        <WardrobeGaps
          stats={{
            totalItems: stats.totalItems,
            categoryBreakdown: stats.categoryBreakdown,
            colorBreakdown: stats.colorBreakdown,
          }}
        />
      </div>

      {/* Most Worn Items */}
      <MostWornItems items={stats.mostWornItems} />
    </div>
  )
}
