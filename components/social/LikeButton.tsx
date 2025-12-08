"use client"

import { useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "@/lib/utils/toast-personality"

interface LikeButtonProps {
  outfitId: string
  initialLiked?: boolean
  likesCount?: number
  onLikeChange?: (liked: boolean) => void
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  className?: string
}

export function LikeButton({
  outfitId,
  initialLiked = false,
  likesCount = 0,
  onLikeChange,
  size = "md",
  showCount = true,
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(likesCount)
  const [isLoading, setIsLoading] = useState(false)

  // Heart burst animation
  const heartSpring = useSpring({
    transform: liked ? "scale(1.2)" : "scale(1)",
    config: { tension: 400, friction: 10 },
  })

  // Particle burst animation
  const [showBurst, setShowBurst] = useState(false)
  const burstSpring = useSpring({
    opacity: showBurst ? 1 : 0,
    transform: showBurst ? "scale(1.5)" : "scale(0.5)",
    config: config.wobbly,
    onRest: () => {
      if (showBurst) setShowBurst(false)
    },
  })

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    const newLiked = !liked

    // Optimistic update
    setLiked(newLiked)
    setCount((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)))

    if (newLiked) {
      setShowBurst(true)
    }

    try {
      if (newLiked) {
        const res = await fetch("/api/community/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ outfit_id: outfitId }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to like")
        }
      } else {
        const res = await fetch(
          `/api/community/likes?outfit_id=${outfitId}`,
          { method: "DELETE" }
        )

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to unlike")
        }
      }

      onLikeChange?.(newLiked)
    } catch (error) {
      // Revert on error
      setLiked(!newLiked)
      setCount((prev) => (!newLiked ? prev + 1 : Math.max(0, prev - 1)))
      toast.error(
        error instanceof Error ? error.message : "Failed to update like"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: "h-8 px-2 text-xs",
    md: "h-9 px-3 text-sm",
    lg: "h-10 px-4 text-base",
  }

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "relative gap-1.5 transition-colors",
        liked && "text-red-500 hover:text-red-600",
        sizeClasses[size],
        className
      )}
    >
      {/* Burst effect */}
      <animated.div
        style={burstSpring}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-red-400"
              style={{
                transform: `rotate(${i * 60}deg) translateY(-12px)`,
              }}
            />
          ))}
        </div>
      </animated.div>

      <animated.div style={heartSpring}>
        <Heart
          className={cn(
            iconSizes[size],
            liked && "fill-current"
          )}
        />
      </animated.div>

      {showCount && (
        <span className="min-w-[1.5ch] text-center">{count}</span>
      )}
    </Button>
  )
}
