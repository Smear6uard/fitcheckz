"use client"

import { ReactNode } from "react"
import { animated, useSpring, useTrail, config } from "@react-spring/web"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  /** Use shimmer effect for premium loading feel */
  shimmer?: boolean
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md",
        shimmer ? "animate-shimmer" : "bg-accent animate-pulse",
        className
      )}
      {...props}
    />
  )
}

/**
 * Skeleton card with premium loading animation
 */
interface SkeletonCardProps {
  className?: string
  imageHeight?: string
  showImage?: boolean
  showTitle?: boolean
  showDescription?: boolean
  showActions?: boolean
}

function SkeletonCard({
  className,
  imageHeight = "h-48",
  showImage = true,
  showTitle = true,
  showDescription = true,
  showActions = false,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        className
      )}
    >
      {showImage && (
        <Skeleton className={cn("w-full rounded-none", imageHeight)} />
      )}
      <div className="p-4 space-y-3">
        {showTitle && (
          <Skeleton className="h-5 w-3/4" />
        )}
        {showDescription && (
          <>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </>
        )}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Progressive reveal wrapper - animates children in sequence
 */
interface ProgressiveRevealProps {
  children: ReactNode[]
  isLoading: boolean
  staggerDelay?: number
  className?: string
}

function ProgressiveReveal({
  children,
  isLoading,
  staggerDelay = 100,
  className,
}: ProgressiveRevealProps) {
  const items = Array.isArray(children) ? children : [children]

  const trail = useTrail(items.length, {
    from: { opacity: 0, y: 20, scale: 0.95 },
    to: {
      opacity: isLoading ? 0 : 1,
      y: isLoading ? 20 : 0,
      scale: isLoading ? 0.95 : 1,
    },
    config: { tension: 280, friction: 20 },
  })

  return (
    <div className={className}>
      {trail.map((style, index) => (
        <animated.div key={index} style={style}>
          {items[index]}
        </animated.div>
      ))}
    </div>
  )
}

/**
 * Skeleton grid with staggered reveal animation
 */
interface SkeletonGridProps {
  count: number
  columns?: number
  cardProps?: SkeletonCardProps
  className?: string
}

function SkeletonGrid({
  count,
  columns = 3,
  cardProps,
  className,
}: SkeletonGridProps) {
  const items = Array.from({ length: count }, (_, i) => i)

  const trail = useTrail(count, {
    from: { opacity: 0.3, scale: 0.98 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 200, friction: 20 },
    delay: 100,
  })

  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {trail.map((style, index) => (
        <animated.div key={index} style={style}>
          <SkeletonCard {...cardProps} />
        </animated.div>
      ))}
    </div>
  )
}

/**
 * Content transition - morphs from skeleton to real content
 */
interface ContentTransitionProps {
  isLoading: boolean
  skeleton: ReactNode
  children: ReactNode
  className?: string
}

function ContentTransition({
  isLoading,
  skeleton,
  children,
  className,
}: ContentTransitionProps) {
  const spring = useSpring({
    opacity: isLoading ? 0 : 1,
    scale: isLoading ? 0.98 : 1,
    filter: isLoading ? "blur(4px)" : "blur(0px)",
    config: config.gentle,
  })

  if (isLoading) {
    return <div className={className}>{skeleton}</div>
  }

  return (
    <animated.div style={spring} className={className}>
      {children}
    </animated.div>
  )
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  ProgressiveReveal,
  ContentTransition,
}
