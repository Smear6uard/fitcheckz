import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const followSchema = z.object({
  user_id: z.string().uuid(),
})

// Follow a user
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
    const { user_id: following_id } = followSchema.parse(body)

    // Can't follow yourself
    if (user.id === following_id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      )
    }

    // Check if target user exists and is public
    const { data: targetUser, error: userError } = await supabase
      .from("profiles")
      .select("user_id, is_public")
      .eq("user_id", following_id)
      .single()

    if (userError || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!targetUser.is_public) {
      return NextResponse.json(
        { error: "Can only follow public profiles" },
        { status: 403 }
      )
    }

    // Create follow
    const { error: followError } = await supabase.from("follows").insert({
      follower_id: user.id,
      following_id,
    })

    if (followError) {
      // Unique constraint violation means already following
      if (followError.code === "23505") {
        return NextResponse.json(
          { error: "Already following this user" },
          { status: 409 }
        )
      }
      console.error("Error creating follow:", followError)
      return NextResponse.json(
        { error: "Failed to follow user" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Follow API error:", error)
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    )
  }
}

// Unfollow a user
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const following_id = searchParams.get("user_id")

    if (!following_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", following_id)

    if (error) {
      console.error("Error deleting follow:", error)
      return NextResponse.json(
        { error: "Failed to unfollow user" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unfollow API error:", error)
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    )
  }
}

// Check if following a user
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const following_id = searchParams.get("user_id")

    if (!following_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", following_id)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking follow:", error)
      return NextResponse.json(
        { error: "Failed to check follow status" },
        { status: 500 }
      )
    }

    return NextResponse.json({ isFollowing: !!data })
  } catch (error) {
    console.error("Check follow API error:", error)
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 }
    )
  }
}
