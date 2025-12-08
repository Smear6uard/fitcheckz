"use client"

import { useState, useCallback } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { cn } from "@/lib/utils"
import { SparkleBurst } from "@/components/ui/celebration-animation"

export type ReactionType = "love" | "maybe" | "nope" | null

interface QuickReactionsProps {
  outfitId: string
  currentReaction?: ReactionType
  onReaction: (type: ReactionType) => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
}

const REACTIONS = [
  {
    type: "love" as const,
    emoji: "😍",
    label: "Love it!",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500",
  },
  {
    type: "maybe" as const,
    emoji: "🤔",
    label: "Maybe...",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500",
  },
  {
    type: "nope" as const,
    emoji: "😬",
    label: "Not for me",
    color: "from-gray-400 to-gray-500",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-400",
  },
]

const sizeClasses = {
  sm: "h-10 w-10 text-lg",
  md: "h-12 w-12 text-xl",
  lg: "h-14 w-14 text-2xl",
}

export function QuickReactions({
  outfitId,
  currentReaction,
  onReaction,
  disabled = false,
  size = "md",
}: QuickReactionsProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationIndex, setCelebrationIndex] = useState<number | null>(null)

  const handleReaction = useCallback(
    (type: ReactionType, index: number) => {
      if (disabled) return

      // Toggle off if clicking the same reaction
      if (currentReaction === type) {
        onReaction(null)
        return
      }

      onReaction(type)

      // Show celebration for "love" reaction
      if (type === "love") {
        setCelebrationIndex(index)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 800)
      }
    },
    [currentReaction, disabled, onReaction]
  )

  return (
    <div className="flex items-center justify-center gap-3">
      {REACTIONS.map((reaction, index) => (
        <ReactionButton
          key={reaction.type}
          reaction={reaction}
          isSelected={currentReaction === reaction.type}
          onSelect={() => handleReaction(reaction.type, index)}
          disabled={disabled}
          size={size}
          showCelebration={showCelebration && celebrationIndex === index}
        />
      ))}
    </div>
  )
}

interface ReactionButtonProps {
  reaction: (typeof REACTIONS)[number]
  isSelected: boolean
  onSelect: () => void
  disabled: boolean
  size: "sm" | "md" | "lg"
  showCelebration: boolean
}

function ReactionButton({
  reaction,
  isSelected,
  onSelect,
  disabled,
  size,
  showCelebration,
}: ReactionButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const spring = useSpring({
    transform: isPressed
      ? "scale(0.9)"
      : isSelected
        ? "scale(1.15)"
        : "scale(1)",
    config: config.wobbly,
  })

  const glowSpring = useSpring({
    opacity: isSelected ? 1 : 0,
    scale: isSelected ? 1 : 0.8,
    config: config.gentle,
  })

  return (
    <div className="relative">
      {/* Celebration burst */}
      {showCelebration && <SparkleBurst trigger={showCelebration} />}

      {/* Glow effect when selected */}
      <animated.div
        style={{
          opacity: glowSpring.opacity,
          transform: glowSpring.scale.to((s) => `scale(${s})`),
        }}
        className={cn(
          "absolute inset-0 rounded-full blur-md",
          `bg-gradient-to-r ${reaction.color}`
        )}
      />

      {/* Button */}
      <animated.button
        style={spring}
        onClick={onSelect}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        disabled={disabled}
        className={cn(
          "relative flex items-center justify-center rounded-full border-2 transition-colors touch-target",
          sizeClasses[size],
          isSelected
            ? `${reaction.bgColor} ${reaction.borderColor}`
            : "border-border bg-card hover:border-muted-foreground/30",
          disabled && "cursor-not-allowed opacity-50"
        )}
        aria-label={reaction.label}
        title={reaction.label}
      >
        <span
          className={cn(
            "transition-transform",
            isSelected && "animate-bounce"
          )}
          style={{ animationIterationCount: 1 }}
        >
          {reaction.emoji}
        </span>
      </animated.button>

      {/* Label on hover/select */}
      {isSelected && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-muted-foreground">
          {reaction.label}
        </span>
      )}
    </div>
  )
}

/**
 * Compact inline version for tight spaces
 */
export function InlineReactions({
  currentReaction,
  onReaction,
  disabled = false,
}: Omit<QuickReactionsProps, "outfitId" | "size">) {
  return (
    <div className="flex items-center gap-2">
      {REACTIONS.map((reaction) => {
        const isSelected = currentReaction === reaction.type

        return (
          <button
            key={reaction.type}
            onClick={() => onReaction(isSelected ? null : reaction.type)}
            disabled={disabled}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-all",
              isSelected
                ? `${reaction.bgColor} ${reaction.borderColor} border font-medium`
                : "hover:bg-accent"
            )}
          >
            <span>{reaction.emoji}</span>
            {isSelected && (
              <span className="text-xs">{reaction.label.split(" ")[0]}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
