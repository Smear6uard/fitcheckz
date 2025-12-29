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
        {/* User profile section with gradient background */}
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center gap-4 p-4 pt-6 pb-6 text-left group relative"
        >
          {/* Darker gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

          <Avatar className="h-[72px] w-[72px] ring-2 ring-primary relative">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
            <AvatarFallback className="text-2xl bg-primary/10">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 relative">
            <p className="font-bold text-foreground truncate text-xl">{displayName}</p>
            <p className="text-sm text-muted-foreground truncate">@{username}</p>
            <p className="text-sm text-primary mt-1 font-medium">
              {stats.itemCount} items • {stats.outfitCount} outfits
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors relative" />
        </button>

        {/* Upgrade prompt for free tier */}
        {!isPro && (
          <div className="px-4 pb-6">
            <Link
              href="/subscription"
              onClick={handleClose}
              className="block p-4 rounded-xl border border-[#C4515E]/40 bg-gradient-to-r from-[#C4515E]/15 to-[#C4515E]/5 hover:from-[#C4515E]/20 hover:to-[#C4515E]/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C4515E]/20">
                  <Crown className="h-5 w-5 text-[#C4515E]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">Upgrade to Pro</p>
                  <p className="text-xs text-muted-foreground">Unlimited styling + exclusive drops</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#C4515E]" />
              </div>
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <nav className="px-3 pt-4 space-y-2">
          {/* Achievements */}
          <Link
            href="/achievements"
            onClick={handleClose}
            className="flex items-center gap-4 rounded-xl px-3 py-4 hover:bg-amber-500/10 transition-colors"
          >
            <Trophy className="h-6 w-6 text-amber-500 shrink-0" />
            <span className="text-base font-semibold text-foreground">Achievements</span>
          </Link>

          {/* Style Quiz */}
          <Link
            href="/onboarding"
            onClick={handleClose}
            className="flex items-center gap-4 rounded-xl px-3 py-4 hover:bg-primary/10 transition-colors"
          >
            <Sparkles className="h-6 w-6 text-primary shrink-0" />
            <span className="text-base font-semibold text-foreground">Style Quiz</span>
          </Link>
        </nav>

        {/* Account section */}
        <nav className="px-3 pt-6 space-y-2">
          {/* Settings */}
          <Link
            href="/settings"
            onClick={handleClose}
            className="flex items-center gap-4 rounded-xl px-3 py-4 hover:bg-muted transition-colors"
          >
            <Settings className="h-6 w-6 text-muted-foreground shrink-0" />
            <span className="text-base font-semibold text-foreground">Settings</span>
          </Link>

          {/* Help - external link */}
          <button
            onClick={handleHelpClick}
            className="w-full flex items-center gap-4 rounded-xl px-3 py-4 hover:bg-muted transition-colors"
          >
            <HelpCircle className="h-6 w-6 text-muted-foreground shrink-0" />
            <span className="text-base font-semibold text-foreground">Help</span>
          </button>
        </nav>

        {/* Log out - pushed to bottom */}
        <div className="mt-auto px-3 pt-8 pb-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 rounded-xl px-3 py-4 text-[#C4515E] hover:bg-[#C4515E]/10 transition-colors"
          >
            <LogOut className="h-6 w-6 shrink-0" />
            <span className="text-base font-semibold">Log out</span>
          </button>
        </div>
      </animated.div>
    </div>
  )
}
