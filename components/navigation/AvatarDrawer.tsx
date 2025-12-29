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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

const menuItems = [
  { href: "/shop", icon: ShoppingBag, label: "Shopping" },
  { href: "/subscription", icon: Crown, label: "Subscription" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function AvatarDrawer() {
  const router = useRouter()
  const { isDrawerOpen, setIsDrawerOpen } = useSidebar()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
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
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <span className="font-serif text-lg text-foreground">
            Menu
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User profile section */}
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center gap-3 p-4 hover:bg-sidebar-accent transition-colors text-left"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{displayName}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
        </button>

        <Separator />

        {/* Menu items */}
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Help - external link */}
          <button
            onClick={handleHelpClick}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-5 w-5 shrink-0" />
            <span>Help</span>
          </button>
        </nav>

        <Separator />

        {/* Log out */}
        <div className="p-2">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </animated.div>
    </div>
  )
}
