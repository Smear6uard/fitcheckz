import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create streak data
    let { data: streakData, error } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error && error.code === "PGRST116") {
      // No streak record exists, create one
      const { data: newStreak, error: createError } = await supabase
        .from("user_streaks")
        .insert({
          user_id: user.id,
          current_streak: 0,
          longest_streak: 0,
          total_active_days: 0,
        })
        .select()
        .single()

      if (createError) {
        console.error("Failed to create streak:", createError)
        return NextResponse.json(
          { error: "Failed to create streak record" },
          { status: 500 }
        )
      }

      streakData = newStreak
    } else if (error) {
      console.error("Failed to fetch streak:", error)
      return NextResponse.json(
        { error: "Failed to fetch streak data" },
        { status: 500 }
      )
    }

    // Check if streak is still valid
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    const isActiveToday = streakData.last_activity_date === today
    const isActiveYesterday = streakData.last_activity_date === yesterday
    const streakBroken = streakData.last_activity_date &&
      !isActiveToday &&
      !isActiveYesterday

    // If streak is broken, reset it
    if (streakBroken && streakData.current_streak > 0) {
      const { error: updateError } = await supabase
        .from("user_streaks")
        .update({
          current_streak: 0,
          streak_start_date: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (!updateError) {
        streakData.current_streak = 0
        streakData.streak_start_date = null
      }
    }

    return NextResponse.json({
      currentStreak: streakData.current_streak,
      longestStreak: streakData.longest_streak,
      lastActivityDate: streakData.last_activity_date,
      streakStartDate: streakData.streak_start_date,
      totalActiveDays: streakData.total_active_days,
      isActiveToday,
      willExpireToday: isActiveYesterday && !isActiveToday,
    })
  } catch (error) {
    console.error("Streak API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
