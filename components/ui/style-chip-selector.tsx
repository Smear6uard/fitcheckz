"use client"

import { useState } from "react"
import { animated, useSpring, useSprings, config } from "@react-spring/web"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface StyleChip {
  value: string
  label: string
  icon?: LucideIcon
  emoji?: string
  color?: string
  gradient?: string // Tailwind gradient classes e.g. "from-rose-900/40 via-pink-900/30 to-rose-900/40"
}

interface StyleChipSelectorProps {
  chips: StyleChip[]
  value: string
  onChange: (value: string) => void
  label?: string
  disabled?: boolean
  className?: string
  columns?: 2 | 3 | 4
}

export function StyleChipSelector({
  chips,
  value,
  onChange,
  label,
  disabled = false,
  className,
  columns = 3,
}: StyleChipSelectorProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Create springs for each chip
  const springs = useSprings(
    chips.length,
    chips.map((chip, index) => ({
      scale: hoveredIndex === index ? 1.05 : value === chip.value ? 1.02 : 1,
      y: hoveredIndex === index ? -2 : 0,
      config: config.wobbly,
    }))
  )

  const columnClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns]

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className={cn("grid gap-2", columnClass)}>
        {chips.map((chip, index) => {
          const isSelected = value === chip.value
          const Icon = chip.icon

          return (
            <animated.button
              key={chip.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(chip.value)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: springs[index].scale.to((s) => `scale(${s})`),
                y: springs[index].y,
              }}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-3 transition-colors",
                "touch-target min-h-[72px]",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border bg-card hover:border-primary/50 hover:bg-accent/50",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ✓
                </div>
              )}

              {/* Icon or Emoji */}
              {(Icon || chip.emoji) && (
                <span
                  className={cn(
                    "text-xl transition-transform",
                    isSelected && "scale-110"
                  )}
                  style={{ color: chip.color }}
                >
                  {chip.emoji || (Icon && <Icon className="h-5 w-5" />)}
                </span>
              )}

              {/* Label */}
              <span
                className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {chip.label}
              </span>
            </animated.button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Compact inline chip selector for smaller spaces
 */
interface InlineChipSelectorProps {
  chips: StyleChip[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function InlineChipSelector({
  chips,
  value,
  onChange,
  disabled = false,
  className,
}: InlineChipSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => {
        const isSelected = value === chip.value

        return (
          <button
            key={chip.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(chip.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
              "touch-target",
              isSelected
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-accent text-muted-foreground hover:bg-primary/20",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {chip.emoji && <span>{chip.emoji}</span>}
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Animated selection indicator that moves between options
 */
interface SliderChipSelectorProps {
  chips: StyleChip[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function SliderChipSelector({
  chips,
  value,
  onChange,
  disabled = false,
  className,
}: SliderChipSelectorProps) {
  const selectedIndex = chips.findIndex((chip) => chip.value === value)

  const indicatorSpring = useSpring({
    left: `${(selectedIndex / chips.length) * 100}%`,
    width: `${100 / chips.length}%`,
    config: config.stiff,
  })

  return (
    <div
      className={cn(
        "relative flex rounded-xl bg-accent p-1",
        disabled && "opacity-50",
        className
      )}
    >
      {/* Sliding indicator */}
      <animated.div
        style={indicatorSpring}
        className="absolute inset-y-1 rounded-lg bg-primary shadow-md"
      />

      {/* Options */}
      {chips.map((chip) => {
        const isSelected = value === chip.value

        return (
          <button
            key={chip.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(chip.value)}
            className={cn(
              "relative z-10 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              "touch-target",
              isSelected ? "text-primary-foreground" : "text-muted-foreground",
              !disabled && "hover:text-foreground"
            )}
          >
            <span className="flex items-center justify-center gap-1.5">
              {chip.emoji && <span>{chip.emoji}</span>}
              {chip.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
