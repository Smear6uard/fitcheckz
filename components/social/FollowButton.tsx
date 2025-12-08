"use client"

import { useState, useEffect } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { UserPlus, UserCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "@/lib/utils/toast-personality"

interface FollowButtonProps {
  userId: string
  initialFollowing?: boolean
  onFollowChange?: (following: boolean) => void
  variant?: "default" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function FollowButton({
  userId,
  initialFollowing = false,
  onFollowChange,
  variant = "default",
  size = "md",
  className,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Check follow status on mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const res = await fetch(`/api/community/follows?user_id=${userId}`)
        if (res.ok) {
          const data = await res.json()
          setFollowing(data.isFollowing)
        }
      } catch (error) {
        console.error("Error checking follow status:", error)
      }
    }

    if (!initialFollowing) {
      checkFollowStatus()
    }
  }, [userId, initialFollowing])

  // Button animation
  const buttonSpring = useSpring({
    transform: isLoading ? "scale(0.95)" : "scale(1)",
    config: config.wobbly,
  })

  const handleFollow = async () => {
    if (isLoading) return

    setIsLoading(true)
    const newFollowing = !following

    // Optimistic update
    setFollowing(newFollowing)

    try {
      if (newFollowing) {
        const res = await fetch("/api/community/follows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to follow")
        }

        toast.success("Now following!")
      } else {
        const res = await fetch(`/api/community/follows?user_id=${userId}`, {
          method: "DELETE",
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to unfollow")
        }

        toast.info("Unfollowed")
      }

      onFollowChange?.(newFollowing)
    } catch (error) {
      // Revert on error
      setFollowing(!newFollowing)
      toast.error(
        error instanceof Error ? error.message : "Failed to update follow"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-base",
  }

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const AnimatedButton = animated(Button)

  // Show "Unfollow" on hover when following
  const buttonText = following
    ? isHovered
      ? "Unfollow"
      : "Following"
    : "Follow"

  const Icon = isLoading
    ? Loader2
    : following
      ? UserCheck
      : UserPlus

  return (
    <AnimatedButton
      style={buttonSpring}
      variant={following ? "outline" : variant === "outline" ? "outline" : "default"}
      onClick={handleFollow}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "gap-2 transition-all",
        following && isHovered && "border-red-500 text-red-500 hover:bg-red-50",
        following && !isHovered && "border-brand-lime text-brand-lime",
        sizeClasses[size],
        className
      )}
    >
      <Icon
        className={cn(
          iconSizes[size],
          isLoading && "animate-spin"
        )}
      />
      <span className="min-w-[4.5rem]">{buttonText}</span>
    </AnimatedButton>
  )
}
