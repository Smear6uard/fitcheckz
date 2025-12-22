"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export type CurationState = "idle" | "curating" | "revealing" | "error"

interface CurationStatusProps {
  state: CurationState
  revealedCount?: number
  totalCount?: number
  errorMessage?: string
  onRetry?: () => void
  className?: string
}

export function CurationStatus({
  state,
  revealedCount = 0,
  totalCount = 0,
  errorMessage,
  onRetry,
  className,
}: CurationStatusProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  if (state === "idle") {
    return null
  }

  const getMessage = () => {
    switch (state) {
      case "curating":
        return "Curating outfits for you"
      case "revealing":
        if (totalCount > 0) {
          return `${revealedCount} of ${totalCount} ready`
        }
        return "Refining suggestions"
      case "error":
        return errorMessage || "Couldn't finish curating"
      default:
        return ""
    }
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border/50",
        state === "error" && "border-destructive/30 bg-destructive/5",
        className
      )}
    >
      {/* Progress indicator */}
      {state !== "error" && (
        <div className="relative h-1 w-16 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-brand-lime rounded-full",
              state === "curating" && !prefersReducedMotion && "animate-indeterminate",
              state === "revealing" && "transition-all duration-300"
            )}
            style={
              state === "revealing" && totalCount > 0
                ? { width: `${(revealedCount / totalCount) * 100}%` }
                : state === "curating"
                  ? { width: "30%" }
                  : undefined
            }
          />
        </div>
      )}

      {/* Status text */}
      <span
        className={cn(
          "text-sm font-medium",
          state === "error" ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {getMessage()}
      </span>

      {/* Retry button for error state */}
      {state === "error" && onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="h-7 px-2 text-xs gap-1.5 hover:text-primary"
        >
          <RefreshCw className="h-3 w-3" />
          Try again
        </Button>
      )}
    </div>
  )
}
