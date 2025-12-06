"use client"

import { useState } from "react"
import { animated } from "@react-spring/web"
import { Button } from "./button"
import { useSpring, config } from "@react-spring/web"

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode
}

export function AnimatedButton({
  children,
  className,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const springProps = useSpring({
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    config: config.wobbly,
  })

  const AnimatedButtonComponent = animated(Button)

  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)
  const handleMouseLeave = () => setIsPressed(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
    onClick?.(e)
  }

  return (
    <AnimatedButtonComponent
      {...props}
      className={className}
      style={springProps}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </AnimatedButtonComponent>
  )
}
