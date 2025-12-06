"use client"

import { useEffect, useState } from "react"
import { animated } from "@react-spring/web"
import { useScaleIn, useBounce } from "@/lib/animations/variants"
import { Check } from "lucide-react"

interface SuccessAnimationProps {
  show: boolean
  onComplete?: () => void
  size?: "sm" | "md" | "lg"
}

export function SuccessAnimation({
  show,
  onComplete,
  size = "md",
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  const scaleStyle = useScaleIn()
  const bounceStyle = useBounce(isVisible)

  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <animated.div
        className={`${sizes[size]} rounded-full bg-green-500 flex items-center justify-center shadow-lg`}
        style={{ ...scaleStyle, ...bounceStyle }}
      >
        <Check className={`${iconSizes[size]} text-white`} strokeWidth={3} />
      </animated.div>
    </div>
  )
}
