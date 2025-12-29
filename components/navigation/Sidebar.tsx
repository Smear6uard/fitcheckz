"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Shirt,
  Wand2,
  ShoppingBag,
  Bookmark,
  Trophy,
  Target,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

const mainNavItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/wardrobe", icon: Shirt, label: "Closet" },
  { href: "/outfits/curate", icon: Wand2, label: "Style Me", alwaysTeal: true },
  { href: "/shop", icon: ShoppingBag, label: "Shop" },
  { href: "/outfits", icon: Bookmark, label: "Saved" },
]

const secondaryNavItems = [
  { href: "/achievements", icon: Trophy, label: "Achievements", iconColor: "text-yellow-500" },
  { href: "/style-quiz", icon: Target, label: "Style Quiz", iconColor: "text-[#14b8a6]" },
]

const bottomNavItems = [
  { href: "/settings", icon: Settings, label: "Settings", iconColor: "text-[#9ca3af]" },
  { href: "/help", icon: HelpCircle, label: "Help", iconColor: "text-[#9ca3af]" },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const isActive = (href: string) => {
    if (href === "/outfits") {
      return pathname === href
    }
    return pathname === href || pathname?.startsWith(href + "/")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const NavItem = ({
    href,
    icon: Icon,
    label,
    alwaysTeal,
    iconColor
  }: {
    href: string
    icon: typeof Home
    label: string
    alwaysTeal?: boolean
    iconColor?: string
  }) => {
    const active = isActive(href)
    const showTeal = active || alwaysTeal

    return (
      <Link
        href={href}
        className={cn(
          "relative flex items-center h-12 mx-2 my-1 px-3 rounded-lg transition-colors duration-150",
          active && "bg-[rgba(20,184,166,0.1)]",
          !active && "hover:bg-[rgba(255,255,255,0.05)]"
        )}
      >
        {/* Active indicator */}
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] bg-[#14b8a6] rounded-r" />
        )}

        {/* Fixed-width icon container - prevents icon jumping */}
        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
          <Icon
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              iconColor ? iconColor : (showTeal ? "text-[#14b8a6]" : "text-[#9ca3af]")
            )}
          />
        </div>

        {/* Label with delayed fade-in */}
        <span
          className={cn(
            "ml-3 text-sm font-medium whitespace-nowrap",
            "opacity-0 group-hover/sidebar:opacity-100",
            "transition-opacity duration-200 delay-100",
            active ? "text-white" : "text-[#9ca3af]"
          )}
        >
          {label}
        </span>
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        "group/sidebar fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)]",
        "bg-[#0a0a0a] border-r border-[#1f1f1f]",
        "w-16 lg:hover:w-[200px] transition-[width] duration-300 ease-out",
        "overflow-hidden will-change-[width]",
        "flex flex-col",
        "hidden md:flex",
        className
      )}
    >
      <nav className="flex flex-col h-full py-4">
        {/* Main Navigation */}
        <div className="flex-none space-y-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mx-3 my-3" />

        {/* Secondary Navigation */}
        <div className="flex-none space-y-1">
          {secondaryNavItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="border-t border-white/10 mx-3 my-3" />

        {/* Bottom Navigation */}
        <div className="flex-none space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={cn(
              "relative flex items-center h-12 mx-2 my-1 px-3 rounded-lg transition-colors duration-150 w-[calc(100%-1rem)]",
              "hover:bg-[rgba(255,255,255,0.05)]"
            )}
          >
            {/* Fixed-width icon container */}
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
              <LogOut className="h-5 w-5 transition-colors duration-200 text-[#C4515E]" />
            </div>

            {/* Label with delayed fade-in */}
            <span
              className={cn(
                "ml-3 text-sm font-medium whitespace-nowrap text-[#C4515E]",
                "opacity-0 group-hover/sidebar:opacity-100",
                "transition-opacity duration-200 delay-100"
              )}
            >
              Log out
            </span>
          </button>
        </div>
      </nav>
    </aside>
  )
}
