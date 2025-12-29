"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "styleum_sidebar_collapsed_v1"

export function useSidebarState() {
  const [isCollapsed, setIsCollapsedState] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        setIsCollapsedState(JSON.parse(stored))
      }
    } catch (error) {
      console.warn("Failed to read sidebar state:", error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Persist changes to localStorage
  const setIsCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsedState(collapsed)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed))
    } catch (error) {
      console.warn("Failed to save sidebar state:", error)
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed, setIsCollapsed])

  return {
    isCollapsed,
    setIsCollapsed,
    toggleSidebar,
    isHydrated,
  }
}
