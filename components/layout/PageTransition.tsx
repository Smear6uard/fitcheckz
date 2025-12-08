"use client"

import { usePathname } from "next/navigation"
import { ReactNode, useEffect, useState, useRef } from "react"
import { animated, useTransition, useSpring, config } from "@react-spring/web"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const prevPathRef = useRef(pathname)
  const [direction, setDirection] = useState<"forward" | "back">("forward")

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  // Detect navigation direction for smarter animations
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      // Simple heuristic: shorter paths = going "back"
      const isBack = pathname.length < prevPathRef.current.length
      setDirection(isBack ? "back" : "forward")
      prevPathRef.current = pathname
    }
  }, [pathname])

  const transitions = useTransition(pathname, {
    from: prefersReducedMotion
      ? { opacity: 1, transform: "scale(1) translateY(0px)" }
      : {
          opacity: 0,
          transform:
            direction === "forward"
              ? "scale(0.98) translateY(12px)"
              : "scale(0.98) translateY(-12px)",
        },
    enter: {
      opacity: 1,
      transform: "scale(1) translateY(0px)",
    },
    leave: prefersReducedMotion
      ? { opacity: 1, transform: "scale(1) translateY(0px)" }
      : {
          opacity: 0,
          transform:
            direction === "forward"
              ? "scale(0.98) translateY(-8px)"
              : "scale(0.98) translateY(8px)",
        },
    config: {
      tension: 300,
      friction: 28,
      mass: 0.8,
    },
    exitBeforeEnter: true,
  })

  return transitions((style, item) =>
    item === pathname ? (
      <animated.div
        style={{
          ...style,
          willChange: "transform, opacity",
        }}
        className="min-h-full"
      >
        {children}
      </animated.div>
    ) : null
  )
}

/**
 * Simpler fade-only transition for performance-sensitive contexts
 */
export function FadeTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  const transitions = useTransition(pathname, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.gentle,
    exitBeforeEnter: true,
  })

  return transitions((style, item) =>
    item === pathname ? (
      <animated.div style={style}>{children}</animated.div>
    ) : null
  )
}

/**
 * Slide transition for panel-like navigation
 */
export function SlideTransition({
  children,
  direction = "right",
}: PageTransitionProps & { direction?: "left" | "right" }) {
  const pathname = usePathname()
  const offset = direction === "right" ? 20 : -20

  const transitions = useTransition(pathname, {
    from: { opacity: 0, transform: `translateX(${offset}px)` },
    enter: { opacity: 1, transform: "translateX(0px)" },
    leave: { opacity: 0, transform: `translateX(${-offset}px)` },
    config: { tension: 300, friction: 26 },
    exitBeforeEnter: true,
  })

  return transitions((style, item) =>
    item === pathname ? (
      <animated.div style={style}>{children}</animated.div>
    ) : null
  )
}
