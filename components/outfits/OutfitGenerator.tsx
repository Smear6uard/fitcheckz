"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StyleChipSelector, type StyleChip } from "@/components/ui/style-chip-selector"
import { toast } from "@/lib/utils/toast-personality"
import { Sparkles, Shuffle, Coffee, Briefcase, Heart, PartyPopper, Dumbbell, Plane, Sun, Snowflake, Leaf, Cloud, Zap, Shield, TrendingUp, Crown, Armchair, Clock } from "lucide-react"
import { GenerationProgress } from "./GenerationProgress"
import { StyleConfidenceMeter } from "./StyleConfidenceMeter"
import { fetchWithRetry, handleApiError, parseApiError } from "@/lib/utils/api-error-handler"
import { animated, useSpring, config } from "@react-spring/web"
import { CelebrationAnimation } from "@/components/ui/celebration-animation"

// Chip definitions with emojis and icons
const OCCASION_CHIPS: StyleChip[] = [
  { value: "casual", label: "Casual", emoji: "☕", color: "#F8F5F0" },
  { value: "work", label: "Work", emoji: "💼", color: "#E0D5FF" },
  { value: "date", label: "Date", emoji: "💕", color: "#FFD6E7" },
  { value: "formal", label: "Formal", emoji: "✨", color: "#20C8A8" },
  { value: "gym", label: "Gym", emoji: "💪", color: "#CCFF00" },
  { value: "travel", label: "Travel", emoji: "✈️", color: "#20C8A8" },
]

const SEASON_CHIPS: StyleChip[] = [
  { value: "spring", label: "Spring", emoji: "🌸" },
  { value: "summer", label: "Summer", emoji: "☀️" },
  { value: "fall", label: "Fall", emoji: "🍂" },
  { value: "winter", label: "Winter", emoji: "❄️" },
  { value: "all-season", label: "Any", emoji: "🌈" },
]

const MOOD_CHIPS: StyleChip[] = [
  { value: "bold", label: "Bold", emoji: "🔥" },
  { value: "safe", label: "Safe", emoji: "🛡️" },
  { value: "trendy", label: "Trendy", emoji: "📈" },
  { value: "classic", label: "Classic", emoji: "👑" },
  { value: "comfortable", label: "Comfy", emoji: "🛋️" },
]

const TIME_CHIPS: StyleChip[] = [
  { value: "morning", label: "Morning", emoji: "🌅" },
  { value: "afternoon", label: "Afternoon", emoji: "☀️" },
  { value: "evening", label: "Evening", emoji: "🌙" },
]

export function OutfitGenerator({ onGenerate }: { onGenerate: (outfits: any[]) => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [progressStage, setProgressStage] = useState(0)
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [wardrobeSize, setWardrobeSize] = useState(0)
  const [params, setParams] = useState({
    occasion: "",
    season: "",
    mood: "",
    timeOfDay: "",
  })

  // Fetch wardrobe size for confidence meter
  useEffect(() => {
    async function fetchWardrobeSize() {
      try {
        const res = await fetch("/api/wardrobe/stats")
        if (res.ok) {
          const data = await res.json()
          setWardrobeSize(data.totalItems || 0)
        }
      } catch (e) {
        // Silently fail - meter will show 0
      }
    }
    fetchWardrobeSize()
  }, [])

  // Progress stage advancement while loading
  useEffect(() => {
    if (!loading) {
      setProgressStage(0)
      return
    }

    // Stage 0: Analyzing wardrobe (0s)
    // Stage 1: Finding combinations (3s)
    // Stage 2: Finalizing outfits (6s)
    // Stage 3: Almost ready (9s)
    const timers = [
      setTimeout(() => setProgressStage(1), 3000),
      setTimeout(() => setProgressStage(2), 6000),
      setTimeout(() => setProgressStage(3), 9000),
    ]

    return () => timers.forEach(clearTimeout)
  }, [loading])

  // Surprise Me randomizer
  const handleSurpriseMe = useCallback(async () => {
    setIsRandomizing(true)

    // Get random values
    const randomOccasion = OCCASION_CHIPS[Math.floor(Math.random() * OCCASION_CHIPS.length)].value
    const randomSeason = SEASON_CHIPS[Math.floor(Math.random() * SEASON_CHIPS.length)].value
    const randomMood = MOOD_CHIPS[Math.floor(Math.random() * MOOD_CHIPS.length)].value
    const randomTime = TIME_CHIPS[Math.floor(Math.random() * TIME_CHIPS.length)].value

    // Animate selections with staggered timing
    await new Promise((resolve) => setTimeout(resolve, 100))
    setParams((prev) => ({ ...prev, occasion: randomOccasion }))

    await new Promise((resolve) => setTimeout(resolve, 150))
    setParams((prev) => ({ ...prev, season: randomSeason }))

    await new Promise((resolve) => setTimeout(resolve, 150))
    setParams((prev) => ({ ...prev, mood: randomMood }))

    await new Promise((resolve) => setTimeout(resolve, 150))
    setParams((prev) => ({ ...prev, timeOfDay: randomTime }))

    setIsRandomizing(false)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 1000)
  }, [])

  // Button spring animation
  const buttonSpring = useSpring({
    scale: loading ? 0.98 : 1,
    config: config.wobbly,
  })

  // Surprise button spring
  const surpriseSpring = useSpring({
    rotate: isRandomizing ? 360 : 0,
    config: { tension: 100, friction: 10 },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setProgressStage(0)

    try {
      const res = await fetchWithRetry(
        "/api/outfits/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        },
        {
          maxRetries: 2,
          onRetry: (attempt) => {
            toast.info(`Retrying... (attempt ${attempt}/2)`)
          },
        }
      )

      if (!res.ok) {
        throw await parseApiError(res)
      }

      const data = await res.json()

      // Redirect to swipe page with outfits
      const outfitsParam = encodeURIComponent(JSON.stringify(data.outfits))
      router.push(`/outfits/swipe?outfits=${outfitsParam}`)

      toast.success("Your outfits are ready!")
    } catch (error: unknown) {
      handleApiError(error, "Outfit Generation")
    } finally {
      setLoading(false)
    }
  }

  // Check if form is complete
  const isFormComplete = params.occasion && params.season && params.mood && params.timeOfDay

  if (loading) {
    return <GenerationProgress stage={progressStage} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Celebration animation overlay */}
      <div className="relative">
        <CelebrationAnimation trigger={showCelebration} size="sm" />
      </div>

      {/* Occasion */}
      <StyleChipSelector
        label="What's the occasion?"
        chips={OCCASION_CHIPS}
        value={params.occasion}
        onChange={(value) => setParams({ ...params, occasion: value })}
        disabled={loading || isRandomizing}
        columns={3}
      />

      {/* Season */}
      <StyleChipSelector
        label="What season?"
        chips={SEASON_CHIPS}
        value={params.season}
        onChange={(value) => setParams({ ...params, season: value })}
        disabled={loading || isRandomizing}
        columns={3}
      />

      {/* Mood */}
      <StyleChipSelector
        label="What's the vibe?"
        chips={MOOD_CHIPS}
        value={params.mood}
        onChange={(value) => setParams({ ...params, mood: value })}
        disabled={loading || isRandomizing}
        columns={3}
      />

      {/* Time of Day */}
      <StyleChipSelector
        label="What time of day?"
        chips={TIME_CHIPS}
        value={params.timeOfDay}
        onChange={(value) => setParams({ ...params, timeOfDay: value })}
        disabled={loading || isRandomizing}
        columns={3}
      />

      {/* Style Confidence Meter */}
      <StyleConfidenceMeter
        occasion={params.occasion}
        season={params.season}
        style={params.mood}
        formality={params.timeOfDay}
        wardrobeSize={wardrobeSize}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {/* Surprise Me Button */}
        <animated.button
          type="button"
          onClick={handleSurpriseMe}
          disabled={loading || isRandomizing}
          style={{
            transform: surpriseSpring.rotate.to((r) => `rotate(${r}deg)`),
          }}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-lavender bg-brand-lavender/10 px-4 py-3 font-medium text-brand-charcoal transition-all hover:border-brand-lime hover:bg-brand-lime/10 disabled:opacity-50"
        >
          <Shuffle className="h-5 w-5" />
          <span className="hidden sm:inline">Surprise Me!</span>
        </animated.button>

        {/* Generate Button */}
        <animated.div style={buttonSpring} className="flex-1">
          <Button
            type="submit"
            disabled={loading || !isFormComplete}
            className="btn-glow h-12 w-full bg-gradient-to-r from-brand-teal to-brand-teal text-lg font-semibold shadow-lg transition-all hover:from-brand-teal hover:to-brand-lime disabled:opacity-50"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Outfits
          </Button>
        </animated.div>
      </div>

      {/* Helper text */}
      {!isFormComplete && (
        <p className="text-center text-sm text-muted-foreground">
          Select all options to generate your perfect outfit
        </p>
      )}
    </form>
  )
}

