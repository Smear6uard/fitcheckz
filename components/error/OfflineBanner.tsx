"use client"

import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus"
import { WifiOff } from "lucide-react"

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground">
      <div className="container flex items-center justify-center gap-2 py-2 text-sm font-medium">
        <WifiOff className="h-4 w-4" />
        <span>You're offline. Some features may not be available.</span>
      </div>
    </div>
  )
}
