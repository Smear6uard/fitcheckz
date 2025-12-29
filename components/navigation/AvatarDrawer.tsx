"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { animated, useSpring } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"
import {
  Crown,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Trophy,
  Gift,
  Target,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

export function AvatarDrawer() {
  const router = useRouter()
  const { isDrawerOpen, setIsDrawerOpen } = useSidebar()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ itemCount: 0, outfitCount: 0 })
  const [streak, setStreak] = useState(0)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch wardrobe item count
        const { count: itemCount } = await supabase
          .from("wardrobe_items")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        // Fetch outfit count
        const { count: outfitCount } = await supabase
          .from("outfit_suggestions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        setStats({
          itemCount: itemCount || 0,
          outfitCount: outfitCount || 0,
        })

        // Fetch streak data
        const { data: streakData } = await supabase
          .from("user_streaks")
          .select("current_streak")
          .eq("user_id", user.id)
          .single()

        setStreak(streakData?.current_streak || 0)

        // Check subscription status
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("status, plan_id")
          .eq("user_id", user.id)
          .single()

        setIsPro(subscription?.status === "active" && subscription?.plan_id === "pro")
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsDrawerOpen(false)
    router.push("/")
    router.refresh()
  }

  const handleClose = () => setIsDrawerOpen(false)

  const handleProfileClick = () => {
    setIsDrawerOpen(false)
    router.push("/profile")
  }

  const handleHelpClick = () => {
    // Open external support - mailto or support URL
    window.open("mailto:support@styleum.app", "_blank")
    setIsDrawerOpen(false)
  }

  // Drawer animation - slide from left
  const drawerSpring = useSpring({
    x: isDrawerOpen ? 0 : -100,
    backdropOpacity: isDrawerOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
  })

  // Swipe-left-to-close gesture
  const bind = useDrag(
    ({ movement: [mx], velocity: [vx], direction: [dx], cancel }) => {
      // Close if swiped left more than 100px or fast swipe left
      if (mx < -100 || (vx > 0.5 && dx < 0)) {
        cancel()
        setIsDrawerOpen(false)
      }
    },
    { axis: "x", filterTaps: true }
  )

  const initials = user?.email?.charAt(0).toUpperCase() || "U"
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || "User"
  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "user"

  return (
    <div
      className={cn(
        "md:hidden fixed inset-0 z-[100]",
        !isDrawerOpen && "pointer-events-none"
      )}
      style={{ visibility: isDrawerOpen ? "visible" : "hidden" }}
    >
      {/* Backdrop */}
      <animated.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ opacity: drawerSpring.backdropOpacity }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer panel with swipe gesture */}
      <animated.div
        {...bind()}
        className="fixed inset-y-0 left-0 z-[101] w-72 overflow-y-auto bg-background border-r border-sidebar-border flex flex-col touch-pan-y"
        style={{
          transform: drawerSpring.x.to((x) => `translateX(${x}%)`),
        }}
      >
        {/* User profile section */}
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center gap-3 p-4 pb-2 text-left group"
        >
          <Avatar className="h-14 w-14 ring-2 ring-primary">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
            <AvatarFallback className="text-xl bg-primary/10">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground truncate text-lg">{displayName}</p>
            <p className="text-sm text-muted-foreground truncate">@{username}</p>
            <p className="text-xs text-[#14b8a6] mt-0.5">Edit Profile</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
        </button>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-foreground">{stats.itemCount}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Items</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-foreground">{stats.outfitCount}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Outfits</p>
          </div>
          {streak > 0 ? (
            <div className="bg-orange-500/15 border border-orange-500/30 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-foreground">🔥 {streak}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Streak</p>
            </div>
          ) : (
            <button
              onClick={() => { handleClose(); router.push("/dashboard"); }}
              className="relative bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-colors group"
            >
              <p className="text-xl font-bold text-foreground">🎯 Start</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Streak</p>
              <ChevronRight className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mx-4" />

        {/* Upgrade prompt for free tier */}
        {!isPro && (
          <div className="px-4 py-4">
            <Link
              href="/subscription"
              onClick={handleClose}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#C4515E]/15 to-transparent border-l-[3px] border-l-[#C4515E] rounded-xl hover:from-[#C4515E]/20 transition-colors"
            >
              <Crown className="h-5 w-5 text-[#C4515E] shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground">Unlimited outfits, weather AI & more</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-white/10 mx-4" />

        {/* Weekly Challenge Card (Placeholder) */}
        <div className="px-4 py-4">
          <div className="p-4 bg-gradient-to-r from-[#14b8a6]/15 to-transparent border-l-[3px] border-l-[#14b8a6] rounded-xl opacity-75">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#14b8a6]" />
                <p className="font-semibold text-foreground">Weekly Challenge</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] bg-[#14b8a6]/20 text-[#14b8a6] px-2 py-0.5 rounded-full"><Lock className="h-3 w-3" />Coming Soon</span>
            </div>
            <p className="text-sm text-muted-foreground">Style challenges with rewards</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mx-4" />

        {/* Menu Items */}
        <nav className="px-3 pt-2 space-y-1">
          {/* Achievements */}
          <Link
            href="/achievements"
            onClick={handleClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-[rgba(20,184,166,0.1)] active:bg-[rgba(20,184,166,0.15)] transition-colors duration-150"
          >
            <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
            <span className="text-sm font-medium text-foreground">Achievements</span>
          </Link>

          {/* Style Quiz */}
          <Link
            href="/onboarding"
            onClick={handleClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-[rgba(20,184,166,0.1)] active:bg-[rgba(20,184,166,0.15)] transition-colors duration-150"
          >
            <Sparkles className="h-5 w-5 text-[#14b8a6] shrink-0" />
            <span className="text-sm font-medium text-foreground">Style Quiz</span>
          </Link>

          {/* Invite Friends (Placeholder) */}
          <button
            disabled
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 opacity-50 cursor-not-allowed"
          >
            <Gift className="h-5 w-5 text-[#14b8a6] shrink-0" />
            <span className="text-sm font-medium text-foreground">Invite Friends</span>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-[#14b8a6]"><Lock className="h-3 w-3" />Coming Soon</span>
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            onClick={handleClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-[rgba(20,184,166,0.1)] active:bg-[rgba(20,184,166,0.15)] transition-colors duration-150"
          >
            <Settings className="h-5 w-5 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-foreground">Settings</span>
          </Link>

          {/* Help */}
          <button
            onClick={handleHelpClick}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-[rgba(20,184,166,0.1)] active:bg-[rgba(20,184,166,0.15)] transition-colors duration-150"
          >
            <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-foreground">Help</span>
          </button>
        </nav>

        {/* Log out - pushed to bottom */}
        <div className="mt-auto">
          <div className="border-t border-white/10 mx-4" />
          <div className="px-3 py-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-[#C4515E] hover:bg-[#C4515E]/10 active:bg-[#C4515E]/15 transition-colors duration-150"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>
      </animated.div>
    </div>
  )
}
