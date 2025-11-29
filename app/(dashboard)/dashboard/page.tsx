import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt, Sparkles, TrendingUp } from "lucide-react"

async function getStats(userId: string) {
  const supabase = await createClient()
  
  const [wardrobeResult, outfitsResult] = await Promise.all([
    supabase
      .from("wardrobe_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("outfit_suggestions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ])

  return {
    wardrobeCount: wardrobeResult.count || 0,
    outfitsCount: outfitsResult.count || 0,
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
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Coming soon
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

