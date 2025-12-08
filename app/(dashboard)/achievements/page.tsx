"use client"

import { useState, useEffect } from "react"
import { animated, useTransition, config } from "@react-spring/web"
import {
  Trophy,
  Loader2,
  Filter,
  Shirt,
  Sparkles,
  Flame,
  Users,
  Palette,
  Share2,
  Check,
  Lock,
} from "lucide-react"
import { AchievementBadge } from "@/components/gamification/AchievementBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { getRarityConfig, type Achievement } from "@/lib/gamification/achievements"

type AchievementWithProgress = Achievement & {
  unlocked: boolean
  progress: number
  target: number
  progressPercent: number
  unlockedAt?: string | null
}

interface AchievementsResponse {
  achievements: AchievementWithProgress[]
  stats: {
    unlockedCount: number
    totalCount: number
    percentComplete: number
  }
  newlyUnlocked: string[]
}

const categoryConfig = {
  wardrobe: { icon: Shirt, label: "Wardrobe", color: "text-brand-teal" },
  outfits: { icon: Sparkles, label: "Outfits", color: "text-brand-lime" },
  streak: { icon: Flame, label: "Streaks", color: "text-orange-500" },
  social: { icon: Users, label: "Social", color: "text-blue-500" },
  style: { icon: Palette, label: "Style", color: "text-brand-lavender" },
}

const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary"] as const

export default function AchievementsPage() {
  const [data, setData] = useState<AchievementsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)
  const [showLockedOnly, setShowLockedOnly] = useState(false)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/gamification/achievements")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (error) {
      console.error("Error fetching achievements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter achievements
  const filteredAchievements = data?.achievements.filter((a) => {
    if (selectedCategory && a.category !== selectedCategory) return false
    if (showUnlockedOnly && !a.unlocked) return false
    if (showLockedOnly && a.unlocked) return false
    return true
  }) || []

  // Group by category
  const groupedByCategory = filteredAchievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = []
    }
    acc[achievement.category].push(achievement)
    return acc
  }, {} as Record<string, AchievementWithProgress[]>)

  // Sort within each category by rarity
  Object.keys(groupedByCategory).forEach((category) => {
    groupedByCategory[category].sort((a, b) => {
      const aIndex = rarityOrder.indexOf(a.rarity)
      const bIndex = rarityOrder.indexOf(b.rarity)
      return aIndex - bIndex
    })
  })

  // Transition animation for cards
  const transitions = useTransition(
    selectedCategory ? [selectedCategory] : Object.keys(categoryConfig),
    {
      keys: (key) => key,
      from: { opacity: 0, transform: "translateY(20px)" },
      enter: { opacity: 1, transform: "translateY(0px)" },
      config: config.gentle,
      trail: 50,
    }
  )

  // Get rarity counts
  const rarityCounts = data?.achievements.reduce((acc, a) => {
    if (!acc[a.rarity]) {
      acc[a.rarity] = { total: 0, unlocked: 0 }
    }
    acc[a.rarity].total++
    if (a.unlocked) acc[a.rarity].unlocked++
    return acc
  }, {} as Record<string, { total: number; unlocked: number }>) || {}

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal mb-4" />
        <p className="text-muted-foreground">Loading your achievements...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <EmptyState
        icon={Trophy}
        title="Couldn't load achievements"
        description="Something went wrong. Please try again later."
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-500" />
            Achievements
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your style journey and unlock rewards
          </p>
        </div>

        {/* Filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {(selectedCategory || showUnlockedOnly || showLockedOnly) && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {(selectedCategory ? 1 : 0) +
                    (showUnlockedOnly ? 1 : 0) +
                    (showLockedOnly ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showUnlockedOnly}
              onCheckedChange={(checked) => {
                setShowUnlockedOnly(checked)
                if (checked) setShowLockedOnly(false)
              }}
            >
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Unlocked only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showLockedOnly}
              onCheckedChange={(checked) => {
                setShowLockedOnly(checked)
                if (checked) setShowUnlockedOnly(false)
              }}
            >
              <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
              Locked only
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Category</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={selectedCategory === null}
              onCheckedChange={() => setSelectedCategory(null)}
            >
              All categories
            </DropdownMenuCheckboxItem>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={selectedCategory === key}
                  onCheckedChange={() =>
                    setSelectedCategory(selectedCategory === key ? null : key)
                  }
                >
                  <Icon className={cn("h-4 w-4 mr-2", config.color)} />
                  {config.label}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Overall Progress */}
      <Card className="card-enhanced bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10">
        <CardContent className="py-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Main progress */}
            <div className="col-span-full sm:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-400/30">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-bold">
                    {data.stats.unlockedCount}
                    <span className="text-lg text-muted-foreground font-normal">
                      /{data.stats.totalCount}
                    </span>
                  </p>
                  <p className="text-muted-foreground">Achievements Unlocked</p>
                </div>
              </div>
              <Progress value={data.stats.percentComplete} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {data.stats.percentComplete}% complete
              </p>
            </div>

            {/* Rarity breakdown */}
            <div className="col-span-full sm:col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                By Rarity
              </p>
              <div className="grid grid-cols-5 gap-2">
                {rarityOrder.map((rarity) => {
                  const config = getRarityConfig(rarity)
                  const counts = rarityCounts[rarity] || { total: 0, unlocked: 0 }
                  return (
                    <div
                      key={rarity}
                      className={cn(
                        "text-center p-2 rounded-lg",
                        config.bgColor
                      )}
                    >
                      <p className="text-lg font-bold">
                        {counts.unlocked}/{counts.total}
                      </p>
                      <p className={cn("text-xs", config.textColor)}>
                        {config.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick category filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="gap-2"
        >
          All
        </Button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon
          const categoryAchievements = data.achievements.filter(
            (a) => a.category === key
          )
          const unlockedInCategory = categoryAchievements.filter(
            (a) => a.unlocked
          ).length
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSelectedCategory(selectedCategory === key ? null : key)
              }
              className="gap-2"
            >
              <Icon className={cn("h-4 w-4", config.color)} />
              {config.label}
              <Badge variant="secondary" className="ml-1">
                {unlockedInCategory}/{categoryAchievements.length}
              </Badge>
            </Button>
          )
        })}
      </div>

      {/* Achievements by category */}
      {filteredAchievements.length === 0 ? (
        <EmptyState
          icon={showLockedOnly ? Lock : Trophy}
          title={
            showLockedOnly
              ? "All achievements unlocked!"
              : "No achievements match your filter"
          }
          description={
            showLockedOnly
              ? "You're a style legend! All achievements in this category are unlocked."
              : "Try adjusting your filters to see more achievements."
          }
        />
      ) : (
        <div className="space-y-8">
          {transitions((style, categoryKey) => {
            const achievements = groupedByCategory[categoryKey]
            if (!achievements || achievements.length === 0) return null

            const config = categoryConfig[categoryKey as keyof typeof categoryConfig]
            const Icon = config.icon

            return (
              <animated.div style={style} key={categoryKey}>
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          config.color === "text-brand-teal" && "bg-brand-teal/20",
                          config.color === "text-brand-lime" && "bg-brand-lime/20",
                          config.color === "text-orange-500" && "bg-orange-500/20",
                          config.color === "text-blue-500" && "bg-blue-500/20",
                          config.color === "text-brand-lavender" && "bg-brand-lavender/20"
                        )}
                      >
                        <Icon className={cn("h-5 w-5", config.color)} />
                      </div>
                      <div>
                        <span>{config.label} Achievements</span>
                        <p className="text-sm font-normal text-muted-foreground">
                          {achievements.filter((a) => a.unlocked).length}/
                          {achievements.length} unlocked
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {achievements.map((achievement) => (
                        <AchievementBadge
                          key={achievement.id}
                          achievement={achievement}
                          size="md"
                          showProgress={true}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </animated.div>
            )
          })}
        </div>
      )}

      {/* Share Progress Card */}
      <Card className="border-brand-teal/50 bg-gradient-to-r from-brand-teal/10 to-brand-lime/10">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div>
            <p className="font-semibold">Share your achievements</p>
            <p className="text-sm text-muted-foreground">
              Show off your style journey to your friends
            </p>
          </div>
          <Button className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Progress
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
