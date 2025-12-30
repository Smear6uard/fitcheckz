"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flame, Shirt, Shuffle, Check, Plus, ArrowRight, Cloud, Sun } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface WardrobeItem {
  id: string
  item_name: string
  photo_url: string
  category: string
}

interface StreakData {
  currentStreak: number
  longestStreak: number
}

interface DashboardContentProps {
  userName: string
  wardrobeCount: number
  wardrobeItems: WardrobeItem[]
  initialStreak: StreakData | null
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

const getDayName = () => {
  return new Date().toLocaleDateString("en-US", { weekday: "long" })
}

export function DashboardContent({
  userName,
  wardrobeCount,
  wardrobeItems,
  initialStreak,
}: DashboardContentProps) {
  const [streak, setStreak] = useState<StreakData | null>(initialStreak)
  const [isShuffling, setIsShuffling] = useState(false)
  const [displayedItems, setDisplayedItems] = useState<WardrobeItem[]>(
    wardrobeItems.slice(0, 3)
  )

  // Fetch streak on mount
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await fetch("/api/streak/update", { method: "POST" })
        if (res.ok) {
          const data = await res.json()
          setStreak({
            currentStreak: data.currentStreak,
            longestStreak: data.longestStreak,
          })
        }
      } catch (error) {
        console.error("Failed to fetch streak:", error)
      }
    }
    fetchStreak()
  }, [])

  const handleShuffle = () => {
    if (wardrobeItems.length < 3) return

    setIsShuffling(true)

    // Shuffle and pick 3 random items
    setTimeout(() => {
      const shuffled = [...wardrobeItems].sort(() => Math.random() - 0.5)
      setDisplayedItems(shuffled.slice(0, 3))
      setIsShuffling(false)
    }, 500)
  }

  const handleWearToday = () => {
    toast.success("Outfit marked as worn!", {
      description: "Keep up the great style!",
    })
  }

  const displayName = userName || "there"
  const greeting = getGreeting()
  const dayName = getDayName()

  return (
    <div className="space-y-6">
      {/* Weather Widget */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sun className="h-4 w-4 text-amber-400" />
        <span>72°F Sunny • Aurora, IL</span>
      </div>

      {/* Greeting */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          {greeting}, {displayName}
        </h1>
        <p className="text-muted-foreground">Here's your look for today</p>
      </div>

      {/* Daily Outfit Card */}
      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-4 space-y-4">
          {/* Outfit Items Row */}
          <div className="flex items-center justify-center gap-3">
            {displayedItems.length > 0 ? (
              displayedItems.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative w-20 h-20 rounded-lg overflow-hidden bg-muted/50 border border-border",
                    isShuffling && "animate-pulse"
                  )}
                >
                  <Image
                    src={item.photo_url}
                    alt={item.item_name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              // Placeholder when no items
              <>
                <div className="w-20 h-20 rounded-lg bg-muted/30 border border-dashed border-border flex items-center justify-center">
                  <Shirt className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="w-20 h-20 rounded-lg bg-muted/30 border border-dashed border-border flex items-center justify-center">
                  <Shirt className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="w-20 h-20 rounded-lg bg-muted/30 border border-dashed border-border flex items-center justify-center">
                  <Shirt className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </>
            )}
          </div>

          {/* Style Insight */}
          <p className="text-sm text-muted-foreground text-center">
            {wardrobeCount >= 3
              ? `Smart casual for your ${dayName}`
              : "Add more items to get outfit suggestions"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleWearToday}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={wardrobeCount < 3}
            >
              <Check className="h-4 w-4 mr-2" />
              Wear This Today
            </Button>
            <Button
              variant="outline"
              onClick={handleShuffle}
              disabled={wardrobeCount < 3 || isShuffling}
              className="border-border"
            >
              <Shuffle className={cn("h-4 w-4", isShuffling && "animate-spin")} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak Card */}
        <Link href="/achievements">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-xl font-bold">
                  {streak?.currentStreak || 0} Day{(streak?.currentStreak || 0) !== 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Streak • Best: {streak?.longestStreak || 0}
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Items Card */}
        <Link href="/wardrobe">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Shirt className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold">{wardrobeCount} Items</span>
              </div>
              <p className="text-xs text-muted-foreground">in closet</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Conditional Card */}
      {wardrobeCount < 10 ? (
        // Build Your Closet
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">Build Your Closet</h3>
              <p className="text-sm text-muted-foreground">
                Add {10 - wardrobeCount} more items to unlock personalized outfits
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground">{wardrobeCount} / 10 items</span>
              </div>
              <Progress value={(wardrobeCount / 10) * 100} className="h-2" />
            </div>
            <Button asChild className="w-full">
              <Link href="/wardrobe/upload">
                <Plus className="h-4 w-4 mr-2" />
                Add Items
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Complete Your Wardrobe
        <Card className="bg-card border-border border-l-4 border-l-[#C4515E]">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-1">
              Complete Your Wardrobe
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Add a white button-up to unlock 11 new outfits
            </p>
            <Link
              href="/shop"
              className="text-sm text-[#C4515E] hover:underline inline-flex items-center gap-1"
            >
              See Suggestions
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
