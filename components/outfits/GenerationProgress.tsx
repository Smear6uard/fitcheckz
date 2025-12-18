"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface GenerationProgressProps {
  stage?: number
  onComplete?: () => void
}

// Gradient colors to shuffle through (from chip definitions)
const SHUFFLE_GRADIENTS = [
  "from-slate-700/50 via-gray-800/40 to-slate-700/50",
  "from-blue-900/50 via-slate-900/40 to-blue-900/50",
  "from-rose-900/50 via-pink-900/40 to-rose-900/50",
  "from-purple-900/50 via-indigo-900/40 to-purple-900/50",
  "from-orange-900/40 via-red-900/30 to-orange-900/40",
  "from-cyan-900/50 via-blue-900/40 to-cyan-900/50",
  "from-violet-900/50 via-purple-900/40 to-violet-900/50",
  "from-emerald-900/50 via-green-900/40 to-emerald-900/50",
  "from-amber-900/40 via-yellow-900/30 to-amber-900/40",
]

// 3-phase timing intervals (ms) - progressively slower for premium feel
const SHUFFLE_INTERVALS = [
  // Phase 1: Initial shuffle - "searching" (4 flips, ~1s)
  250, 250, 250, 250,
  // Phase 2: Deceleration - "narrowing down" (4 flips, ~2s)
  300, 400, 550, 750,
  // Phase 3: Final settle - "found it" (1 flip, ~1s)
  1000,
]

export function GenerationProgress({ onComplete }: GenerationProgressProps) {
  const [isShuffling, setIsShuffling] = useState(true)
  const [isDecelerating, setIsDecelerating] = useState(false)
  const [cardGradients, setCardGradients] = useState([0, 3, 6])
  const flipIndexRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Shuffle with deceleration effect
  const doFlip = useCallback(() => {
    const currentIndex = flipIndexRef.current

    // Check if we've completed all flips
    if (currentIndex >= SHUFFLE_INTERVALS.length) {
      setIsShuffling(false)
      setIsDecelerating(false)
      // Final settled gradients
      setCardGradients([0, 4, 7])
      return
    }

    // Flip to random gradients
    setCardGradients(prev => prev.map(() =>
      Math.floor(Math.random() * SHUFFLE_GRADIENTS.length)
    ))

    // Mark deceleration phase (after first 4 flips)
    if (currentIndex >= 4) {
      setIsDecelerating(true)
    }

    // Schedule next flip with progressive delay
    const delay = SHUFFLE_INTERVALS[currentIndex]
    flipIndexRef.current = currentIndex + 1

    timeoutRef.current = setTimeout(doFlip, delay)
  }, [])

  useEffect(() => {
    // Start the shuffle sequence
    timeoutRef.current = setTimeout(doFlip, 250)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [doFlip])

  return (
    <div className="flex flex-col items-center py-8 space-y-8">
      {/* Header text - changes based on phase */}
      <h3 className={`text-lg font-semibold text-foreground transition-all duration-500 ${isShuffling && !isDecelerating ? 'animate-pulse' : ''}`}>
        {!isShuffling
          ? "Creating your fits..."
          : isDecelerating
            ? "Almost there..."
            : "Shuffling your wardrobe..."}
      </h3>

      {/* Outfit cards - horizontal scroll on mobile, centered on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-4 w-full max-w-4xl scrollbar-hide justify-start md:justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`shrink-0 w-72 rounded-xl border overflow-hidden shadow-lg transition-all ${
              !isShuffling
                ? 'border-border/50 animate-settle-card duration-500'
                : isDecelerating
                  ? 'border-primary/20 duration-500'
                  : 'animate-shuffle-card border-primary/30 duration-300'
            }`}
            style={{
              animationDelay: `${i * 100}ms`,
            }}
          >
            {/* 2x2 outfit items grid with gradient shuffle */}
            <div className={`grid grid-cols-2 gap-2 p-4 bg-gradient-to-br ${
              isDecelerating ? 'transition-all duration-500' : 'transition-all duration-200'
            } ${SHUFFLE_GRADIENTS[cardGradients[i]]}`}>
              {[0, 1, 2, 3].map((j) => (
                <div
                  key={j}
                  className={`aspect-square rounded-lg transition-all ${
                    isShuffling
                      ? isDecelerating
                        ? 'bg-white/15 backdrop-blur-sm duration-400'
                        : 'bg-white/10 backdrop-blur-sm duration-150'
                      : 'bg-muted duration-300'
                  }`}
                />
              ))}
            </div>

            {/* Details section */}
            <div className="p-4 space-y-3 bg-card">
              {/* Badges */}
              <div className="flex gap-2">
                <div className={`h-6 w-16 rounded-full transition-all duration-300 ${
                  isShuffling ? 'bg-primary/20' : 'bg-muted'
                } ${isShuffling && !isDecelerating ? 'animate-pulse' : ''}`} />
                <div className={`h-6 w-20 rounded-full transition-all duration-300 ${
                  isShuffling ? 'bg-primary/15' : 'bg-muted'
                } ${isShuffling && !isDecelerating ? 'animate-pulse' : ''}`} />
              </div>

              {/* Description lines */}
              <div className="space-y-2">
                <div className={`h-4 w-full rounded transition-all duration-300 ${
                  isShuffling ? 'bg-muted/70' : 'bg-muted'
                } ${isShuffling && !isDecelerating ? 'animate-pulse' : ''}`} />
                <div className={`h-4 w-4/5 rounded transition-all duration-300 ${
                  isShuffling ? 'bg-muted/50' : 'bg-muted'
                } ${isShuffling && !isDecelerating ? 'animate-pulse' : ''}`} />
              </div>

              {/* Score bar */}
              <div className={`h-8 w-full rounded transition-all duration-300 ${
                isShuffling ? 'bg-primary/10' : 'bg-muted'
              } ${isShuffling && !isDecelerating ? 'animate-pulse' : ''}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              !isShuffling
                ? 'bg-primary/50'
                : isDecelerating
                  ? 'bg-primary/70'
                  : 'bg-primary animate-bounce'
            }`}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
