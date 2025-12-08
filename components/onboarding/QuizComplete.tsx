"use client"

import { useEffect, useState } from "react"
import { animated, useSpring, useSprings, config } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import { CelebrationAnimation } from "@/components/ui/celebration-animation"
import { Sparkles, ArrowRight } from "lucide-react"

interface QuizCompleteProps {
  onContinue: () => void
  preferences: Record<string, string[]>
}

export function QuizComplete({ onContinue, preferences }: QuizCompleteProps) {
  const [showCelebration, setShowCelebration] = useState(false)

  // Trigger celebration on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Entry animations
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    delay: 500,
    config: config.gentle,
  })

  const subtitleSpring = useSpring({
    from: { opacity: 0, y: -10 },
    to: { opacity: 1, y: 0 },
    delay: 700,
    config: config.gentle,
  })

  const contentSpring = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    delay: 900,
    config: config.gentle,
  })

  const buttonSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    delay: 1200,
    config: config.gentle,
  })

  // Count total selections
  const totalSelections = Object.values(preferences).flat().length

  // Get summary highlights
  const vibesSummary = preferences.vibes?.slice(0, 2).join(", ") || "your unique"
  const colorsSummary = preferences.colors?.slice(0, 3).join(", ") || "colorful"

  return (
    <div className="relative flex min-h-[600px] flex-col items-center justify-center px-6 py-12 text-center">
      {/* Celebration */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <CelebrationAnimation
          trigger={showCelebration}
          particleCount={20}
          size="lg"
        />
      </div>

      {/* Icon */}
      <animated.div
        style={{
          opacity: titleSpring.opacity,
          transform: titleSpring.y.to((y) => `translateY(${y}px)`),
        }}
        className="relative mb-6"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-lime to-brand-teal shadow-lg">
          <Sparkles className="h-12 w-12 text-brand-charcoal" />
        </div>
        <span className="absolute -right-2 -top-2 text-4xl">🎉</span>
      </animated.div>

      {/* Title */}
      <animated.h1
        style={titleSpring}
        className="mb-2 text-3xl font-bold text-foreground"
      >
        You're All Set!
      </animated.h1>

      {/* Subtitle */}
      <animated.p
        style={subtitleSpring}
        className="mb-8 max-w-sm text-lg text-muted-foreground"
      >
        We've saved your style preferences. Now let's build your perfect wardrobe.
      </animated.p>

      {/* Summary */}
      <animated.div
        style={contentSpring}
        className="mb-8 w-full max-w-md rounded-2xl border border-brand-lavender/30 bg-card/50 p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Your Style Profile
        </h3>

        <div className="space-y-3 text-left">
          <SummaryItem
            label="Style Vibes"
            values={preferences.vibes}
            emoji="✨"
          />
          <SummaryItem
            label="Go-to Colors"
            values={preferences.colors}
            emoji="🎨"
          />
          <SummaryItem
            label="Occasions"
            values={preferences.occasions}
            emoji="📅"
          />
          <SummaryItem
            label="Goals"
            values={preferences.goals}
            emoji="🎯"
          />
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            {totalSelections} preferences saved
          </p>
        </div>
      </animated.div>

      {/* CTA */}
      <animated.div style={buttonSpring}>
        <Button
          onClick={onContinue}
          className="btn-glow h-14 gap-2 bg-gradient-to-r from-brand-teal to-brand-lime px-8 text-lg font-semibold text-brand-charcoal"
        >
          Let's Go!
          <ArrowRight className="h-5 w-5" />
        </Button>

        <p className="mt-4 text-sm text-muted-foreground">
          You can update these anytime in settings
        </p>
      </animated.div>
    </div>
  )
}

function SummaryItem({
  label,
  values,
  emoji,
}: {
  label: string
  values: string[]
  emoji: string
}) {
  if (!values || values.length === 0) {
    return null
  }

  const displayValues = values.slice(0, 3)
  const remaining = values.length - 3

  return (
    <div className="flex items-start gap-3">
      <span className="text-lg">{emoji}</span>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">
          {displayValues.map((v) => v.charAt(0).toUpperCase() + v.slice(1).replace("-", " ")).join(", ")}
          {remaining > 0 && ` +${remaining} more`}
        </p>
      </div>
    </div>
  )
}
