import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const likeSchema = z.object({
  outfit_id: z.string().uuid(),
})

// Like an outfit
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
    const { outfit_id } = likeSchema.parse(body)

    // Check if outfit is public
    const { data: outfit, error: outfitError } = await supabase
      .from("outfit_suggestions")
      .select("id, is_public")
      .eq("id", outfit_id)
      .single()

    if (outfitError || !outfit) {
      return NextResponse.json({ error: "Outfit not found" }, { status: 404 })
    }

    if (!outfit.is_public) {
      return NextResponse.json(
        { error: "Can only like public outfits" },
        { status: 403 }
      )
    }

    // Create like
    const { error: likeError } = await supabase.from("outfit_likes").insert({
      user_id: user.id,
      outfit_id,
    })

    if (likeError) {
      // Unique constraint violation means already liked
      if (likeError.code === "23505") {
        return NextResponse.json(
          { error: "Already liked this outfit" },
          { status: 409 }
        )
      }
      console.error("Error creating like:", likeError)
      return NextResponse.json(
        { error: "Failed to like outfit" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Like API error:", error)
    return NextResponse.json(
      { error: "Failed to like outfit" },
      { status: 500 }
    )
  }
}

// Unlike an outfit
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
    const outfit_id = searchParams.get("outfit_id")

    if (!outfit_id) {
      return NextResponse.json(
        { error: "outfit_id is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("outfit_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("outfit_id", outfit_id)

    if (error) {
      console.error("Error deleting like:", error)
      return NextResponse.json(
        { error: "Failed to unlike outfit" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unlike API error:", error)
    return NextResponse.json(
      { error: "Failed to unlike outfit" },
      { status: 500 }
    )
  }
}
