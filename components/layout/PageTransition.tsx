"use client"

import { ReactNode } from "react"
import { animated } from "@react-spring/web"
import { useFadeIn } from "@/lib/animations/variants"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const style = useFadeIn(100)

  return <animated.div style={style}>{children}</animated.div>
}
