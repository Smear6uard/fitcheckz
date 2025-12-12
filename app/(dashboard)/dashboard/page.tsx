import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt, Sparkles, TrendingUp, Plus, ArrowRight, Target } from "lucide-react"
import { calculateStyleScore, STYLE_LEVELS } from "@/lib/analytics/style-score"
import { EmptyState } from "@/components/ui/empty-state"
import { Progress } from "@/components/ui/progress"
import { StreakDisplay } from "@/components/gamification/StreakDisplay"

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
  const isNewUser = stats.wardrobeCount === 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {isNewUser 
            ? "Welcome to FitCheckz! Let's build your digital wardrobe." 
            : "Welcome back! Here's what's happening with your style."}
        </p>
      </div>

      {/* Streak Display */}
      {!isNewUser && <StreakDisplay />}

      {/* Empty State for New Users */}
      {isNewUser ? (
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/10 via-brand-lavender/5 to-brand-lime/10 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-lime/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <CardContent className="flex flex-col items-center justify-center py-16 text-center relative z-10">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-brand-lime/20 p-6 mb-6 animate-bounce">
              <Shirt className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary via-brand-lime to-primary bg-clip-text text-transparent">
              Welcome to FitCheckz! 🎉
            </h3>
            <p className="text-base text-foreground/80 mb-8 max-w-lg leading-relaxed">
              <span className="font-semibold text-primary">Let's build your digital wardrobe!</span>
              <br />
              Add your first clothing item to unlock AI-powered outfit recommendations. 
              The more items you add, the better we can help you create amazing outfits!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="gap-2 bg-gradient-to-r from-brand-teal to-brand-lime text-brand-charcoal font-semibold hover:from-brand-teal/90 hover:to-brand-lime/90 shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8"
              >
                <Link href="/wardrobe/upload">
                  <Plus className="h-5 w-5" />
                  Add Your First Item
                </Link>
              </Button>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <span className="text-primary">●</span>
                <span className="text-muted-foreground">○</span>
                <span className="text-muted-foreground">○</span>
              </div>
              <span>Step 1 of 3: Add items to your wardrobe</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress Indicator for Style Score */}
          {stats.wardrobeCount < 3 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Unlock Your Style Score
                </CardTitle>
                <CardDescription>
                  Add {3 - stats.wardrobeCount} more {stats.wardrobeCount === 2 ? 'item' : 'items'} to unlock your personalized style score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{stats.wardrobeCount} / 3 items</span>
                  </div>
                  <Progress value={(stats.wardrobeCount / 3) * 100} className="h-2" />
                </div>
                <Button asChild className="mt-4 w-full" variant="default">
                  <Link href="/wardrobe/upload">
                    <Plus className="mr-2 h-4 w-4" />
                    Add More Items
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

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
                <Button asChild className="w-full" variant="outline" disabled={stats.wardrobeCount < 3}>
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
        </>
      )}
    </div>
  )
}

