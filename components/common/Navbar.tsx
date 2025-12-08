"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/auth/UserMenu"
import { Sparkles, LayoutDashboard, Shirt, ShirtIcon, User, CreditCard, BarChart3, Compass, ShoppingBag, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Wardrobe", href: "/wardrobe", icon: Shirt },
  { name: "Outfits", href: "/outfits", icon: ShirtIcon },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Shop", href: "/shop", icon: ShoppingBag },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const threshold = 50
      setScrolled(scrollY > threshold)
      // Calculate scroll progress (0-1) over first 100px
      setScrollProgress(Math.min(scrollY / 100, 1))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Animate navbar properties based on scroll
  const navSpring = useSpring({
    backdropBlur: scrolled ? 16 : 8,
    backgroundColor: scrolled ? "rgba(var(--background-rgb), 0.85)" : "rgba(var(--background-rgb), 0.6)",
    borderOpacity: scrolled ? 1 : 0.5,
    shadow: scrolled ? 8 : 0,
    config: { tension: 300, friction: 30 },
  })

  // Logo shrink animation
  const logoSpring = useSpring({
    scale: scrolled ? 0.9 : 1,
    config: config.gentle,
  })

  return (
    <animated.nav
      style={{
        backdropFilter: navSpring.backdropBlur.to((v) => `blur(${v}px) saturate(180%)`),
        WebkitBackdropFilter: navSpring.backdropBlur.to((v) => `blur(${v}px) saturate(180%)`),
        boxShadow: navSpring.shadow.to(
          (s) => `0 ${s / 2}px ${s}px -${s / 4}px rgba(0,0,0,0.1), 0 ${s / 4}px ${s / 2}px -${s / 4}px rgba(0,0,0,0.06)`
        ),
      }}
      className={cn(
        "sticky top-0 z-50 safe-area-top transition-colors duration-300",
        scrolled
          ? "bg-background/85 border-b border-border"
          : "bg-background/60 border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 touch-target">
              <animated.div
                style={{ scale: logoSpring.scale }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/25"
              >
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </animated.div>
              <animated.span
                style={{ scale: logoSpring.scale }}
                className="text-lg font-bold origin-left"
              >
                Fitcheckz
              </animated.span>
            </Link>
            <div className="hidden md:flex gap-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    asChild
                    className={cn(
                      "gap-2 touch-target transition-all duration-200",
                      isActive && "bg-secondary shadow-sm"
                    )}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>
          <UserMenu />
        </div>
      </div>

      {/* Subtle gradient line at bottom when scrolled */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300",
          "bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />
    </animated.nav>
  )
}

