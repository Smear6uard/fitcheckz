"use client"

import { animated, useSpring, config } from "@react-spring/web"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface QuizProgressProps {
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
}

export function QuizProgress({
  currentStep,
  totalSteps,
  stepLabels,
}: QuizProgressProps) {
  const progressPercent = ((currentStep + 1) / totalSteps) * 100

  const progressSpring = useSpring({
    width: `${progressPercent}%`,
    config: { tension: 200, friction: 20 },
  })

  return (
    <div className="space-y-3 px-4 pt-4">
      {/* Progress bar */}
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <animated.div
          style={progressSpring}
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <StepIndicator
              key={index}
              step={index + 1}
              label={stepLabels?.[index]}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
            />
          )
        })}
      </div>
    </div>
  )
}

interface StepIndicatorProps {
  step: number
  label?: string
  isCompleted: boolean
  isCurrent: boolean
}

function StepIndicator({
  step,
  label,
  isCompleted,
  isCurrent,
}: StepIndicatorProps) {
  const spring = useSpring({
    scale: isCurrent ? 1.1 : 1,
    config: config.wobbly,
  })

  return (
    <div className="flex flex-col items-center gap-1">
      <animated.div
        style={{ transform: spring.scale.to((s) => `scale(${s})`) }}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
          isCompleted
            ? "bg-primary text-primary-foreground"
            : isCurrent
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
        )}
      >
        {isCompleted ? <Check className="h-4 w-4" /> : step}
      </animated.div>
      {label && (
        <span
          className={cn(
            "text-xs transition-colors",
            isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      )}
    </div>
  )
}
