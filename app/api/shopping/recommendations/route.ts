import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  analyzeWardrobe,
  generateRecommendations,
  getQuickRecommendations,
} from "@/lib/shopping/recommendations"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const useAI = searchParams.get("ai") === "true"

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's wardrobe items
    const { data: items, error: itemsError } = await supabase
      .from("wardrobe_items")
      .select(
        "id, item_name, category, primary_color, secondary_colors, seasons, occasions"
      )
      .eq("user_id", user.id)

    if (itemsError) {
      console.error("Error fetching wardrobe:", itemsError)
      return NextResponse.json(
        { error: "Failed to fetch wardrobe" },
        { status: 500 }
      )
    }

    // Analyze the wardrobe
    const analysis = analyzeWardrobe(items || [])

    // Fetch user preferences
    const { data: profile } = await supabase
      .from("profiles")
      .select("aesthetic_preference, budget_range, body_type")
      .eq("user_id", user.id)
      .single()

    let recommendations

    if (useAI && items && items.length > 0) {
      // Use AI for more personalized recommendations
      recommendations = await generateRecommendations(analysis, {
        aesthetic: profile?.aesthetic_preference,
        budgetRange: profile?.budget_range,
        bodyType: profile?.body_type,
      })
    } else {
      // Use quick rule-based recommendations
      recommendations = getQuickRecommendations(
        analysis,
        profile?.budget_range || "mid"
      )
    }

    return NextResponse.json({
      analysis,
      recommendations,
      wardrobeSize: items?.length || 0,
    })
  } catch (error) {
    console.error("Recommendations API error:", error)
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    )
  }
}
