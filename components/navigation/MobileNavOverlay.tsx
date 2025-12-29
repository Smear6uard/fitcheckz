"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { animated, useSpring } from "@react-spring/web"
import {
  X,
  Shirt,
  LayoutGrid,
  Wand2,
  ShoppingBag,
  User,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import { Button } from "@/components/ui/button"

const sidebarNavigation = {
  myStyle: [
    { href: "/wardrobe", icon: Shirt, label: "Wardrobe" },
    { href: "/outfits", icon: LayoutGrid, label: "Outfits" },
  ],
  discover: [
    { href: "/dashboard", icon: Wand2, label: "Get Styled" },
    { href: "/shop", icon: ShoppingBag, label: "Shopping" },
  ],
  account: [
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/subscription", icon: Crown, label: "Subscription" },
  ],
}

interface NavGroupProps {
  label: string
  items: { href: string; icon: React.ElementType; label: string }[]
  pathname: string | null
  onItemClick: () => void
}

function NavGroup({ label, items, pathname, onItemClick }: NavGroupProps) {
  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/")
  }

  return (
    <div className="space-y-2">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 relative",
                "hover:bg-sidebar-accent hover:text-sidebar-foreground",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground"
              )}
            >
              {/* Active indicator */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r transition-all duration-200",
                  active ? "bg-[#F43F5E] scale-y-100" : "scale-y-0"
                )}
              />
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-200",
                  active && "text-[#F43F5E]"
                )}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function MobileNavOverlay() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar()
  const pathname = usePathname()

  // Animation for overlay
  const overlaySpring = useSpring({
    opacity: isMobileMenuOpen ? 1 : 0,
    transform: isMobileMenuOpen ? "translateY(0%)" : "translateY(-100%)",
    config: { tension: 300, friction: 30 },
  })

  // Animation for backdrop
  const backdropSpring = useSpring({
    opacity: isMobileMenuOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
  })

  const handleClose = () => setIsMobileMenuOpen(false)

  return (
    <div
      className={cn(
        "md:hidden fixed inset-0 z-[100]",
        !isMobileMenuOpen && "pointer-events-none"
      )}
      style={{ visibility: isMobileMenuOpen ? "visible" : "hidden" }}
    >
      {/* Backdrop */}
      <animated.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ opacity: backdropSpring.opacity }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Overlay panel */}
      <animated.div
        className="fixed inset-0 z-[101] overflow-y-auto bg-background"
        style={{
          transform: overlaySpring.transform,
          opacity: overlaySpring.opacity,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={handleClose}
          >
            <Image
              src="/favicon.png"
              alt="Styleum"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="font-serif text-xl text-foreground">
              Styleum<span className="text-primary">.</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close navigation menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation groups */}
        <div className="px-4 py-6 space-y-8">
          <NavGroup
            label="My Style"
            items={sidebarNavigation.myStyle}
            pathname={pathname}
            onItemClick={handleClose}
          />
          <NavGroup
            label="Discover"
            items={sidebarNavigation.discover}
            pathname={pathname}
            onItemClick={handleClose}
          />
          <NavGroup
            label="Account"
            items={sidebarNavigation.account}
            pathname={pathname}
            onItemClick={handleClose}
          />
        </div>
      </animated.div>
    </div>
  )
}
