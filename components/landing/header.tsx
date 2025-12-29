"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { animated, useSpring } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { UserMenu } from "@/components/auth/UserMenu"

const navigation = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Dropdown animation - fade + slide down
  const menuSpring = useSpring({
    opacity: mobileMenuOpen ? 1 : 0,
    y: mobileMenuOpen ? 0 : -8,
    config: { tension: 300, friction: 26 },
  })

  // Simple inline scroll handler that accounts for fixed header
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)

    if (element) {
      const headerOffset = 80 // Fixed header height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerOffset

      // Respect reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      })
    }

    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/favicon.png"
                alt="Styleum"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="font-sans text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
                Styleum<span className="text-[#14b8a6]">.</span>
              </span>
            </Link>

            {/* Desktop nav - centered */}
            <div className="hidden lg:flex lg:gap-x-10">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Right side - CTA + mobile menu button */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex">
                <UserMenu />
              </div>
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile dropdown menu */}
        <animated.div
          className="lg:hidden overflow-hidden"
          style={{
            opacity: menuSpring.opacity,
            transform: menuSpring.y.to((y) => `translateY(${y}px)`),
            height: mobileMenuOpen ? 'auto' : 0,
            pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          }}
        >
          <div className="bg-[#0f0f0f] border-t border-white/10 p-6 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block px-4 py-3 text-base font-medium text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                {item.name}
              </a>
            ))}

            {/* Divider */}
            <div className="border-t border-white/10 my-4" />

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-transparent border-white/20 text-white hover:bg-white/5"
                asChild
              >
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button
                className="w-full bg-[#14b8a6] hover:bg-[#0d9488] text-white"
                asChild
              >
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Try it free →
                </Link>
              </Button>
            </div>
          </div>
        </animated.div>
      </header>
    </>
  )
}
