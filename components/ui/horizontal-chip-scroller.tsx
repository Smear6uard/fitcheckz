"use client"

import { useRef, useState, useEffect } from "react"
import { animated, useSpring, useSprings, config } from "@react-spring/web"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type { StyleChip } from "./style-chip-selector"

interface HorizontalChipScrollerProps {
  chips: StyleChip[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function HorizontalChipScroller({
  chips,
  value,
  onChange,
  disabled = false,
  className,
}: HorizontalChipScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)

  // Check scroll position for fade indicators
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const checkScroll = () => {
      setCanScrollLeft(el.scrollLeft > 10)
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
    }

    checkScroll()
    el.addEventListener("scroll", checkScroll)
    window.addEventListener("resize", checkScroll)

    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [])

  // Springs for each chip
  const springs = useSprings(
    chips.length,
    chips.map((chip) => ({
      scale: value === chip.value ? 1.02 : 1,
      config: config.gentle,
    }))
  )

  // Scroll selected chip into view
  useEffect(() => {
    if (!value || !scrollRef.current) return

    const selectedIndex = chips.findIndex((c) => c.value === value)
    if (selectedIndex === -1) return

    const container = scrollRef.current
    const selectedEl = container.children[selectedIndex] as HTMLElement
    if (!selectedEl) return

    const containerRect = container.getBoundingClientRect()
    const selectedRect = selectedEl.getBoundingClientRect()

    // Check if selected is out of view
    if (selectedRect.left < containerRect.left || selectedRect.right > containerRect.right) {
      selectedEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  }, [value, chips])

  return (
    <div className={cn("relative", className)}>
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory"
      >
        {chips.map((chip, index) => {
          const isSelected = value === chip.value

          return (
            <animated.button
              key={chip.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(chip.value)}
              style={{
                transform: springs[index].scale.to((s) => `scale(${s})`),
              }}
              className={cn(
                "shrink-0 snap-start",
                "inline-flex items-center justify-center px-5 py-2.5",
                "rounded-full",
                "border transition-all duration-200",
                "touch-target",
                "active:scale-95",
                // Use gradient as background if available
                chip.gradient && `bg-gradient-to-r ${chip.gradient}`,
                isSelected
                  ? "border-primary shadow-[0_0_16px_rgba(34,211,238,0.3)] ring-1 ring-primary/50"
                  : cn(
                      "border-border/30 hover:border-primary/40",
                      !chip.gradient && "bg-background/50 backdrop-blur-sm hover:bg-primary/5"
                    ),
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {/* Label only - no emoji or dot */}
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap transition-colors",
                  isSelected ? "text-foreground" : "text-foreground/80"
                )}
              >
                {chip.label}
              </span>

              {/* Check indicator */}
              {isSelected && (
                <Check className="h-3.5 w-3.5 text-primary ml-1.5" />
              )}
            </animated.button>
          )
        })}
      </div>

      {/* Left fade gradient */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-2 w-8",
          "bg-gradient-to-r from-background to-transparent",
          "pointer-events-none transition-opacity duration-200",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Right fade gradient */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-2 w-12",
          "bg-gradient-to-l from-background to-transparent",
          "pointer-events-none transition-opacity duration-200",
          canScrollRight ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
}
