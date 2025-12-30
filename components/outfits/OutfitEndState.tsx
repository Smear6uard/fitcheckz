"use client"

import { animated, useSpring, config } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Heart, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface OutfitEndStateProps {
  totalOutfits: number
  likedCount: number
  onCurateMore?: () => void
  onViewFavorites?: () => void
  className?: string
}

export function OutfitEndState({
  totalOutfits,
  likedCount,
  onCurateMore,
  onViewFavorites,
  className,
}: OutfitEndStateProps) {
  // Animated entrance
  const iconSpring = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: 1, rotate: 0 },
    config: config.wobbly,
    delay: 100,
  })

  const textSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
    delay: 300,
  })

  const statsSpring = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
    delay: 500,
  })

  const buttonsSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
    delay: 700,
  })

  return (
    <div
      className={cn(
        "h-full flex flex-col items-center justify-center px-6 text-center bg-background",
        className
      )}
    >
      {/* Success icon */}
      <animated.div
        style={{
          scale: iconSpring.scale,
          rotate: iconSpring.rotate.to((r) => `${r}deg`),
        }}
        className="mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-primary/20 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
      </animated.div>

      {/* Main message */}
      <animated.div style={textSpring}>
        <h2 className="text-2xl font-bold mb-2">
          You've seen all {totalOutfits} looks!
        </h2>
        <p className="text-muted-foreground">
          Great job exploring your style options
        </p>
      </animated.div>

      {/* Stats */}
      <animated.div
        style={statsSpring}
        className="flex items-center gap-6 mt-6 mb-8"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <div className="text-left">
            <p className="text-lg font-bold">{likedCount}</p>
            <p className="text-xs text-muted-foreground">Liked</p>
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-lg font-bold">{totalOutfits}</p>
            <p className="text-xs text-muted-foreground">Viewed</p>
          </div>
        </div>
      </animated.div>

      {/* Action buttons */}
      <animated.div
        style={buttonsSpring}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <Button
          onClick={onCurateMore}
          className="w-full gap-2 bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Sparkles className="w-4 h-4" />
          Curate More Looks
        </Button>

        {likedCount > 0 && (
          <Button
            variant="outline"
            onClick={onViewFavorites}
            className="w-full gap-2"
            size="lg"
          >
            View Favorites
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </animated.div>
    </div>
  )
}
