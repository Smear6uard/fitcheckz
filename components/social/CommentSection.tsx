"use client"

import { useState, useEffect, useRef } from "react"
import { animated, useTransition, config } from "@react-spring/web"
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { toast } from "@/lib/utils/toast-personality"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  author: {
    username: string
    display_name?: string
    avatar_url?: string
  }
}

interface CommentSectionProps {
  outfitId: string
  commentsCount?: number
  currentUserId?: string
  className?: string
}

export function CommentSection({
  outfitId,
  commentsCount = 0,
  currentUserId,
  className,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Animation for comments
  const transitions = useTransition(comments, {
    keys: (comment) => comment.id,
    from: { opacity: 0, transform: "translateY(-10px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateX(-20px)" },
    config: config.gentle,
  })

  // Fetch comments when opened
  useEffect(() => {
    if (isOpen && comments.length === 0) {
      fetchComments()
    }
  }, [isOpen])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/community/comments?outfit_id=${outfitId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Failed to load comments")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outfit_id: outfitId,
          content: newComment.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to post comment")
      }

      const data = await res.json()
      setComments((prev) => [...prev, data.comment])
      setNewComment("")
      toast.success("Comment posted!")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to post comment"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetch(
        `/api/community/comments?comment_id=${commentId}`,
        { method: "DELETE" }
      )

      if (!res.ok) {
        throw new Error("Failed to delete comment")
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId))
      toast.success("Comment deleted")
    } catch (error) {
      toast.error("Failed to delete comment")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <MessageCircle className="h-4 w-4" />
        <span>
          {commentsCount > 0 || comments.length > 0
            ? `${comments.length || commentsCount} comment${(comments.length || commentsCount) !== 1 ? "s" : ""}`
            : "Add comment"}
        </span>
      </Button>

      {/* Comments panel */}
      {isOpen && (
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
          {/* Comment input */}
          {currentUserId && (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                maxLength={500}
                disabled={isSubmitting}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          )}

          {/* Comments list */}
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No comments yet. Be the first!
            </p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {transitions((style, comment) => (
                <animated.div
                  style={style}
                  className="flex gap-3 group"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={comment.author.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {getInitials(
                        comment.author.display_name || comment.author.username
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {comment.author.display_name || comment.author.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      {currentUserId === comment.user_id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground break-words">
                      {comment.content}
                    </p>
                  </div>
                </animated.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
