"use client"

import { animated, useSprings, config } from "@react-spring/web"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Selection {
  key: string
  label: string
  emoji?: string
  gradient?: string
  value: string
}

interface SelectionSummaryProps {
  selections: Selection[]
  onRemove: (key: string) => void
  className?: string
}

export function SelectionSummary({ selections, onRemove, className }: SelectionSummaryProps) {
  // Animate each selection badge
  const springs = useSprings(
    selections.length,
    selections.map((_, i) => ({
      from: { opacity: 0, x: -10, scale: 0.9 },
      to: { opacity: 1, x: 0, scale: 1 },
      delay: i * 50,
      config: config.gentle,
    }))
  )

  if (selections.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        className
      )}
    >
      {springs.map((style, index) => {
        const selection = selections[index]
        return (
          <animated.span
            key={selection.key}
            style={{
              opacity: style.opacity,
              transform: style.x.to((x) => `translateX(${x}px) scale(${style.scale.get()})`),
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm"
          >
            {selection.gradient ? (
              <span className={cn("w-2.5 h-2.5 rounded-full bg-gradient-to-r", selection.gradient)} />
            ) : selection.emoji ? (
              <span>{selection.emoji}</span>
            ) : null}
            <span className="capitalize text-foreground/90">{selection.label}</span>
            <button
              type="button"
              onClick={() => onRemove(selection.key)}
              className="ml-0.5 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
              aria-label={`Remove ${selection.label}`}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </animated.span>
        )
      })}
    </div>
  )
}
