"use client"

import { useEffect, useState, useCallback } from "react"
import { animated, useSpring, useTrail, useSprings, config } from "@react-spring/web"
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CelebrationAnimation } from "@/components/ui/celebration-animation"
import { cn } from "@/lib/utils"
import { getRarityConfig, type Achievement } from "@/lib/gamification/achievements"
import { Sparkles, X, Share2, Trophy } from "lucide-react"

interface AchievementUnlockModalProps {
  achievement: Achievement | null
  open: boolean
  onClose: () => void
}

// Particle burst for dramatic effect
function ParticleBurst({ trigger, rarity }: { trigger: boolean; rarity: Achievement["rarity"] }) {
  const particleCount = rarity === "legendary" ? 40 : rarity === "epic" ? 30 : 20
  const colors = {
    common: ["#9ca3af", "#d1d5db"],
    uncommon: ["#22c55e", "#4ade80", "#86efac"],
    rare: ["#3b82f6", "#60a5fa", "#93c5fd"],
    epic: ["#a855f7", "#c084fc", "#d8b4fe"],
    legendary: ["#f59e0b", "#fbbf24", "#fcd34d", "#fef3c7"],
  }

  const [springs, api] = useSprings(particleCount, (i) => ({
    from: { x: 0, y: 0, opacity: 0, scale: 0 },
    config: { tension: 200, friction: 20 },
  }))

  useEffect(() => {
    if (trigger) {
      api.start((i) => {
        const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5
        const distance = 100 + Math.random() * 150
        return {
          from: { x: 0, y: 0, opacity: 1, scale: 1 },
          to: async (next) => {
            await next({
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance - 50,
              opacity: 0,
              scale: 0.5,
            })
          },
          delay: i * 20,
        }
      })
    }
  }, [trigger, api, particleCount])

  const rarityColors = colors[rarity]

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {springs.map((spring, i) => (
        <animated.div
          key={i}
          style={{
            position: "absolute",
            x: spring.x,
            y: spring.y,
            opacity: spring.opacity,
            scale: spring.scale,
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            backgroundColor: rarityColors[i % rarityColors.length],
            boxShadow: `0 0 10px ${rarityColors[i % rarityColors.length]}`,
          }}
        />
      ))}
    </div>
  )
}

export function AchievementUnlockModal({
  achievement,
  open,
  onClose,
}: AchievementUnlockModalProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    if (open) {
      // Stagger the celebrations
      const timer1 = setTimeout(() => setShowCelebration(true), 300)
      const timer2 = setTimeout(() => setShowParticles(true), 500)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    } else {
      setShowCelebration(false)
      setShowParticles(false)
    }
  }, [open])

  if (!achievement) return null

  const rarityConfig = getRarityConfig(achievement.rarity)

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogPortal>
        {/* Full-screen blurred backdrop */}
        <DialogOverlay className="bg-black/60 backdrop-blur-md" />
        <DialogContent className="sm:max-w-md border-none bg-transparent shadow-none p-0 [&>button]:hidden">
          <AchievementUnlockContent
            achievement={achievement}
            rarityConfig={rarityConfig}
            showCelebration={showCelebration}
            showParticles={showParticles}
            onClose={onClose}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

function AchievementUnlockContent({
  achievement,
  rarityConfig,
  showCelebration,
  showParticles,
  onClose,
}: {
  achievement: Achievement
  rarityConfig: ReturnType<typeof getRarityConfig>
  showCelebration: boolean
  showParticles: boolean
  onClose: () => void
}) {
  // Entry animation for the card - 3D flip effect
  const cardSpring = useSpring({
    from: { scale: 0.3, opacity: 0, rotateY: 180, rotateX: 30 },
    to: { scale: 1, opacity: 1, rotateY: 0, rotateX: 0 },
    delay: 100,
    config: { tension: 200, friction: 20 },
  })

  // Badge reveal animation - dramatic bounce
  const badgeSpring = useSpring({
    from: { scale: 0, opacity: 0, rotate: -180 },
    to: { scale: 1, opacity: 1, rotate: 0 },
    delay: 500,
    config: config.wobbly,
  })

  // Text reveal animation - staggered from bottom
  const textTrail = useTrail(4, {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    delay: 700,
    config: { tension: 300, friction: 20 },
  })

  // Pulsing glow animation
  const glowSpring = useSpring({
    loop: true,
    from: { opacity: 0.4, scale: 1 },
    to: async (next) => {
      while (true) {
        await next({ opacity: 0.8, scale: 1.05 })
        await next({ opacity: 0.4, scale: 1 })
      }
    },
    config: { duration: 2000 },
  })

  // Ring pulse animation for legendary/epic
  const ringSpring = useSpring({
    loop: true,
    from: { scale: 1, opacity: 0.6 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.3, opacity: 0 })
        await next({ scale: 1, opacity: 0.6 })
      }
    },
    config: { duration: 1500 },
  })

  const handleShare = useCallback(async () => {
    const shareText = `I just unlocked "${achievement.name}" on Styleum! ${achievement.emoji}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Achievement Unlocked!",
          text: shareText,
          url: window.location.origin,
        })
      } catch (e) {
        // User cancelled or error
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText)
    }
  }, [achievement])

  const isHighRarity = achievement.rarity === "legendary" || achievement.rarity === "epic"

  return (
    <div className="relative flex flex-col items-center px-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute -top-2 right-2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border shadow-lg hover:bg-background transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Particle burst */}
      <ParticleBurst trigger={showParticles} rarity={achievement.rarity} />

      {/* Original celebration particles */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <CelebrationAnimation
          trigger={showCelebration}
          particleCount={isHighRarity ? 36 : 24}
          size="lg"
        />
      </div>

      {/* Main card */}
      <animated.div
        style={{
          scale: cardSpring.scale,
          opacity: cardSpring.opacity,
          rotateY: cardSpring.rotateY,
          rotateX: cardSpring.rotateX,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        className="relative w-full max-w-sm rounded-3xl bg-card border-2 shadow-2xl overflow-hidden"
      >
        {/* Animated glow background */}
        <animated.div
          style={{ opacity: glowSpring.opacity, scale: glowSpring.scale }}
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            rarityConfig.gradient
          )}
        />

        {/* Content overlay */}
        <div className="relative bg-gradient-to-b from-transparent via-card/80 to-card">
          {/* Header */}
          <div className="relative p-8 text-center">
            {/* Trophy icon with glow */}
            <animated.div style={textTrail[0]} className="mb-4">
              <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
                <Trophy className="h-4 w-4 text-amber-500" />
                Achievement Unlocked
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
            </animated.div>

            {/* Badge with rings */}
            <animated.div
              style={{
                scale: badgeSpring.scale,
                opacity: badgeSpring.opacity,
                rotate: badgeSpring.rotate,
              }}
              className="relative mx-auto mb-6"
            >
              {/* Pulsing rings for high rarity */}
              {isHighRarity && (
                <>
                  <animated.div
                    style={{ scale: ringSpring.scale, opacity: ringSpring.opacity }}
                    className={cn(
                      "absolute inset-0 m-auto h-28 w-28 rounded-full border-2",
                      achievement.rarity === "legendary" ? "border-amber-400" : "border-purple-400"
                    )}
                  />
                  <animated.div
                    style={{
                      scale: ringSpring.scale,
                      opacity: ringSpring.opacity,
                    }}
                    className={cn(
                      "absolute inset-0 m-auto h-32 w-32 rounded-full border",
                      achievement.rarity === "legendary" ? "border-amber-300" : "border-purple-300"
                    )}
                  />
                </>
              )}

              {/* Glow halo */}
              <div
                className={cn(
                  "absolute inset-0 m-auto h-28 w-28 rounded-full blur-2xl opacity-60 bg-gradient-to-br",
                  rarityConfig.gradient
                )}
              />

              {/* Badge circle */}
              <div
                className={cn(
                  "relative flex h-28 w-28 mx-auto items-center justify-center rounded-full",
                  "bg-gradient-to-br shadow-2xl border-4 border-white/20",
                  rarityConfig.gradient,
                  rarityConfig.glow
                )}
              >
                <span className="text-6xl drop-shadow-lg">{achievement.emoji}</span>
              </div>
            </animated.div>

            {/* Title */}
            <animated.h2
              style={textTrail[1]}
              className="text-3xl font-bold mb-2 tracking-tight"
            >
              {achievement.name}
            </animated.h2>

            {/* Rarity badge */}
            <animated.div style={textTrail[1]}>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold",
                  rarityConfig.bgColor,
                  rarityConfig.textColor
                )}
              >
                <Sparkles className="h-4 w-4" />
                {rarityConfig.label}
              </span>
            </animated.div>
          </div>

          {/* Description and actions */}
          <animated.div
            style={textTrail[2]}
            className="px-8 pb-8 text-center"
          >
            <p className="text-muted-foreground mb-6 text-lg">
              {achievement.description}
            </p>

            {/* Action buttons */}
            <animated.div style={textTrail[3]} className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                onClick={onClose}
                className={cn(
                  "flex-[2] bg-gradient-to-r text-white font-semibold",
                  rarityConfig.gradient
                )}
              >
                Continue
              </Button>
            </animated.div>
          </animated.div>
        </div>
      </animated.div>
    </div>
  )
}

/**
 * Hook to manage achievement unlock notifications
 */
export function useAchievementUnlock() {
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const showUnlock = (achievement: Achievement) => {
    setUnlockedAchievement(achievement)
    setIsOpen(true)
  }

  const closeUnlock = () => {
    setIsOpen(false)
    // Clear achievement after animation
    setTimeout(() => setUnlockedAchievement(null), 300)
  }

  return {
    unlockedAchievement,
    isOpen,
    showUnlock,
    closeUnlock,
    Modal: () => (
      <AchievementUnlockModal
        achievement={unlockedAchievement}
        open={isOpen}
        onClose={closeUnlock}
      />
    ),
  }
}
