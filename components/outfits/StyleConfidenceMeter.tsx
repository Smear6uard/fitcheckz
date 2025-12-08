"use client"

import { useMemo, useEffect, useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { Sparkles, Flame, Zap, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface StyleConfidenceMeterProps {
  occasion: string
  season: string
  style: string
  formality: string
  wardrobeSize: number
  className?: string
}

// Calculate confidence based on selections
function calculateConfidence(
  occasion: string,
  season: string,
  style: string,
  formality: string,
  wardrobeSize: number
): number {
  let score = 0

  // Base score from having selections
  if (occasion) score += 15
  if (season) score += 15
  if (style) score += 15
  if (formality) score += 15

  // Bonus for wardrobe size
  if (wardrobeSize >= 5) score += 10
  if (wardrobeSize >= 10) score += 10
  if (wardrobeSize >= 20) score += 10
  if (wardrobeSize >= 30) score += 10

  // Cap at 100
  return Math.min(score, 100)
}

// Get message based on confidence level
function getMessage(confidence: number): { text: string; emoji: string } {
  if (confidence >= 90) return { text: "SLAY incoming!", emoji: "" }
  if (confidence >= 75) return { text: "Fire fit incoming!", emoji: "" }
  if (confidence >= 60) return { text: "Looking good...", emoji: "" }
  if (confidence >= 40) return { text: "Getting there...", emoji: "" }
  if (confidence >= 20) return { text: "Keep selecting...", emoji: "" }
  return { text: "Let's build your fit", emoji: "" }
}

// Get color based on confidence
function getColor(confidence: number): string {
  if (confidence >= 90) return "text-amber-500"
  if (confidence >= 75) return "text-brand-lime"
  if (confidence >= 50) return "text-brand-teal"
  if (confidence >= 25) return "text-blue-500"
  return "text-muted-foreground"
}

function getGradient(confidence: number): string {
  if (confidence >= 90) return "from-amber-400 to-orange-500"
  if (confidence >= 75) return "from-brand-lime to-emerald-500"
  if (confidence >= 50) return "from-brand-teal to-cyan-500"
  if (confidence >= 25) return "from-blue-400 to-indigo-500"
  return "from-gray-400 to-gray-500"
}

export function StyleConfidenceMeter({
  occasion,
  season,
  style,
  formality,
  wardrobeSize,
  className,
}: StyleConfidenceMeterProps) {
  const [displayedConfidence, setDisplayedConfidence] = useState(0)

  const confidence = useMemo(
    () => calculateConfidence(occasion, season, style, formality, wardrobeSize),
    [occasion, season, style, formality, wardrobeSize]
  )

  const message = getMessage(confidence)
  const colorClass = getColor(confidence)
  const gradient = getGradient(confidence)

  // Animate the confidence value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedConfidence(confidence)
    }, 100)
    return () => clearTimeout(timer)
  }, [confidence])

  // Spring animation for the meter
  const meterSpring = useSpring({
    width: `${displayedConfidence}%`,
    config: { tension: 120, friction: 14 },
  })

  // Pulse animation when at high confidence
  const pulseSpring = useSpring({
    scale: confidence >= 75 ? 1.02 : 1,
    config: config.wobbly,
  })

  // Icon animation
  const iconSpring = useSpring({
    rotate: confidence >= 90 ? 10 : 0,
    scale: confidence >= 75 ? 1.1 : 1,
    config: config.wobbly,
  })

  const Icon = confidence >= 90 ? Flame : confidence >= 75 ? Zap : Sparkles

  return (
    <animated.div
      style={{ scale: pulseSpring.scale }}
      className={cn(
        "rounded-xl border bg-card p-4 transition-colors duration-300",
        confidence >= 75 && "border-brand-lime/50 shadow-lg shadow-brand-lime/10",
        confidence >= 90 && "border-amber-400/50 shadow-lg shadow-amber-400/20",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <animated.div style={{ rotate: iconSpring.rotate, scale: iconSpring.scale }}>
            <Icon className={cn("h-5 w-5", colorClass)} />
          </animated.div>
          <span className="text-sm font-medium">Style Confidence</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-2xl font-bold tabular-nums", colorClass)}>
            {displayedConfidence}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 rounded-full bg-muted overflow-hidden mb-3">
        <animated.div
          style={{ width: meterSpring.width }}
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
            gradient
          )}
        />
        {/* Shimmer effect */}
        {confidence >= 75 && (
          <div className="absolute inset-0 animate-shimmer opacity-30" />
        )}
      </div>

      {/* Message */}
      <div className="flex items-center justify-between">
        <p className={cn("text-sm font-medium", colorClass)}>
          {message.emoji} {message.text}
        </p>

        {/* Selection indicators */}
        <div className="flex gap-1">
          {[
            { value: occasion, label: "O" },
            { value: season, label: "S" },
            { value: style, label: "V" },
            { value: formality, label: "F" },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                item.value ? "bg-brand-teal" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Encouraging tips at low confidence */}
      {confidence < 40 && wardrobeSize < 5 && (
        <p className="text-xs text-muted-foreground mt-2">
          Tip: Add more items to your wardrobe for better outfit suggestions!
        </p>
      )}
    </animated.div>
  )
}
