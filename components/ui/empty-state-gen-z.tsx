"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { animated, useSpring, config } from "@react-spring/web"
import {
  Shirt,
  Sparkles,
  Heart,
  Camera,
  TrendingUp,
  Palette,
  LucideIcon,
} from "lucide-react"
import Link from "next/link"

type EmptyStateVariant =
  | "wardrobe"
  | "outfits"
  | "favorites"
  | "history"
  | "analytics"
  | "custom"

interface EmptyStateGenZProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  icon?: LucideIcon
  className?: string
}

const VARIANTS: Record<
  Exclude<EmptyStateVariant, "custom">,
  {
    title: string
    description: string
    actionLabel: string
    actionHref: string
    icon: LucideIcon
    emoji: string
    accentColor: string
  }
> = {
  wardrobe: {
    title: "Your closet is giving... nothing",
    description:
      "Time to show us what you're working with! Upload your first piece and let's build your wardrobe together.",
    actionLabel: "Add Your First Item",
    actionHref: "/wardrobe/add",
    icon: Shirt,
    emoji: "👗",
    accentColor: "bg-primary",
  },
  outfits: {
    title: "No fits yet? We can fix that",
    description:
      "Your wardrobe is waiting. Let's create some fire outfits that'll have everyone asking where you got your style.",
    actionLabel: "Generate Your First Look",
    actionHref: "/outfits/generate",
    icon: Sparkles,
    emoji: "✨",
    accentColor: "bg-primary",
  },
  favorites: {
    title: "No saved looks... yet",
    description:
      "When you find outfits that hit different, they'll live here. Start swiping and save your faves!",
    actionLabel: "Discover Outfits",
    actionHref: "/outfits/generate",
    icon: Heart,
    emoji: "💕",
    accentColor: "bg-primary/80",
  },
  history: {
    title: "Your style journey starts here",
    description:
      "Every outfit you generate will be saved here. It's like a diary, but make it fashion.",
    actionLabel: "Create Your First Outfit",
    actionHref: "/outfits/generate",
    icon: TrendingUp,
    emoji: "📈",
    accentColor: "bg-primary",
  },
  analytics: {
    title: "Not enough data yet",
    description:
      "Add more items and generate some outfits to unlock your style insights. The more you use it, the smarter it gets!",
    actionLabel: "Build Your Wardrobe",
    actionHref: "/wardrobe/add",
    icon: Palette,
    emoji: "🎨",
    accentColor: "bg-primary",
  },
}

export function EmptyStateGenZ({
  variant = "custom",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon: CustomIcon,
  className,
}: EmptyStateGenZProps) {
  const config_data = variant !== "custom" ? VARIANTS[variant] : null

  const displayTitle = title || config_data?.title || "Nothing here yet"
  const displayDescription =
    description || config_data?.description || "Start adding content"
  const displayActionLabel = actionLabel || config_data?.actionLabel
  const displayActionHref = actionHref || config_data?.actionHref
  const Icon = CustomIcon || config_data?.icon || Sparkles
  const emoji = config_data?.emoji || "✨"
  const accentColor = config_data?.accentColor || "bg-primary"

  // Floating animation for icon
  const floatSpring = useSpring({
    from: { y: 0 },
    to: async (next) => {
      while (true) {
        await next({ y: -8 })
        await next({ y: 0 })
      }
    },
    config: { tension: 100, friction: 10 },
  })

  // Emoji bounce animation
  const emojiSpring = useSpring({
    from: { scale: 1, rotate: 0 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.1, rotate: 5 })
        await next({ scale: 1, rotate: -5 })
        await next({ scale: 1.05, rotate: 0 })
        await next({ scale: 1, rotate: 0 })
      }
    },
    config: config.gentle,
    loop: true,
    delay: 2000,
  })

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-12 text-center",
        className
      )}
    >
      {/* Animated Icon Container */}
      <animated.div
        style={{ y: floatSpring.y }}
        className="relative mb-6"
      >
        {/* Background glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-20 blur-xl",
            accentColor
          )}
          style={{ transform: "scale(1.5)" }}
        />

        {/* Icon circle */}
        <div
          className={cn(
            "relative flex h-24 w-24 items-center justify-center rounded-full shadow-lg",
            accentColor
          )}
        >
          <Icon className="h-10 w-10 text-white" />
        </div>

        {/* Floating emoji */}
        <animated.span
          style={{
            transform: emojiSpring.scale.to((s) => `scale(${s})`),
          }}
          className="absolute -right-2 -top-2 text-3xl"
        >
          {emoji}
        </animated.span>
      </animated.div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-bold text-foreground">{displayTitle}</h3>

      {/* Description */}
      <p className="mb-6 max-w-sm text-muted-foreground">{displayDescription}</p>

      {/* Action Button */}
      {(displayActionHref || onAction) && displayActionLabel && (
        <div className="flex flex-col gap-3">
          {displayActionHref ? (
            <Button
              asChild
              className="btn-glow bg-primary font-semibold text-primary-foreground hover:opacity-90"
            >
              <Link href={displayActionHref}>{displayActionLabel}</Link>
            </Button>
          ) : onAction ? (
            <Button
              onClick={onAction}
              className="btn-glow bg-primary font-semibold text-primary-foreground hover:opacity-90"
            >
              {displayActionLabel}
            </Button>
          ) : null}

          {/* Helpful hint */}
          <p className="text-xs text-muted-foreground/60">
            Don't worry, we've got you
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Compact inline version for smaller spaces
 */
export function EmptyStateCompact({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-6 text-center",
        className
      )}
    >
      <p className="mb-1 font-medium text-foreground">{title}</p>
      {description && (
        <p className="mb-3 text-sm text-muted-foreground">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
