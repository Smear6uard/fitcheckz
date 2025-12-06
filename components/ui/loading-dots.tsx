"use client"

import { useSpring, animated, config } from "@react-spring/web"

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingDots({ size = "md", className = "" }: LoadingDotsProps) {
  const sizes = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  }

  const dotSize = sizes[size]

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Dot delay={0} dotSize={dotSize} />
      <Dot delay={150} dotSize={dotSize} />
      <Dot delay={300} dotSize={dotSize} />
    </div>
  )
}

function Dot({ delay, dotSize }: { delay: number; dotSize: string }) {
  const props = useSpring({
    loop: true,
    from: { opacity: 0.3, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.gentle,
    delay,
  })

  return (
    <animated.div
      className={`${dotSize} rounded-full bg-current`}
      style={props}
    />
  )
}
