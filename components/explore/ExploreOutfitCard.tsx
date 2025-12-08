"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { animated, useSpring, config } from "@react-spring/web"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Eye, Sparkles } from "lucide-react"
import { LikeButton } from "@/components/social/LikeButton"
import { CommentSection } from "@/components/social/CommentSection"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface ExploreOutfitCardProps {
  outfit: {
    id: string
    items: Array<{
      id: string
      item_name: string
      photo_url: string
      category: string
    }>
    occasion?: string
    overall_score?: number
    visualization_url?: string | null
    likes_count: number
    comments_count: number
    user_liked: boolean
    created_at: string
    author: {
      user_id: string
      username: string
      display_name?: string
      avatar_url?: string
    }
  }
  currentUserId?: string
}

export function ExploreOutfitCard({ outfit, currentUserId }: ExploreOutfitCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [likesCount, setLikesCount] = useState(outfit.likes_count)

  // Card hover animation
  const cardSpring = useSpring({
    transform: isHovered ? "translateY(-4px) scale(1.01)" : "translateY(0px) scale(1)",
    boxShadow: isHovered
      ? "0 16px 32px -8px rgba(32, 200, 168, 0.2), 0 8px 16px -4px rgba(0, 0, 0, 0.1)"
      : "0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
    config: config.gentle,
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const AnimatedCard = animated(Card)

  return (
    <AnimatedCard
      style={cardSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-enhanced overflow-hidden group"
    >
      {/* Main image area */}
      <div className="relative aspect-[3/4] bg-muted">
        {outfit.visualization_url ? (
          <Image
            src={outfit.visualization_url}
            alt="Outfit visualization"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : outfit.items?.length > 0 ? (
          <div className="grid grid-cols-2 h-full">
            {outfit.items.slice(0, 4).map((item, idx) => (
              <div key={item.id} className="relative">
                <Image
                  src={item.photo_url}
                  alt={item.item_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Sparkles className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Score badge */}
        {outfit.overall_score && (
          <div className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-lime to-brand-teal text-sm font-bold text-brand-charcoal shadow-lg">
            {outfit.overall_score}
          </div>
        )}

        {/* Occasion badge */}
        {outfit.occasion && (
          <Badge className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white border-0">
            {outfit.occasion}
          </Badge>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Author info */}
          <Link
            href={`/u/${outfit.author.username}`}
            className="flex items-center gap-2 mb-3 group/author"
          >
            <Avatar className="h-8 w-8 ring-2 ring-white/20">
              <AvatarImage src={outfit.author.avatar_url} />
              <AvatarFallback className="text-xs bg-brand-lavender text-brand-charcoal">
                {getInitials(
                  outfit.author.display_name || outfit.author.username
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate group-hover/author:text-brand-lime transition-colors">
                {outfit.author.display_name || outfit.author.username}
              </p>
              <p className="text-white/60 text-xs">
                {formatDistanceToNow(new Date(outfit.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </Link>

          {/* Engagement stats */}
          <div className="flex items-center gap-3">
            <LikeButton
              outfitId={outfit.id}
              initialLiked={outfit.user_liked}
              likesCount={likesCount}
              onLikeChange={(liked) => {
                setLikesCount((prev) => (liked ? prev + 1 : Math.max(0, prev - 1)))
              }}
              size="sm"
              className="text-white hover:text-red-400 hover:bg-white/10"
            />
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>{outfit.comments_count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card content */}
      <CardContent className="p-4">
        {/* View details link */}
        <Link
          href={`/outfits/${outfit.id}`}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </Link>

        {/* Comments section */}
        <CommentSection
          outfitId={outfit.id}
          commentsCount={outfit.comments_count}
          currentUserId={currentUserId}
        />
      </CardContent>
    </AnimatedCard>
  )
}
