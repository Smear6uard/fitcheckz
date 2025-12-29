"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { animated, useSpring } from "@react-spring/web"
import {
  ShoppingBag,
  Crown,
  Settings,
  HelpCircle,
  LogOut,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

const primaryMenuItems = [
  { href: "/shop", icon: ShoppingBag, label: "Shopping" },
  { href: "/subscription", icon: Crown, label: "Subscription" },
]

const secondaryMenuItems = [
  { href: "/settings", icon: Settings, label: "Settings" },
]

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

  const initials = user?.email?.charAt(0).toUpperCase() || "U"
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || "User"

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

      {/* Drawer panel */}
      <animated.div
        className="fixed inset-y-0 left-0 z-[101] w-72 overflow-y-auto bg-background border-r border-sidebar-border"
        style={{
          transform: drawerSpring.x.to((x) => `translateX(${x}%)`),
        }}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-end p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User profile section with gradient background */}
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center gap-4 p-4 pt-0 pb-5 text-left group relative"
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <Avatar className="h-16 w-16 ring-2 ring-primary/20 relative">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
            <AvatarFallback className="text-xl bg-primary/10">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 relative">
            <p className="font-semibold text-foreground truncate text-lg">{displayName}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.itemCount} items • {stats.outfitCount} outfits
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors relative" />
        </button>

        {/* Upgrade prompt for free tier */}
        {!isPro && (
          <div className="px-4 pb-4">
            <Link
              href="/subscription"
              onClick={handleClose}
              className="block p-3 rounded-lg border border-[#C4515E]/30 bg-[#C4515E]/5 hover:bg-[#C4515E]/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C4515E]/10">
                  <Sparkles className="h-4 w-4 text-[#C4515E]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">Upgrade to Pro</p>
                  <p className="text-xs text-muted-foreground">Unlock unlimited styling</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#C4515E]" />
              </div>
            </Link>
          </div>
        )}

        <Separator />

        {/* Primary menu items */}
        <nav className="p-2">
          {primaryMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <Separator className="mx-4" />

        {/* Secondary menu items */}
        <nav className="p-2">
          {secondaryMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Help - external link */}
          <button
            onClick={handleHelpClick}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <HelpCircle className="h-5 w-5 shrink-0" />
            <span>Help</span>
          </button>
        </nav>

        <Separator className="mx-4" />

        {/* Log out */}
        <div className="p-2">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-[#C4515E] hover:bg-[#C4515E]/10 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </animated.div>
    </div>
  )
}
