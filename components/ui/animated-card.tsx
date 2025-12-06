"use client"

import { useState } from "react"
import { animated } from "@react-spring/web"
import { Card } from "./card"
import { useHoverLift, useSlideUp } from "@/lib/animations/variants"

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode
  enableHover?: boolean
  enableSlideUp?: boolean
  delay?: number
}

export function AnimatedCard({
  children,
  enableHover = true,
  enableSlideUp = true,
  delay = 0,
  className,
  ...props
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const hoverStyle = useHoverLift(isHovered && enableHover)
  const slideUpStyle = useSlideUp(delay)

  const AnimatedCardComponent = animated(Card)

  const combinedStyle = enableSlideUp
    ? { ...slideUpStyle, ...(enableHover && isHovered ? hoverStyle : {}) }
    : enableHover && isHovered
    ? hoverStyle
    : {}

  return (
    <AnimatedCardComponent
      {...props}
      className={className}
      style={combinedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </AnimatedCardComponent>
  )
}
