"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

/**
 * Hook to detect online/offline status and notify users
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Initialize with current status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      toast.success("You're back online", {
        description: "Your connection has been restored",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error("You're offline", {
        description: "Please check your internet connection",
        duration: Infinity, // Keep showing until back online
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOnline
}
