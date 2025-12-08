import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const commentSchema = z.object({
  outfit_id: z.string().uuid(),
  content: z.string().min(1).max(500),
})

// Get comments for an outfit
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const outfit_id = searchParams.get("outfit_id")

    if (!outfit_id) {
      return NextResponse.json(
        { error: "outfit_id is required" },
        { status: 400 }
      )
    }

    const { data: comments, error } = await supabase
      .from("outfit_comments")
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        profiles!inner(
          username,
          display_name,
          avatar_url
        )
      `
      )
      .eq("outfit_id", outfit_id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching comments:", error)
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 500 }
      )
    }

    const formattedComments = comments?.map((comment) => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      user_id: comment.user_id,
      author: comment.profiles,
    }))

    return NextResponse.json({ comments: formattedComments })
  } catch (error) {
    console.error("Comments API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

// Create a comment
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
    const { outfit_id, content } = commentSchema.parse(body)

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
        { error: "Can only comment on public outfits" },
        { status: 403 }
      )
    }

    // Create comment
    const { data: comment, error: commentError } = await supabase
      .from("outfit_comments")
      .insert({
        outfit_id,
        user_id: user.id,
        content,
      })
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        profiles!inner(
          username,
          display_name,
          avatar_url
        )
      `
      )
      .single()

    if (commentError) {
      console.error("Error creating comment:", commentError)
      return NextResponse.json(
        { error: "Failed to create comment" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      comment: {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user_id: comment.user_id,
        author: comment.profiles,
      },
    })
  } catch (error) {
    console.error("Create comment API error:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}

// Delete a comment
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
    const comment_id = searchParams.get("comment_id")

    if (!comment_id) {
      return NextResponse.json(
        { error: "comment_id is required" },
        { status: 400 }
      )
    }

    // Only allow deleting own comments
    const { error } = await supabase
      .from("outfit_comments")
      .delete()
      .eq("id", comment_id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error deleting comment:", error)
      return NextResponse.json(
        { error: "Failed to delete comment" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete comment API error:", error)
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    )
  }
}
