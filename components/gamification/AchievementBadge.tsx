"use client"

import { useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { cn } from "@/lib/utils"
import { Lock, Check } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { getRarityConfig, type Achievement } from "@/lib/gamification/achievements"

interface AchievementBadgeProps {
  achievement: Achievement & {
    unlocked: boolean
    progress: number
    target: number
    progressPercent: number
    unlockedAt?: string | null
  }
  size?: "sm" | "md" | "lg"
  showProgress?: boolean
  onClick?: () => void
  className?: string
}

export function AchievementBadge({
  achievement,
  size = "md",
  showProgress = true,
  onClick,
  className,
}: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const rarityConfig = getRarityConfig(achievement.rarity)

  // Hover animation
  const hoverSpring = useSpring({
    scale: isHovered ? 1.05 : 1,
    shadow: isHovered ? 12 : 4,
    config: config.gentle,
  })

  // Glow animation for unlocked achievements
  const glowSpring = useSpring({
    opacity: achievement.unlocked && isHovered ? 1 : 0,
    config: config.gentle,
  })

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  }

  const iconSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <animated.button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              scale: hoverSpring.scale,
              boxShadow: hoverSpring.shadow.to(
                (s) => `0 ${s}px ${s * 2}px rgba(0,0,0,0.1)`
              ),
            }}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-xl p-3 transition-colors",
              achievement.unlocked
                ? rarityConfig.bgColor
                : "bg-muted opacity-60",
              onClick && "cursor-pointer",
              className
            )}
          >
            {/* Glow effect */}
            {achievement.unlocked && (
              <animated.div
                style={{ opacity: glowSpring.opacity }}
                className={cn(
                  "absolute inset-0 rounded-xl bg-gradient-to-br blur-md -z-10",
                  rarityConfig.gradient
                )}
              />
            )}

            {/* Badge icon */}
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                sizeClasses[size],
                achievement.unlocked
                  ? `bg-gradient-to-br ${rarityConfig.gradient} shadow-lg ${rarityConfig.glow}`
                  : "bg-muted-foreground/20"
              )}
            >
              {achievement.unlocked ? (
                <span className={iconSizeClasses[size]}>{achievement.emoji}</span>
              ) : (
                <Lock className={cn("text-muted-foreground", {
                  "h-4 w-4": size === "sm",
                  "h-5 w-5": size === "md",
                  "h-6 w-6": size === "lg",
                })} />
              )}
            </div>

            {/* Achievement name */}
            <span
              className={cn(
                "text-center font-medium line-clamp-2",
                size === "sm" ? "text-xs" : "text-sm",
                achievement.unlocked ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {achievement.name}
            </span>

            {/* Progress bar for locked achievements */}
            {showProgress && !achievement.unlocked && (
              <div className="w-full mt-1">
                <Progress
                  value={achievement.progressPercent}
                  className="h-1.5"
                />
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {achievement.progress}/{achievement.target}
                </p>
              </div>
            )}

            {/* Unlocked checkmark */}
            {achievement.unlocked && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-md">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </animated.button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{achievement.emoji}</span>
              <div>
                <p className="font-semibold">{achievement.name}</p>
                <span className={cn("text-xs", rarityConfig.textColor)}>
                  {rarityConfig.label}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {achievement.description}
            </p>
            {!achievement.unlocked && (
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span className="font-medium">
                    {achievement.progress}/{achievement.target}
                  </span>
                </div>
                <Progress
                  value={achievement.progressPercent}
                  className="h-1.5 mt-1"
                />
              </div>
            )}
            {achievement.unlocked && achievement.unlockedAt && (
              <p className="text-xs text-muted-foreground">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/**
 * Grid of achievement badges
 */
export function AchievementGrid({
  achievements,
  showLocked = true,
  className,
}: {
  achievements: AchievementBadgeProps["achievement"][]
  showLocked?: boolean
  className?: string
}) {
  const displayAchievements = showLocked
    ? achievements
    : achievements.filter((a) => a.unlocked)

  return (
    <div
      className={cn(
        "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4",
        className
      )}
    >
      {displayAchievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size="md"
        />
      ))}
    </div>
  )
}
