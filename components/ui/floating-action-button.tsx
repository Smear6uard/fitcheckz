"use client"

import { useState, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { animated, useSpring, useTrail, config } from "@react-spring/web"
import { Sparkles, Plus, Camera, Shirt, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { haptics } from "@/lib/haptics"

interface FABAction {
  icon: React.ElementType
  label: string
  href?: string
  onClick?: () => void
  color?: string
}

const defaultActions: FABAction[] = [
  {
    icon: Sparkles,
    label: "Curate Outfit",
    href: "/outfits",
    color: "bg-primary text-primary-foreground",
  },
  {
    icon: Shirt,
    label: "Add Item",
    href: "/wardrobe?action=add",
    color: "bg-primary text-primary-foreground",
  },
]

interface FloatingActionButtonProps {
  className?: string
}

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide FAB on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY && currentScrollY > 100

      setIsVisible(!scrollingDown)
      setLastScrollY(currentScrollY)

      // Close menu on scroll
      if (isOpen && Math.abs(currentScrollY - lastScrollY) > 20) {
        setIsOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, isOpen])

  // Close on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Context-aware primary action
  const getPrimaryAction = useCallback((): FABAction => {
    if (pathname?.startsWith("/wardrobe")) {
      return {
        icon: Shirt,
        label: "Add Item",
        href: "/wardrobe?action=add",
        color: "bg-primary",
      }
    }
    return {
      icon: Sparkles,
      label: "Curate Outfit",
      href: "/outfits",
      color: "bg-primary",
    }
  }, [pathname])

  // Main FAB animation
  const fabSpring = useSpring({
    scale: isVisible ? 1 : 0,
    y: isVisible ? 0 : 100,
    rotate: isOpen ? 45 : 0,
    config: { tension: 300, friction: 20 },
  })

  // Backdrop animation
  const backdropSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: config.gentle,
  })

  // Action buttons trail animation
  const actionTrail = useTrail(defaultActions.length, {
    opacity: isOpen ? 1 : 0,
    y: isOpen ? 0 : 20,
    scale: isOpen ? 1 : 0.8,
    config: { tension: 400, friction: 20 },
  })

  const handleToggle = () => {
    haptics.medium()
    setIsOpen(!isOpen)
  }

  const handleAction = (action: FABAction) => {
    haptics.selection()
    setIsOpen(false)
    if (action.href) {
      router.push(action.href)
    } else if (action.onClick) {
      action.onClick()
    }
  }

  const primaryAction = getPrimaryAction()
  const PrimaryIcon = primaryAction.icon

  // Don't show on certain pages
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/outfits")  // Outfits page has its own CTAs in the feed
  ) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <animated.div
          style={{ opacity: backdropSpring.opacity }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container */}
      <div
        className={cn(
          "fixed bottom-20 right-4 z-50 flex flex-col-reverse items-end gap-3 md:hidden",
          className
        )}
      >
        {/* Action buttons */}
        {actionTrail.map((style, index) => {
          const action = defaultActions[index]
          const Icon = action.icon
          return (
            <animated.button
              key={action.label}
              style={{
                opacity: style.opacity,
                y: style.y,
                scale: style.scale,
              }}
              onClick={() => handleAction(action)}
              className={cn(
                "flex items-center gap-3 pl-4 pr-5 py-3 rounded-full shadow-lg",
                "bg-card border text-foreground",
                "active:scale-95 transition-transform",
                !isOpen && "pointer-events-none"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  action.color || "bg-primary"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>
            </animated.button>
          )
        })}

        {/* Main FAB */}
        <animated.button
          style={{
            scale: fabSpring.scale,
            y: fabSpring.y,
          }}
          onClick={handleToggle}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "shadow-lg shadow-primary/25",
            "active:scale-95 transition-colors",
            isOpen
              ? "bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          <animated.div style={{ rotate: fabSpring.rotate }}>
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </animated.div>
        </animated.button>
      </div>
    </>
  )
}
