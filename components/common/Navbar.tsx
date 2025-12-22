"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/auth/UserMenu"
import { LayoutDashboard, Shirt, ShirtIcon, User, CreditCard, BarChart3, Compass, ShoppingBag, Trophy, Menu, X } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

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
    shadow: scrolled ? 8 : 0,
    config: { tension: 300, friction: 30 },
  })

  // Logo shrink animation
  const logoSpring = useSpring({
    scale: scrolled ? 0.9 : 1,
    config: config.gentle,
  })

  // Mobile menu animation - slide from right
  const menuSpring = useSpring({
    x: mobileMenuOpen ? 0 : 400, // Slide from right (ensure fully off-screen, max-w-sm = 384px)
    opacity: mobileMenuOpen ? 1 : 0,
    backdropOpacity: mobileMenuOpen ? 1 : 0,
    config: { tension: 250, friction: 25 },
    immediate: false, // Allow smooth transitions
  })

  return (
    <animated.nav
      style={{
        backdropFilter: navSpring.backdropBlur.to((v) => `blur(${v}px) saturate(180%)`),
        WebkitBackdropFilter: navSpring.backdropBlur.to((v) => `blur(${v}px) saturate(180%)`),
        boxShadow: navSpring.shadow.to(
          (s) => `0 ${s / 2}px ${s}px -${s / 4}px rgba(0,0,0,0.3), 0 ${s / 4}px ${s / 2}px -${s / 4}px rgba(0,0,0,0.2)`
        ),
      }}
      className={cn(
        "sticky top-0 z-[95] safe-area-top transition-colors duration-300",
        scrolled
          ? "bg-[#0A0A0A]/85 border-b border-[#2A2A2A]"
          : "bg-[#0A0A0A]/60 border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Styleum logo */}
            <Link href="/" className="flex items-center gap-2 touch-target">
              <animated.div
                style={{ scale: logoSpring.scale }}
                className="flex items-center gap-2 origin-left"
              >
                <Image
                  src="/favicon.png"
                  alt="Styleum"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <span className="font-serif text-lg text-white">
                  Styleum<span className="text-primary">.</span>
                </span>
              </animated.div>
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
                      isActive && "bg-[#1A1A1A] text-white"
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
          <div className="flex items-center gap-4">
            <div className="flex md:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-[#1A1A1A] transition-colors touch-target"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">{mobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Subtle gradient line at bottom when scrolled */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300",
          "bg-gradient-to-r from-transparent via-primary/50 to-transparent",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Mobile menu - Always rendered for smooth animations */}
      <animated.div
        className={cn(
          "md:hidden fixed inset-0 z-[100]",
          !mobileMenuOpen && "pointer-events-none"
        )}
        style={{
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Backdrop */}
        <animated.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          style={{
            opacity: menuSpring.backdropOpacity,
          }}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        {/* Menu Panel */}
        <animated.div
          className="fixed inset-y-0 right-0 z-[101] w-full max-w-sm overflow-y-auto bg-[#0A0A0A] shadow-xl"
          style={{
            transform: menuSpring.x.to((x) => `translateX(${x}px)`),
            opacity: menuSpring.opacity,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="flex items-center gap-2 -m-1.5 p-1.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  src="/favicon.png"
                  alt="Styleum"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <span className="font-serif text-xl text-white">
                  Styleum<span className="text-primary">.</span>
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white hover:bg-[#1A1A1A] transition-colors touch-target"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold transition-colors touch-target",
                      isActive
                        ? "bg-[#1A1A1A] text-white"
                        : "text-[#8A8A8A] hover:bg-[#1A1A1A] hover:text-white active:bg-[#2A2A2A]"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </animated.div>
      </animated.div>
    </animated.nav>
  )
}
