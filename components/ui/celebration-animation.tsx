"use client"

import { useEffect, useState } from "react"
import { useSprings, animated, config } from "@react-spring/web"

interface CelebrationAnimationProps {
  trigger: boolean
  onComplete?: () => void
  particleCount?: number
  colors?: string[]
  size?: "sm" | "md" | "lg"
}

const defaultColors = [
  "#C4515E", // primary cherry red
  "#B34452", // primary hover
  "#E8D5C8", // blush
  "#F5F3EE", // cream
  "#FAFAF9", // background
]

const sizeMap = {
  sm: { distance: 60, particleSize: 8 },
  md: { distance: 100, particleSize: 12 },
  lg: { distance: 140, particleSize: 16 },
}

export function CelebrationAnimation({
  trigger,
  onComplete,
  particleCount = 12,
  colors = defaultColors,
  size = "md",
}: CelebrationAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const { distance, particleSize } = sizeMap[size]

  // Create spring configurations for each particle
  const [springs, api] = useSprings(particleCount, (index) => {
    const angle = (index / particleCount) * Math.PI * 2
    const randomDistance = distance * (0.7 + Math.random() * 0.6)
    const x = Math.cos(angle) * randomDistance
    const y = Math.sin(angle) * randomDistance
    const rotation = 360 + Math.random() * 360

    return {
      from: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 },
      to: { x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 },
      config: config.gentle,
    }
  }, [particleCount, distance])

  useEffect(() => {
    if (trigger && !isAnimating) {
      setIsAnimating(true)

      api.start((index) => {
        const angle = (index / particleCount) * Math.PI * 2
        const randomDistance = distance * (0.7 + Math.random() * 0.6)
        const x = Math.cos(angle) * randomDistance
        const y = Math.sin(angle) * randomDistance
        const rotation = 360 + Math.random() * 360

        return {
          from: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 },
          to: { x, y, opacity: 0, scale: 0.2, rotate: rotation },
          delay: index * 20,
          config: { tension: 120, friction: 14 },
          onRest: index === particleCount - 1 ? () => {
            setIsAnimating(false)
            onComplete?.()
          } : undefined,
        }
      })
    }
  }, [trigger, api, distance, particleCount, isAnimating, onComplete])

  // Reset when trigger becomes false
  useEffect(() => {
    if (!trigger && !isAnimating) {
      api.start(() => ({
        to: { x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 },
        immediate: true,
      }))
    }
  }, [trigger, api, isAnimating])

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  if (prefersReducedMotion) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {springs.map((style, index) => (
        <animated.div
          key={index}
          style={{
            position: "absolute",
            width: particleSize,
            height: particleSize,
            backgroundColor: colors[index % colors.length],
            borderRadius: index % 3 === 0 ? "50%" : index % 3 === 1 ? "2px" : "0",
            transform: style.rotate.to((r) => `rotate(${r}deg)`),
            x: style.x,
            y: style.y,
            opacity: style.opacity,
            scale: style.scale,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Sparkle burst animation - smaller, more frequent sparkles
 */
export function SparkleBurst({
  trigger,
  onComplete,
}: {
  trigger: boolean
  onComplete?: () => void
}) {
  return (
    <CelebrationAnimation
      trigger={trigger}
      onComplete={onComplete}
      particleCount={8}
      size="sm"
      colors={["#C4515E", "#B34452", "#E8D5C8"]}
    />
  )
}

/**
 * Success checkmark with celebration
 */
export function SuccessCelebration({
  trigger,
  onComplete,
}: {
  trigger: boolean
  onComplete?: () => void
}) {
  const [showCheck, setShowCheck] = useState(false)

  useEffect(() => {
    if (trigger) {
      const timer = setTimeout(() => setShowCheck(true), 100)
      return () => clearTimeout(timer)
    } else {
      setShowCheck(false)
    }
  }, [trigger])

  return (
    <div className="relative flex items-center justify-center">
      <CelebrationAnimation
        trigger={trigger}
        onComplete={onComplete}
        particleCount={10}
        size="md"
      />
      <animated.div
        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white"
        style={{
          transform: showCheck ? "scale(1)" : "scale(0)",
          opacity: showCheck ? 1 : 0,
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
            style={{
              strokeDasharray: 24,
              strokeDashoffset: showCheck ? 0 : 24,
              transition: "stroke-dashoffset 0.4s ease-out 0.2s",
            }}
          />
        </svg>
      </animated.div>
    </div>
  )
}
