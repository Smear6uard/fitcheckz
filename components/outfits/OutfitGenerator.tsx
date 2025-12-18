"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HorizontalChipScroller } from "@/components/ui/horizontal-chip-scroller"
import { SelectionSummary } from "./SelectionSummary"
import type { StyleChip } from "@/components/ui/style-chip-selector"
import { toast } from "@/lib/utils/toast-personality"
import { Shuffle } from "lucide-react"
import { GenerationProgress } from "./GenerationProgress"
import { fetchWithRetry, handleApiError, parseApiError } from "@/lib/utils/api-error-handler"
import { animated, useSpring, useTransition, config } from "@react-spring/web"
import { CelebrationAnimation } from "@/components/ui/celebration-animation"
import { UpgradePrompt } from "@/components/subscription/UpgradePrompt"
import { cn } from "@/lib/utils"

// Chip definitions with gradients for all categories
const OCCASION_CHIPS: StyleChip[] = [
  { value: "casual", label: "Casual", gradient: "from-slate-700/50 via-gray-800/40 to-slate-700/50" },
  { value: "work", label: "Work", gradient: "from-blue-900/50 via-slate-900/40 to-blue-900/50" },
  { value: "date", label: "Date", gradient: "from-rose-900/50 via-pink-900/40 to-rose-900/50" },
  { value: "formal", label: "Formal", gradient: "from-purple-900/50 via-indigo-900/40 to-purple-900/50" },
  { value: "gym", label: "Gym", gradient: "from-orange-900/40 via-red-900/30 to-orange-900/40" },
  { value: "travel", label: "Travel", gradient: "from-cyan-900/50 via-blue-900/40 to-cyan-900/50" },
]

const SEASON_CHIPS: StyleChip[] = [
  { value: "spring", label: "Spring", gradient: "from-pink-800/50 to-rose-900/50" },
  { value: "summer", label: "Summer", gradient: "from-yellow-800/40 to-amber-900/40" },
  { value: "fall", label: "Fall", gradient: "from-orange-800/40 to-amber-900/40" },
  { value: "winter", label: "Winter", gradient: "from-blue-900/50 to-cyan-900/50" },
  { value: "all-season", label: "Any", gradient: "from-slate-700/50 to-gray-800/50" },
]

const MOOD_CHIPS: StyleChip[] = [
  { value: "bold", label: "Bold", gradient: "from-red-900/40 via-orange-900/30 to-red-900/40" },
  { value: "safe", label: "Safe", gradient: "from-emerald-900/50 via-green-900/40 to-emerald-900/50" },
  { value: "trendy", label: "Trendy", gradient: "from-violet-900/50 via-purple-900/40 to-violet-900/50" },
  { value: "classic", label: "Classic", gradient: "from-amber-900/40 via-yellow-900/30 to-amber-900/40" },
  { value: "comfortable", label: "Comfy", gradient: "from-teal-900/50 via-cyan-900/40 to-teal-900/50" },
]

const TIME_CHIPS: StyleChip[] = [
  { value: "morning", label: "Morning", gradient: "from-amber-800/40 via-orange-900/30 to-amber-800/40" },
  { value: "afternoon", label: "Afternoon", gradient: "from-yellow-700/40 via-amber-800/30 to-yellow-700/40" },
  { value: "evening", label: "Evening", gradient: "from-indigo-900/50 via-purple-900/40 to-indigo-900/50" },
]

// Helper to get chip properties
function getChipInfo(chips: StyleChip[], value: string) {
  const chip = chips.find((c) => c.value === value)
  return {
    emoji: chip?.emoji || "",
    gradient: chip?.gradient || "",
    label: chip?.label || value,
  }
}

export function OutfitGenerator({ onGenerate }: { onGenerate: (outfits: any[]) => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [usageInfo, setUsageInfo] = useState<{ current: number; limit: number } | null>(null)
  const [params, setParams] = useState({
    occasion: "",
    season: "",
    mood: "",
    timeOfDay: "",
  })

  // Progressive disclosure step
  const [currentStep, setCurrentStep] = useState(0)

  // Auto-advance steps when selections are made
  useEffect(() => {
    if (params.occasion && currentStep === 0) {
      setTimeout(() => setCurrentStep(1), 300)
    }
    if (params.season && params.timeOfDay && currentStep === 1) {
      setTimeout(() => setCurrentStep(2), 300)
    }
    if (params.mood && currentStep === 2) {
      setTimeout(() => setCurrentStep(3), 300)
    }
  }, [params.occasion, params.season, params.timeOfDay, params.mood, currentStep])

  // Fetch usage limits
  useEffect(() => {
    async function fetchData() {
      try {
        const usageRes = await fetch("/api/usage/check?type=outfit")
        if (usageRes.ok) {
          const usage = await usageRes.json()
          if (!usage.allowed && usage.remaining === 0) {
            setUsageInfo({ current: usage.current, limit: usage.limit })
          }
        }
      } catch {
        // Silently fail
      }
    }
    fetchData()
  }, [])


  // Surprise Me randomizer
  const handleSurpriseMe = useCallback(async () => {
    setIsRandomizing(true)

    const randomOccasion = OCCASION_CHIPS[Math.floor(Math.random() * OCCASION_CHIPS.length)].value
    const randomSeason = SEASON_CHIPS[Math.floor(Math.random() * SEASON_CHIPS.length)].value
    const randomMood = MOOD_CHIPS[Math.floor(Math.random() * MOOD_CHIPS.length)].value
    const randomTime = TIME_CHIPS[Math.floor(Math.random() * TIME_CHIPS.length)].value

    // Animate selections with staggered timing
    await new Promise((resolve) => setTimeout(resolve, 100))
    setParams((prev) => ({ ...prev, occasion: randomOccasion }))
    setCurrentStep(1)

    await new Promise((resolve) => setTimeout(resolve, 200))
    setParams((prev) => ({ ...prev, season: randomSeason, timeOfDay: randomTime }))
    setCurrentStep(2)

    await new Promise((resolve) => setTimeout(resolve, 200))
    setParams((prev) => ({ ...prev, mood: randomMood }))
    setCurrentStep(3)

    setIsRandomizing(false)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 1000)
  }, [])

  // Clear a selection
  const handleClearSelection = (key: string) => {
    setParams((prev) => ({ ...prev, [key]: "" }))
    // Reset step if needed
    if (key === "occasion") setCurrentStep(0)
    else if (key === "season" || key === "timeOfDay") {
      if (!params.season || !params.timeOfDay) setCurrentStep(1)
    }
    else if (key === "mood") setCurrentStep(2)
  }

  // Build selections array for summary
  const selections = [
    params.occasion && { key: "occasion", value: params.occasion, ...getChipInfo(OCCASION_CHIPS, params.occasion) },
    params.timeOfDay && { key: "timeOfDay", value: params.timeOfDay, ...getChipInfo(TIME_CHIPS, params.timeOfDay) },
    params.season && { key: "season", value: params.season, ...getChipInfo(SEASON_CHIPS, params.season) },
    params.mood && { key: "mood", value: params.mood, ...getChipInfo(MOOD_CHIPS, params.mood) },
  ].filter(Boolean) as { key: string; value: string; label: string; emoji?: string; gradient?: string }[]

  // Section reveal transitions
  const step1Transition = useTransition(currentStep >= 1, {
    from: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    config: config.gentle,
  })

  const step2Transition = useTransition(currentStep >= 2, {
    from: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    config: config.gentle,
  })

  // Floating generate button spring
  const buttonSpring = useSpring({
    opacity: currentStep >= 3 ? 1 : 0,
    y: currentStep >= 3 ? 0 : 20,
    config: config.gentle,
  })

  // Surprise button spring
  const surpriseSpring = useSpring({
    rotate: isRandomizing ? 360 : 0,
    config: { tension: 100, friction: 10 },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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
        const error = await parseApiError(res)
        if (res.status === 403 && error.message?.includes("limit")) {
          const usageRes = await fetch("/api/usage/check?type=outfit")
          if (usageRes.ok) {
            const usage = await usageRes.json()
            setUsageInfo({ current: usage.current, limit: usage.limit })
            setShowUpgradePrompt(true)
          } else {
            handleApiError(error, "Outfit Generation")
          }
        } else if (res.status === 400 && error.message?.includes("at least 2 items")) {
          toast.error("Wardrobe too small", {
            description: "Please add at least 2 items to your wardrobe before generating outfits.",
          })
        } else {
          handleApiError(error, "Outfit Generation")
        }
        return
      }

      const data = await res.json()
      const outfitIds = data.outfits.map((o: { id: string }) => o.id).join(",")
      router.push(`/outfits/swipe?ids=${outfitIds}`)
      toast.success("Your outfits are ready!")
    } catch (error: unknown) {
      handleApiError(error, "Outfit Generation")
    } finally {
      setLoading(false)
    }
  }

  const isFormComplete = params.occasion && params.season && params.mood && params.timeOfDay

  if (loading) {
    return <GenerationProgress />
  }

  return (
    <>
      <UpgradePrompt
        open={showUpgradePrompt}
        onOpenChange={setShowUpgradePrompt}
        type="outfit"
        current={usageInfo?.current}
        limit={usageInfo?.limit}
      />

      <form onSubmit={handleSubmit} className="space-y-8 pb-24">
        {/* Celebration animation overlay */}
        <div className="relative">
          <CelebrationAnimation trigger={showCelebration} size="sm" />
        </div>

        {/* Selection Summary - shows what's been picked */}
        {selections.length > 0 && (
          <SelectionSummary
            selections={selections}
            onRemove={handleClearSelection}
            className="pb-2"
          />
        )}

        {/* Step 1: Occasion - Always visible */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Let&apos;s Get You Dressed
            </h2>
            {/* Surprise Me button */}
            <animated.button
              type="button"
              onClick={handleSurpriseMe}
              disabled={loading || isRandomizing}
              style={{
                transform: surpriseSpring.rotate.to((r) => `rotate(${r}deg)`),
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              <Shuffle className="h-4 w-4" />
              <span>Surprise Me</span>
            </animated.button>
          </div>
          <HorizontalChipScroller
            chips={OCCASION_CHIPS}
            value={params.occasion}
            onChange={(value) => setParams({ ...params, occasion: value })}
            disabled={loading || isRandomizing}
          />
        </section>

        {/* Step 2: When - Time + Season */}
        {step1Transition((style, show) =>
          show && (
            <animated.section style={style} className="space-y-6">
              {/* Time of Day */}
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  When are you heading out?
                </h2>
                <HorizontalChipScroller
                  chips={TIME_CHIPS}
                  value={params.timeOfDay}
                  onChange={(value) => setParams({ ...params, timeOfDay: value })}
                  disabled={loading || isRandomizing}
                />
              </div>

              {/* Season */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  What season?
                </h3>
                <HorizontalChipScroller
                  chips={SEASON_CHIPS}
                  value={params.season}
                  onChange={(value) => setParams({ ...params, season: value })}
                  disabled={loading || isRandomizing}
                />
              </div>
            </animated.section>
          )
        )}

        {/* Step 3: Mood */}
        {step2Transition((style, show) =>
          show && (
            <animated.section style={style} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                How bold are we going?
              </h2>
              <HorizontalChipScroller
                chips={MOOD_CHIPS}
                value={params.mood}
                onChange={(value) => setParams({ ...params, mood: value })}
                disabled={loading || isRandomizing}
              />
            </animated.section>
          )
        )}

        {/* Floating Generate Button */}
        <animated.div
          style={{
            opacity: buttonSpring.opacity,
            transform: buttonSpring.y.to((y) => `translateY(${y}px)`),
          }}
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
            currentStep < 3 && "pointer-events-none"
          )}
        >
          <Button
            type="submit"
            disabled={loading || !isFormComplete}
            className="h-14 px-8 rounded-full bg-gradient-to-r from-primary via-[#4ADE80] to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200 text-lg font-semibold"
          >
            Create Fits
          </Button>
        </animated.div>

        {/* Helper text when not complete */}
        {currentStep < 3 && (
          <p className="text-center text-sm text-muted-foreground pt-4">
            {currentStep === 0 && "Select an occasion to get started"}
            {currentStep === 1 && "Choose when you're going"}
            {currentStep === 2 && "Pick your style vibe"}
          </p>
        )}
      </form>
    </>
  )
}
