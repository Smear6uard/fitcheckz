import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ACHIEVEMENTS, checkAchievementProgress } from "@/lib/gamification/achievements"
import { calculateStyleScore } from "@/lib/analytics/style-score"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's unlocked achievements
    const { data: unlockedAchievements, error: achievementsError } = await supabase
      .from("user_achievements")
      .select("achievement_id, unlocked_at, progress")
      .eq("user_id", user.id)

    if (achievementsError) {
      console.error("Failed to fetch achievements:", achievementsError)
    }

    // Fetch current stats for progress calculation
    const [
      { count: wardrobeCount },
      { count: outfitsGenerated },
      { count: outfitsWorn },
      { count: outfitsShared },
      { data: streakData },
      { data: wardrobeItems },
      { data: feedbackData },
    ] = await Promise.all([
      supabase
        .from("wardrobe_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("outfit_suggestions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("outfit_suggestions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("worn", true),
      supabase
        .from("outfit_suggestions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_public", true),
      supabase
        .from("user_streaks")
        .select("current_streak, longest_streak")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("wardrobe_items")
        .select("category, primary_color")
        .eq("user_id", user.id),
      supabase
        .from("outfit_feedback")
        .select("actually_worn, rating")
        .eq("user_id", user.id),
    ])

    // Calculate style score
    const items = wardrobeItems || []
    const feedback = feedbackData || []

    const categoryBreakdown = items.reduce((acc, item) => {
      if (item.category) acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const colorBreakdown = items.reduce((acc, item) => {
      if (item.primary_color) acc[item.primary_color] = (acc[item.primary_color] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const avgOutfitScore = feedback.length
      ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length * 20
      : undefined

    const styleScoreResult = calculateStyleScore({
      totalItems: items.length,
      categoryBreakdown,
      colorBreakdown,
      outfitsGenerated: outfitsGenerated || 0,
      outfitsWorn: feedback.filter(f => f.actually_worn).length,
      avgOutfitScore,
    })

    // Build stats object
    const stats: Record<string, number> = {
      wardrobe_items: wardrobeCount || 0,
      outfits_generated: outfitsGenerated || 0,
      outfits_worn: outfitsWorn || 0,
      current_streak: streakData?.current_streak || 0,
      longest_streak: streakData?.longest_streak || 0,
      outfits_shared: outfitsShared || 0,
      style_score: styleScoreResult.score,
    }

    // Map unlocked achievements for quick lookup
    const unlockedMap = new Map(
      (unlockedAchievements || []).map((a) => [
        a.achievement_id,
        { unlockedAt: a.unlocked_at, progress: a.progress },
      ])
    )

    // Build achievements with progress
    const achievements = ACHIEVEMENTS.map((achievement) => {
      const unlocked = unlockedMap.get(achievement.id)
      const progressData = checkAchievementProgress(achievement, stats)

      return {
        ...achievement,
        unlocked: !!unlocked || progressData.unlocked,
        unlockedAt: unlocked?.unlockedAt || null,
        progress: progressData.progress,
        target: progressData.target,
        progressPercent: Math.min(
          (progressData.progress / progressData.target) * 100,
          100
        ),
      }
    })

    // Count totals
    const unlockedCount = achievements.filter((a) => a.unlocked).length
    const totalCount = achievements.length

    // Check for newly unlocked achievements
    const newlyUnlocked = achievements.filter(
      (a) => a.unlocked && !unlockedMap.has(a.id)
    )

    // Save newly unlocked achievements
    if (newlyUnlocked.length > 0) {
      const inserts = newlyUnlocked.map((a) => ({
        user_id: user.id,
        achievement_id: a.id,
        progress: a.progress,
      }))

      await supabase.from("user_achievements").upsert(inserts, {
        onConflict: "user_id,achievement_id",
      })
    }

    return NextResponse.json({
      achievements,
      stats: {
        unlockedCount,
        totalCount,
        percentComplete: Math.round((unlockedCount / totalCount) * 100),
      },
      newlyUnlocked: newlyUnlocked.map((a) => a.id),
    })
  } catch (error) {
    console.error("Achievements API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
