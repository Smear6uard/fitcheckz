"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { animated, useSpring } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { UserMenu } from "@/components/auth/UserMenu"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  // Mobile menu animation - slide from right
  const menuSpring = useSpring({
    x: mobileMenuOpen ? 0 : 100,
    backdropOpacity: mobileMenuOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 -m-1.5 p-1.5">
            <Image
              src="/favicon.png"
              alt="Styleum"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="font-sans text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
              Styleum<span className="text-cyan-400">.</span>
            </span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Navbar links with smooth hover transitions */}
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

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <UserMenu />
        </div>
      </nav>

      {/* Mobile menu - Always rendered for smooth animations */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-[100]",
          !mobileMenuOpen && "pointer-events-none"
        )}
        style={{ visibility: mobileMenuOpen ? "visible" : "hidden" }}
      >
        {/* Backdrop */}
        <animated.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          style={{ opacity: menuSpring.backdropOpacity }}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        {/* Slide-in panel */}
        <animated.div
          className="fixed inset-y-0 right-0 z-[101] w-full overflow-y-auto bg-zinc-950 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10"
          style={{
            transform: menuSpring.x.to((x) => `translateX(${x}%)`),
          }}
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 -m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                src="/favicon.png"
                alt="Styleum"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="font-sans text-xl font-bold text-zinc-100 tracking-tight">
                Styleum<span className="text-cyan-400">.</span>
              </span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold text-white hover:bg-white/5 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-white/20 text-white hover:bg-white/5"
                  asChild
                >
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </animated.div>
      </div>
    </header>
  )
}
