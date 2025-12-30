"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { animated, useSpring, config } from "@react-spring/web"
import {
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  Users,
  Lock,
  ExternalLink,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FollowButton } from "@/components/social/FollowButton"
import { LikeButton } from "@/components/social/LikeButton"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface ProfileData {
  user_id: string
  username: string
  display_name?: string
  bio?: string
  avatar_url?: string
  aesthetic_preference?: string
  followers_count: number
  following_count: number
  outfits_count: number
  is_public: boolean
  created_at: string
}

interface OutfitData {
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
}

interface PublicProfileProps {
  profile: ProfileData
  outfits: OutfitData[]
  isFollowing: boolean
  isOwnProfile: boolean
  currentUserId?: string
}

export function PublicProfile({
  profile,
  outfits,
  isFollowing: initialIsFollowing,
  isOwnProfile,
  currentUserId,
}: PublicProfileProps) {
  const [followersCount, setFollowersCount] = useState(profile.followers_count)

  // Header animation
  const headerSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
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

  const getAestheticEmoji = (aesthetic?: string) => {
    const emojis: Record<string, string> = {
      minimalist: "🤍",
      trendy: "✨",
      classic: "🎩",
      edgy: "🖤",
    }
    return aesthetic ? emojis[aesthetic] || "👗" : "👗"
  }

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <animated.div
        style={headerSpring}
        className="relative rounded-2xl border bg-gradient-to-br from-background via-white to-secondary p-6 sm:p-8"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-5">
          <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-repeat" />
        </div>

        <div className="relative flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-white shadow-lg">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials(profile.display_name || profile.username)}
            </AvatarFallback>
          </Avatar>

          {/* Profile info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {profile.display_name || profile.username}
                </h1>
                {profile.aesthetic_preference && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/20"
                  >
                    {getAestheticEmoji(profile.aesthetic_preference)}{" "}
                    {profile.aesthetic_preference}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>

            {profile.bio && (
              <p className="text-muted-foreground max-w-lg">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.outfits_count}</p>
                <p className="text-sm text-muted-foreground">Outfits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{followersCount}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.following_count}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isOwnProfile ? (
                <Button asChild>
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              ) : (
                currentUserId && (
                  <FollowButton
                    userId={profile.user_id}
                    initialFollowing={initialIsFollowing}
                    onFollowChange={(following) => {
                      setFollowersCount((prev) =>
                        following ? prev + 1 : Math.max(0, prev - 1)
                      )
                    }}
                  />
                )
              )}
            </div>

            {/* Member since */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Member since{" "}
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </animated.div>

      {/* Outfits grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Public Outfits
        </h2>

        {outfits.length === 0 ? (
          <EmptyState
            icon={Lock}
            title="No public outfits yet"
            description={
              isOwnProfile
                ? "Share your style with the world! Make some of your outfits public."
                : "This user hasn't shared any outfits yet."
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outfits.map((outfit) => (
              <OutfitPreviewCard
                key={outfit.id}
                outfit={outfit}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Smaller outfit card for profile grid
function OutfitPreviewCard({
  outfit,
  currentUserId,
}: {
  outfit: OutfitData
  currentUserId?: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardSpring = useSpring({
    transform: isHovered ? "scale(1.02)" : "scale(1)",
    config: config.gentle,
  })

  const AnimatedCard = animated(Card)

  return (
    <AnimatedCard
      style={cardSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="overflow-hidden group"
    >
      <div className="relative aspect-square">
        {outfit.visualization_url ? (
          <Image
            src={outfit.visualization_url}
            alt="Outfit"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : outfit.items?.length > 0 ? (
          <div className="grid grid-cols-2 h-full">
            {outfit.items.slice(0, 4).map((item) => (
              <div key={item.id} className="relative">
                <Image
                  src={item.photo_url}
                  alt={item.item_name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <Sparkles className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}

        {/* Score badge */}
        {outfit.overall_score && (
          <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {outfit.overall_score}
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Hover content */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LikeButton
                outfitId={outfit.id}
                initialLiked={outfit.user_liked}
                likesCount={outfit.likes_count}
                size="sm"
                className="text-white hover:text-red-400 hover:bg-white/10"
              />
            </div>
            <Button
              size="sm"
              variant="secondary"
              asChild
              className="h-8"
            >
              <Link href={`/outfits/${outfit.id}`}>
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {outfit.occasion && (
        <CardContent className="p-3">
          <Badge variant="outline" className="text-xs">
            {outfit.occasion}
          </Badge>
        </CardContent>
      )}
    </AnimatedCard>
  )
}
