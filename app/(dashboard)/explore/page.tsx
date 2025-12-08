"use client"

import { useEffect, useState } from "react"
import { Compass, TrendingUp, Users } from "lucide-react"
import { OutfitFeed } from "@/components/explore/OutfitFeed"
import { WeatherBadge } from "@/components/weather/WeatherBadge"
import { createClient } from "@/lib/supabase/client"

export default function ExplorePage() {
  const [userId, setUserId] = useState<string | undefined>()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id)
    }
    getUser()
  }, [supabase.auth])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Compass className="h-8 w-8 text-brand-teal" />
            Explore
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover trending outfits from the community
          </p>
        </div>
        <WeatherBadge variant="compact" />
      </div>

      {/* Stats/highlights banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-gradient-to-br from-brand-lime/10 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-lime/20">
              <TrendingUp className="h-5 w-5 text-brand-lime" />
            </div>
            <div>
              <p className="text-2xl font-bold">Trending</p>
              <p className="text-sm text-muted-foreground">
                Top-rated looks today
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-brand-lavender/10 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-lavender/20">
              <Users className="h-5 w-5 text-brand-lavender" />
            </div>
            <div>
              <p className="text-2xl font-bold">Community</p>
              <p className="text-sm text-muted-foreground">
                Real looks, real style
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-brand-teal/10 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal/20">
              <Compass className="h-5 w-5 text-brand-teal" />
            </div>
            <div>
              <p className="text-2xl font-bold">Discover</p>
              <p className="text-sm text-muted-foreground">
                Find your next look
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Outfit feed */}
      <OutfitFeed currentUserId={userId} />
    </div>
  )
}
