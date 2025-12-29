import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

interface WardrobeItem {
  id: string
  item_name: string
  photo_url: string
  category: string
}

interface StreakData {
  currentStreak: number
  longestStreak: number
}

async function getWardrobeItems(userId: string): Promise<WardrobeItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("wardrobe_items")
    .select("id, item_name, photo_url, category")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Failed to fetch wardrobe items:", error)
    return []
  }

  return data || []
}

async function getStreak(userId: string): Promise<StreakData | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_streaks")
    .select("current_streak, longest_streak")
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    return null
  }

  return {
    currentStreak: data.current_streak || 0,
    longestStreak: data.longest_streak || 0,
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

  // Fetch user profile for name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username")
    .eq("id", user.id)
    .single()

  // Fetch wardrobe items and streak in parallel
  const [wardrobeItems, streak] = await Promise.all([
    getWardrobeItems(user.id),
    getStreak(user.id),
  ])

  const userName = profile?.full_name || profile?.username || user.user_metadata?.full_name || "there"

  return (
    <DashboardContent
      userName={userName}
      wardrobeCount={wardrobeItems.length}
      wardrobeItems={wardrobeItems}
      initialStreak={streak}
    />
  )
}
