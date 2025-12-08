"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { animated, useSpring, useTransition, config } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import { QuizProgress } from "./QuizProgress"
import { QuizOption } from "./QuizOption"
import { QuizComplete } from "./QuizComplete"
import { toast } from "@/lib/utils/toast-personality"
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react"

export interface QuizStep {
  id: string
  question: string
  subtext?: string
  type: "single" | "multi"
  maxSelections?: number
  options: QuizOptionData[]
}

export interface QuizOptionData {
  value: string
  label: string
  emoji?: string
  description?: string
}

export interface StylePreferences {
  style_vibes: string[]
  typical_occasions: string[]
  favorite_colors: string[]
  fashion_goals: string[]
}

// Quiz step definitions
const QUIZ_STEPS: QuizStep[] = [
  {
    id: "vibes",
    question: "What's your style vibe?",
    subtext: "Pick all that resonate with you",
    type: "multi",
    maxSelections: 3,
    options: [
      { value: "minimalist", label: "Minimalist", emoji: "🤍", description: "Clean lines, neutral tones" },
      { value: "streetwear", label: "Streetwear", emoji: "🔥", description: "Urban, bold, statement pieces" },
      { value: "y2k", label: "Y2K", emoji: "💿", description: "Early 2000s revival" },
      { value: "cottagecore", label: "Cottagecore", emoji: "🌻", description: "Soft, romantic, nature-inspired" },
      { value: "dark-academia", label: "Dark Academia", emoji: "📚", description: "Scholarly, moody, layered" },
      { value: "athleisure", label: "Athleisure", emoji: "🏃", description: "Sporty meets casual" },
      { value: "preppy", label: "Preppy", emoji: "🎾", description: "Classic, polished, collegiate" },
      { value: "boho", label: "Boho", emoji: "🌈", description: "Free-spirited, artistic" },
      { value: "grunge", label: "Grunge", emoji: "🎸", description: "Edgy, vintage, relaxed" },
    ],
  },
  {
    id: "colors",
    question: "Pick your go-to colors",
    subtext: "What colors make you feel like you?",
    type: "multi",
    maxSelections: 5,
    options: [
      { value: "black", label: "Black", emoji: "🖤" },
      { value: "white", label: "White", emoji: "🤍" },
      { value: "navy", label: "Navy", emoji: "💙" },
      { value: "gray", label: "Gray", emoji: "🩶" },
      { value: "beige", label: "Beige", emoji: "🧸" },
      { value: "brown", label: "Brown", emoji: "🤎" },
      { value: "pink", label: "Pink", emoji: "💗" },
      { value: "red", label: "Red", emoji: "❤️" },
      { value: "green", label: "Green", emoji: "💚" },
      { value: "blue", label: "Blue", emoji: "💙" },
      { value: "purple", label: "Purple", emoji: "💜" },
      { value: "yellow", label: "Yellow", emoji: "💛" },
    ],
  },
  {
    id: "occasions",
    question: "Where do you dress for most?",
    subtext: "Help us understand your lifestyle",
    type: "multi",
    maxSelections: 4,
    options: [
      { value: "casual", label: "Everyday Casual", emoji: "☕", description: "Errands, hanging out" },
      { value: "work", label: "Work/Office", emoji: "💼", description: "Professional settings" },
      { value: "school", label: "School/Campus", emoji: "📖", description: "Class and study sessions" },
      { value: "dates", label: "Date Nights", emoji: "💕", description: "Special occasions" },
      { value: "parties", label: "Going Out", emoji: "🎉", description: "Clubs, parties, events" },
      { value: "fitness", label: "Gym/Active", emoji: "💪", description: "Workouts and sports" },
      { value: "travel", label: "Travel", emoji: "✈️", description: "Comfortable and cute" },
      { value: "wfh", label: "Work from Home", emoji: "🏠", description: "Cozy but presentable" },
    ],
  },
  {
    id: "goals",
    question: "What are your fashion goals?",
    subtext: "What do you want to achieve?",
    type: "multi",
    maxSelections: 3,
    options: [
      { value: "confidence", label: "Feel More Confident", emoji: "✨", description: "Dress to impress yourself" },
      { value: "versatile", label: "Build a Versatile Wardrobe", emoji: "🔄", description: "Mix & match everything" },
      { value: "trendy", label: "Stay On Trend", emoji: "📈", description: "Keep up with what's hot" },
      { value: "sustainable", label: "Shop More Sustainably", emoji: "🌱", description: "Less fast fashion" },
      { value: "budget", label: "Dress Well on Budget", emoji: "💰", description: "Look expensive, spend less" },
      { value: "signature", label: "Find My Signature Style", emoji: "🎯", description: "Develop a unique look" },
      { value: "compliments", label: "Get More Compliments", emoji: "💬", description: "Turn heads, get noticed" },
      { value: "organized", label: "Organize My Closet", emoji: "📦", description: "Know what I have" },
    ],
  },
]

interface StyleQuizProps {
  onComplete?: (preferences: StylePreferences) => void
}

export function StyleQuiz({ onComplete }: StyleQuizProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string[]>>({
    vibes: [],
    colors: [],
    occasions: [],
    goals: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const step = QUIZ_STEPS[currentStep]
  const isLastStep = currentStep === QUIZ_STEPS.length - 1
  const canProceed = selections[step.id]?.length > 0

  // Page transition animation
  const transitions = useTransition(currentStep, {
    from: { opacity: 0, transform: "translateX(50px)" },
    enter: { opacity: 1, transform: "translateX(0px)" },
    leave: { opacity: 0, transform: "translateX(-50px)" },
    config: config.gentle,
  })

  const handleSelect = useCallback(
    (value: string) => {
      setSelections((prev) => {
        const current = prev[step.id] || []
        const isSelected = current.includes(value)

        if (isSelected) {
          return { ...prev, [step.id]: current.filter((v) => v !== value) }
        }

        // Check max selections for multi-select
        if (step.type === "multi" && step.maxSelections) {
          if (current.length >= step.maxSelections) {
            toast.info(`You can only select up to ${step.maxSelections} options`)
            return prev
          }
        }

        return { ...prev, [step.id]: [...current, value] }
      })
    },
    [step]
  )

  const handleNext = useCallback(() => {
    if (isLastStep) {
      handleSubmit()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }, [isLastStep])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const handleSkip = useCallback(() => {
    if (isLastStep) {
      handleSubmit()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }, [isLastStep])

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const preferences: StylePreferences = {
        style_vibes: selections.vibes,
        typical_occasions: selections.occasions,
        favorite_colors: selections.colors,
        fashion_goals: selections.goals,
      }

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      if (!res.ok) {
        throw new Error("Failed to save preferences")
      }

      setIsComplete(true)
      onComplete?.(preferences)
    } catch (error) {
      toast.error("Failed to save your preferences")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinish = () => {
    router.push("/dashboard")
  }

  if (isComplete) {
    return <QuizComplete onContinue={handleFinish} preferences={selections} />
  }

  return (
    <div className="flex min-h-[600px] flex-col">
      {/* Progress */}
      <QuizProgress
        currentStep={currentStep}
        totalSteps={QUIZ_STEPS.length}
        stepLabels={QUIZ_STEPS.map((s) => s.question.split(" ")[0])}
      />

      {/* Question */}
      <div className="flex-1 px-4 py-6">
        {transitions((style, item) => (
          <animated.div style={style} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                {QUIZ_STEPS[item].question}
              </h2>
              {QUIZ_STEPS[item].subtext && (
                <p className="mt-2 text-muted-foreground">
                  {QUIZ_STEPS[item].subtext}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {QUIZ_STEPS[item].options.map((option, index) => (
                <QuizOption
                  key={option.value}
                  option={option}
                  isSelected={selections[QUIZ_STEPS[item].id]?.includes(option.value)}
                  onSelect={() => handleSelect(option.value)}
                  delay={index * 50}
                />
              ))}
            </div>

            {/* Selection count */}
            {step.maxSelections && (
              <p className="text-center text-sm text-muted-foreground">
                {selections[step.id]?.length || 0} / {step.maxSelections} selected
              </p>
            )}
          </animated.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border px-4 py-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-muted-foreground"
        >
          Skip
          <SkipForward className="ml-2 h-4 w-4" />
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed || isSubmitting}
          className="btn-glow gap-2 bg-gradient-to-r from-brand-teal to-brand-lime font-semibold text-brand-charcoal"
        >
          {isLastStep ? (isSubmitting ? "Saving..." : "Finish") : "Next"}
          {!isLastStep && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
