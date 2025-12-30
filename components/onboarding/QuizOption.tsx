"use client"

import { useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { cn } from "@/lib/utils"
import type { QuizOptionData } from "./StyleQuiz"

interface QuizOptionProps {
  option: QuizOptionData
  isSelected: boolean
  onSelect: () => void
  delay?: number
}

export function QuizOption({
  option,
  isSelected,
  onSelect,
  delay = 0,
}: QuizOptionProps) {
  const [isPressed, setIsPressed] = useState(false)

  // Entry animation
  const entrySpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    delay,
    config: config.gentle,
  })

  // Selection animation
  const selectionSpring = useSpring({
    scale: isPressed ? 0.95 : isSelected ? 1.02 : 1,
    config: config.wobbly,
  })

  // Glow animation for selected state
  const glowSpring = useSpring({
    opacity: isSelected ? 1 : 0,
    scale: isSelected ? 1 : 0.9,
    config: config.gentle,
  })

  return (
    <animated.button
      type="button"
      onClick={onSelect}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={{
        opacity: entrySpring.opacity,
        y: entrySpring.y,
        transform: selectionSpring.scale.to((s) => `scale(${s})`),
      }}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-colors",
        "min-h-[100px] touch-target",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      {/* Selection glow */}
      <animated.div
        style={{
          opacity: glowSpring.opacity,
          transform: glowSpring.scale.to((s) => `scale(${s})`),
        }}
        className="absolute inset-0 rounded-2xl bg-primary/20 blur-sm"
      />

      {/* Checkmark for selected */}
      {isSelected && (
        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
          ✓
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        {option.emoji && (
          <span
            className={cn(
              "text-2xl transition-transform",
              isSelected && "scale-110"
            )}
          >
            {option.emoji}
          </span>
        )}
        <span
          className={cn(
            "text-sm font-medium",
            isSelected ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {option.label}
        </span>
        {option.description && (
          <span className="text-xs text-muted-foreground/70">
            {option.description}
          </span>
        )}
      </div>
    </animated.button>
  )
}
