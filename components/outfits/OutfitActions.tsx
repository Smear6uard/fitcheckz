"use client"

import { useState, useCallback } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import { Heart, Star, Share2 } from "lucide-react"
import { ShareButton } from "@/components/social/ShareButton"
import { cn } from "@/lib/utils"
import { haptics } from "@/lib/haptics"

interface OutfitActionsProps {
  outfitId: string
  occasion?: string
  score?: number
  isLiked?: boolean
  isFavorited?: boolean
  onLike?: (liked: boolean) => void
  onFavorite?: (favorited: boolean) => void
  size?: "sm" | "md" | "lg"
  variant?: "horizontal" | "vertical"
  className?: string
}

export function OutfitActions({
  outfitId,
  occasion,
  score,
  isLiked = false,
  isFavorited = false,
  onLike,
  onFavorite,
  size = "md",
  variant = "horizontal",
  className,
}: OutfitActionsProps) {
  const [liked, setLiked] = useState(isLiked)
  const [favorited, setFavorited] = useState(isFavorited)
  const [likeAnimating, setLikeAnimating] = useState(false)
  const [favoriteAnimating, setFavoriteAnimating] = useState(false)

  // Sync with props
  if (isLiked !== liked && !likeAnimating) {
    setLiked(isLiked)
  }
  if (isFavorited !== favorited && !favoriteAnimating) {
    setFavorited(isFavorited)
  }

  // Like button animation
  const likeSpring = useSpring({
    scale: likeAnimating ? 1.3 : 1,
    config: config.wobbly,
    onRest: () => setLikeAnimating(false),
  })

  // Favorite button animation
  const favoriteSpring = useSpring({
    scale: favoriteAnimating ? 1.3 : 1,
    rotate: favoriteAnimating ? 15 : 0,
    config: config.wobbly,
    onRest: () => setFavoriteAnimating(false),
  })

  const handleLike = useCallback(() => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikeAnimating(true)
    haptics.like()
    onLike?.(newLiked)
  }, [liked, onLike])

  const handleFavorite = useCallback(() => {
    const newFavorited = !favorited
    setFavorited(newFavorited)
    setFavoriteAnimating(true)
    haptics.selection()
    onFavorite?.(newFavorited)
  }, [favorited, onFavorite])

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const containerClasses = cn(
    "flex items-center gap-2",
    variant === "vertical" && "flex-col",
    className
  )

  return (
    <div className={containerClasses}>
      {/* Like Button */}
      <animated.div style={{ scale: likeSpring.scale }}>
        <Button
          variant="outline"
          size="icon"
          onClick={handleLike}
          className={cn(
            sizeClasses[size],
            "transition-colors touch-target",
            liked && "bg-rose-500/20 border-rose-500 text-rose-500 hover:bg-rose-500/30 hover:text-rose-400"
          )}
          aria-label={liked ? "Unlike outfit" : "Like outfit"}
          aria-pressed={liked}
        >
          <Heart
            className={cn(
              iconSizes[size],
              "transition-all",
              liked && "fill-current"
            )}
          />
        </Button>
      </animated.div>

      {/* Favorite Button */}
      <animated.div
        style={{
          scale: favoriteSpring.scale,
          rotate: favoriteSpring.rotate.to((r) => `${r}deg`),
        }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={handleFavorite}
          className={cn(
            sizeClasses[size],
            "transition-colors touch-target",
            favorited && "bg-amber-500/20 border-amber-500 text-amber-500 hover:bg-amber-500/30 hover:text-amber-400"
          )}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
        >
          <Star
            className={cn(
              iconSizes[size],
              "transition-all",
              favorited && "fill-current"
            )}
          />
        </Button>
      </animated.div>

      {/* Share Button */}
      <ShareButton
        outfitId={outfitId}
        occasion={occasion}
        score={score}
        variant="outline"
        size="icon"
        className={cn(sizeClasses[size], "touch-target")}
      />
    </div>
  )
}

/**
 * Minimal action buttons for compact layouts
 */
export function OutfitActionsCompact({
  outfitId,
  occasion,
  score,
  isLiked = false,
  isFavorited = false,
  onLike,
  onFavorite,
  className,
}: Omit<OutfitActionsProps, "size" | "variant">) {
  return (
    <OutfitActions
      outfitId={outfitId}
      occasion={occasion}
      score={score}
      isLiked={isLiked}
      isFavorited={isFavorited}
      onLike={onLike}
      onFavorite={onFavorite}
      size="sm"
      className={className}
    />
  )
}
