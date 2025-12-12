import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const onboardingSchema = z.object({
  style_vibes: z.array(z.string()).optional().default([]),
  typical_occasions: z.array(z.string()).optional().default([]),
  favorite_colors: z.array(z.string()).optional().default([]),
  fashion_goals: z.array(z.string()).optional().default([]),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const preferences = onboardingSchema.parse(body)

    const { error } = await supabase
      .from("profiles")
      .update({
        style_vibes: preferences.style_vibes,
        typical_occasions: preferences.typical_occasions,
        favorite_colors: preferences.favorite_colors,
        fashion_goals: preferences.fashion_goals,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    if (error) {
      console.error("Failed to save onboarding preferences:", error)
      return NextResponse.json(
        { error: "Failed to save preferences" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // First try to get onboarding columns, but gracefully handle if they don't exist
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "style_vibes, typical_occasions, favorite_colors, fashion_goals, onboarding_completed"
      )
      .eq("user_id", user.id)
      .single()

    // If columns don't exist (42703 error), treat as completed to skip onboarding
    if (error) {
      if (error.code === "42703") {
        // Column doesn't exist - onboarding columns not migrated yet
        // Return completed: true to skip onboarding until migration is run
        console.warn("Onboarding columns not found in profiles table. Skipping onboarding check.")
        return NextResponse.json({
          completed: true,
          preferences: {
            style_vibes: [],
            typical_occasions: [],
            favorite_colors: [],
            fashion_goals: [],
          },
        })
      }
      console.error("Failed to fetch onboarding status:", error)
      return NextResponse.json(
        { error: "Failed to fetch status" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      completed: data?.onboarding_completed || false,
      preferences: {
        style_vibes: data?.style_vibes || [],
        typical_occasions: data?.typical_occasions || [],
        favorite_colors: data?.favorite_colors || [],
        fashion_goals: data?.fashion_goals || [],
      },
    })
  } catch (error) {
    console.error("Onboarding fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
