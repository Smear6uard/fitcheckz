"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSidebarState } from "@/lib/hooks/useSidebarState"
import { useIsTablet, useIsMobile } from "@/lib/hooks/useMediaQuery"

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  isHydrated: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const { isCollapsed, setIsCollapsed, toggleSidebar, isHydrated } = useSidebarState()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isTablet = useIsTablet()
  const isMobile = useIsMobile()

  // Auto-collapse on tablet, respect user preference on desktop
  useEffect(() => {
    if (isHydrated && isTablet) {
      setIsCollapsed(true)
    }
  }, [isTablet, isHydrated, setIsCollapsed])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isMobileMenuOpen])

  // Close mobile menu when viewport becomes desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile, isMobileMenuOpen])

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isHydrated,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
