import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  style: z.string().optional(),
  occasion: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const query = querySchema.parse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 12,
      style: searchParams.get("style") || undefined,
      occasion: searchParams.get("occasion") || undefined,
    })

    const offset = (query.page - 1) * query.limit

    // Get current user for checking if they liked outfits
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Build query for public outfits
    let outfitQuery = supabase
      .from("outfit_suggestions")
      .select(
        `
        id,
        user_id,
        wardrobe_item_ids,
        occasion,
        season,
        mood,
        ai_explanation,
        risk_level,
        overall_score,
        visualization_url,
        likes_count,
        comments_count,
        is_public,
        created_at,
        profiles!inner(
          user_id,
          username,
          display_name,
          avatar_url,
          is_public
        )
      `
      )
      .eq("is_public", true)
      .order("likes_count", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + query.limit - 1)

    // Filter by occasion if provided
    if (query.occasion) {
      outfitQuery = outfitQuery.eq("occasion", query.occasion)
    }

    const { data: outfits, error: outfitsError } = await outfitQuery

    if (outfitsError) {
      console.error("Error fetching explore outfits:", outfitsError)
      return NextResponse.json(
        { error: "Failed to fetch outfits" },
        { status: 500 }
      )
    }

    // If user is logged in, check which outfits they've liked
    let userLikes: string[] = []
    if (user) {
      const { data: likes } = await supabase
        .from("outfit_likes")
        .select("outfit_id")
        .eq("user_id", user.id)
        .in(
          "outfit_id",
          outfits?.map((o) => o.id) || []
        )

      userLikes = likes?.map((l) => l.outfit_id) || []
    }

    // Fetch wardrobe items for each outfit
    const allItemIds = outfits?.flatMap((o) => o.wardrobe_item_ids) || []
    const uniqueItemIds = [...new Set(allItemIds)]

    const { data: items } = await supabase
      .from("wardrobe_items")
      .select("id, item_name, photo_url, category, primary_color")
      .in("id", uniqueItemIds)

    const itemsMap = new Map(items?.map((item) => [item.id, item]) || [])

    // Format response
    const formattedOutfits = outfits?.map((outfit) => ({
      ...outfit,
      items: outfit.wardrobe_item_ids
        .map((id: string) => itemsMap.get(id))
        .filter(Boolean),
      user_liked: userLikes.includes(outfit.id),
      author: outfit.profiles,
    }))

    // Get total count for pagination
    const { count } = await supabase
      .from("outfit_suggestions")
      .select("*", { count: "exact", head: true })
      .eq("is_public", true)

    return NextResponse.json({
      outfits: formattedOutfits,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count || 0,
        hasMore: offset + query.limit < (count || 0),
      },
    })
  } catch (error) {
    console.error("Explore API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch explore outfits" },
      { status: 500 }
    )
  }
}
