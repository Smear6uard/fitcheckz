import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Get a public profile by username
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 }
      )
    }

    // Get current user to check if following
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
        user_id,
        username,
        display_name,
        bio,
        avatar_url,
        profile_photo_url,
        aesthetic_preference,
        followers_count,
        following_count,
        is_public,
        created_at
      `
      )
      .eq("username", username)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (!profile.is_public && currentUser?.id !== profile.user_id) {
      return NextResponse.json(
        { error: "This profile is private" },
        { status: 403 }
      )
    }

    // Check if current user is following
    let isFollowing = false
    if (currentUser && currentUser.id !== profile.user_id) {
      const { data: follow } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", currentUser.id)
        .eq("following_id", profile.user_id)
        .single()

      isFollowing = !!follow
    }

    // Get public outfits count
    const { count: outfitsCount } = await supabase
      .from("outfit_suggestions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.user_id)
      .eq("is_public", true)

    // Get public outfits
    const { data: outfits } = await supabase
      .from("outfit_suggestions")
      .select(
        `
        id,
        wardrobe_item_ids,
        occasion,
        overall_score,
        visualization_url,
        likes_count,
        comments_count,
        is_public,
        created_at
      `
      )
      .eq("user_id", profile.user_id)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(12)

    // Fetch wardrobe items for outfits
    const allItemIds = outfits?.flatMap((o) => o.wardrobe_item_ids) || []
    const uniqueItemIds = [...new Set(allItemIds)]

    let items: any[] = []
    if (uniqueItemIds.length > 0) {
      const { data: itemsData } = await supabase
        .from("wardrobe_items")
        .select("id, item_name, photo_url, category")
        .in("id", uniqueItemIds)

      items = itemsData || []
    }

    const itemsMap = new Map(items.map((item) => [item.id, item]))

    // Check which outfits current user has liked
    let userLikes: string[] = []
    if (currentUser) {
      const { data: likes } = await supabase
        .from("outfit_likes")
        .select("outfit_id")
        .eq("user_id", currentUser.id)
        .in(
          "outfit_id",
          outfits?.map((o) => o.id) || []
        )

      userLikes = likes?.map((l) => l.outfit_id) || []
    }

    const formattedOutfits = outfits?.map((outfit) => ({
      ...outfit,
      items: outfit.wardrobe_item_ids
        .map((id: string) => itemsMap.get(id))
        .filter(Boolean),
      user_liked: userLikes.includes(outfit.id),
    }))

    return NextResponse.json({
      profile: {
        ...profile,
        avatar_url: profile.avatar_url || profile.profile_photo_url,
        outfits_count: outfitsCount || 0,
      },
      outfits: formattedOutfits,
      isFollowing,
      isOwnProfile: currentUser?.id === profile.user_id,
    })
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}
