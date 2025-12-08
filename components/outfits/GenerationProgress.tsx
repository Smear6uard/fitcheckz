"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Shirt, Glasses, Crown } from "lucide-react"
import { animated, useSpring, config } from "@react-spring/web"

interface GenerationProgressProps {
  stage: number
  onComplete?: () => void
}

// Stage definitions with progress and multiple witty messages
const STAGES = [
  {
    progress: 10,
    messages: [
      "Consulting the fashion gods...",
      "Scanning your closet vibes...",
      "Channeling main character energy...",
    ],
    icon: Sparkles,
  },
  {
    progress: 40,
    messages: [
      "Finding fire combinations...",
      "Mixing and matching magic...",
      "Creating looks that hit different...",
    ],
    icon: Shirt,
  },
  {
    progress: 70,
    messages: [
      "Adding the finishing touches...",
      "Making sure it's giving what it's supposed to give...",
      "Polishing your next slay...",
    ],
    icon: Glasses,
  },
  {
    progress: 95,
    messages: [
      "Almost ready to serve...",
      "Your fits are loading...",
      "Prepare to be iconic...",
    ],
    icon: Crown,
  },
]

// Subtext messages that cycle
const SUBTEXT_MESSAGES = [
  "Good things take a sec",
  "Trust the process bestie",
  "Worth the wait fr fr",
  "Manifesting your best looks",
  "The algorithm is thinking",
]

export function GenerationProgress({ stage, onComplete }: GenerationProgressProps) {
  const currentStageData = STAGES[Math.min(stage, STAGES.length - 1)]
  const [messageIndex, setMessageIndex] = useState(0)
  const [subtextIndex, setSubtextIndex] = useState(0)

  // Rotate through messages for each stage
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % currentStageData.messages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [currentStageData.messages.length])

  // Rotate subtext
  useEffect(() => {
    const interval = setInterval(() => {
      setSubtextIndex((prev) => (prev + 1) % SUBTEXT_MESSAGES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Spring animation for progress bar
  const progressSpring = useSpring({
    value: currentStageData.progress,
    config: { tension: 50, friction: 20 },
  })

  // Icon animation
  const iconSpring = useSpring({
    from: { scale: 0.8, rotate: -10 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.1, rotate: 10 })
        await next({ scale: 0.9, rotate: -10 })
      }
    },
    config: config.gentle,
    loop: true,
  })

  // Message fade animation
  const messageSpring = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    reset: true,
    config: config.gentle,
  })

  const IconComponent = currentStageData.icon

  return (
    <div className="space-y-6 py-10">
      {/* Animated Icon */}
      <div className="flex justify-center">
        <animated.div
          style={{
            transform: iconSpring.scale.to((s) => `scale(${s})`),
          }}
          className="relative"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-lime/20 via-brand-teal/20 to-brand-lavender/20">
            <IconComponent className="h-10 w-10 text-brand-teal" />
          </div>
          {/* Pulsing ring */}
          <div className="absolute inset-0 animate-ping rounded-full bg-brand-teal/20" style={{ animationDuration: "2s" }} />
        </animated.div>
      </div>

      {/* Animated Message */}
      <animated.div
        style={messageSpring}
        className="text-center"
        key={`${stage}-${messageIndex}`}
      >
        <p className="text-xl font-semibold text-foreground">
          {currentStageData.messages[messageIndex]}
        </p>
      </animated.div>

      {/* Enhanced Progress Bar */}
      <div className="mx-auto max-w-md space-y-2">
        <div className="relative h-3 overflow-hidden rounded-full bg-muted">
          <animated.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-teal via-brand-lime to-brand-teal"
            style={{
              width: progressSpring.value.to((v) => `${v}%`),
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Analyzing</span>
          <span>Matching</span>
          <span>Finalizing</span>
          <span>Ready!</span>
        </div>
      </div>

      {/* Subtext with personality */}
      <p
        className="text-center text-sm text-muted-foreground transition-opacity duration-300"
        key={subtextIndex}
      >
        {SUBTEXT_MESSAGES[subtextIndex]}
      </p>

      {/* Outfit assembly animation hint */}
      <div className="flex justify-center gap-4 pt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-brand-teal"
            style={{
              animation: `pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
