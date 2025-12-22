"use client"

import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface DoubleTapHeartProps {
  x: number
  y: number
  className?: string
}

export function DoubleTapHeart({ x, y, className }: DoubleTapHeartProps) {
  return (
    <div
      className={cn(
        "absolute pointer-events-none z-50",
        className
      )}
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <Heart
        className="w-20 h-20 text-rose-500 fill-rose-500 animate-heart-burst drop-shadow-lg"
      />
    </div>
  )
}
