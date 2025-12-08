import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt, Sparkles, TrendingUp } from "lucide-react"
import { calculateStyleScore, STYLE_LEVELS } from "@/lib/analytics/style-score"

interface WardrobeStats {
  wardrobeCount: number
  outfitsCount: number
  styleScore: number
  styleLevel: { emoji: string; title: string }
  categoryBreakdown: Record<string, number>
  colorBreakdown: Record<string, number>
}

async function getStats(userId: string): Promise<WardrobeStats> {
  const supabase = await createClient()

  const [wardrobeResult, outfitsResult, itemsResult, feedbackResult] = await Promise.all([
    supabase
      .from("wardrobe_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("outfit_suggestions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("wardrobe_items")
      .select("category, primary_color")
      .eq("user_id", userId),
    supabase
      .from("outfit_feedback")
      .select("outfit_id, actually_worn, rating")
      .eq("user_id", userId),
  ])

  const items = itemsResult.data || []
  const feedback = feedbackResult.data || []

  // Calculate breakdowns
  const categoryBreakdown = items.reduce((acc, item) => {
    if (item.category) acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const colorBreakdown = items.reduce((acc, item) => {
    if (item.primary_color) acc[item.primary_color] = (acc[item.primary_color] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate activity metrics
  const outfitsGenerated = outfitsResult.count || 0
  const outfitsWorn = feedback.filter(f => f.actually_worn).length
  const avgOutfitScore = feedback.length
    ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length * 20
    : undefined

  // Calculate style score
  const scoreResult = calculateStyleScore({
    totalItems: items.length,
    categoryBreakdown,
    colorBreakdown,
    outfitsGenerated,
    outfitsWorn,
    avgOutfitScore,
  })

  return {
    wardrobeCount: wardrobeResult.count || 0,
    outfitsCount: outfitsResult.count || 0,
    styleScore: scoreResult.score,
    styleLevel: { emoji: scoreResult.level.emoji, title: scoreResult.level.title },
    categoryBreakdown,
    colorBreakdown,
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const stats = await getStats(user.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your style.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wardrobe Items</CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.wardrobeCount}</div>
            <p className="text-xs text-muted-foreground">
              Items in your closet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outfit Suggestions</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outfitsCount}</div>
            <p className="text-xs text-muted-foreground">
              Outfits generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Style Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.wardrobeCount < 3 ? (
                <span className="text-muted-foreground">--</span>
              ) : (
                <span>{stats.styleScore}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.wardrobeCount < 3 ? (
                "Add 3+ items to unlock"
              ) : (
                <span>{stats.styleLevel.emoji} {stats.styleLevel.title}</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with Fitcheckz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full" variant="default">
              <Link href="/wardrobe/upload">Add Wardrobe Item</Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/outfits">Generate Outfit</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Complete your profile to get better recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile">Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

