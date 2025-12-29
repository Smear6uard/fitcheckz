"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Shirt,
  Wand2,
  ShoppingBag,
  Bookmark,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/wardrobe", icon: Shirt, label: "Closet" },
  { href: "/outfits/curate", icon: Wand2, label: "Style Me", alwaysTeal: true },
  { href: "/shop", icon: ShoppingBag, label: "Shop" },
  { href: "/outfits", icon: Bookmark, label: "Saved" },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/outfits") {
      // Only match /outfits exactly, not /outfits/curate
      return pathname === href
    }
    return pathname === href || pathname?.startsWith(href + "/")
  }

  return (
    <aside
      className={cn(
        "group/sidebar fixed left-0 top-0 z-40 h-screen",
        "bg-[#0a0a0a] border-r border-[#1f1f1f]",
        "w-16 lg:hover:w-[200px] transition-[width] duration-200 ease-out",
        "flex flex-col",
        "hidden md:flex",
        className
      )}
    >
      {/* Main navigation */}
      <nav className="flex-1 pt-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const showTeal = active || item.alwaysTeal

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center h-12 mx-2 my-1 rounded-lg transition-all duration-200",
                // Collapsed: center icon
                "justify-center",
                // Expanded: left-align with gap
                "group-hover/sidebar:justify-start group-hover/sidebar:gap-3 group-hover/sidebar:px-4",
                // Active state
                active && "bg-[rgba(20,184,166,0.1)]",
                // Hover state (non-active)
                !active && "hover:bg-[rgba(255,255,255,0.05)]"
              )}
            >
              {/* Active indicator - teal left border */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] bg-[#14b8a6] rounded-r" />
              )}
              <Icon
                className={cn(
                  "h-6 w-6 shrink-0 transition-colors duration-200",
                  showTeal ? "text-[#14b8a6]" : "text-[#9ca3af]"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  "opacity-0 w-0 overflow-hidden",
                  "group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto",
                  "transition-all duration-150",
                  active ? "text-white" : "text-[#9ca3af]"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="pb-4">
        <Link
          href="/settings"
          className={cn(
            "relative flex items-center h-12 mx-2 my-1 rounded-lg transition-all duration-200",
            "justify-center",
            "group-hover/sidebar:justify-start group-hover/sidebar:gap-3 group-hover/sidebar:px-4",
            isActive("/settings") && "bg-[rgba(20,184,166,0.1)]",
            !isActive("/settings") && "hover:bg-[rgba(255,255,255,0.05)]"
          )}
        >
          {isActive("/settings") && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] bg-[#14b8a6] rounded-r" />
          )}
          <Settings
            className={cn(
              "h-6 w-6 shrink-0 transition-colors duration-200",
              isActive("/settings") ? "text-[#14b8a6]" : "text-[#9ca3af]"
            )}
          />
          <span
            className={cn(
              "text-sm font-medium whitespace-nowrap",
              "opacity-0 w-0 overflow-hidden",
              "group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto",
              "transition-all duration-150",
              isActive("/settings") ? "text-white" : "text-[#9ca3af]"
            )}
          >
            Settings
          </span>
        </Link>
      </div>
    </aside>
  )
}
