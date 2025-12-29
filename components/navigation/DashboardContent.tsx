"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DashboardContentProps {
  children: ReactNode
}

export function DashboardContent({ children }: DashboardContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col min-h-screen",
        // Desktop: fixed offset for collapsed sidebar (64px)
        // Sidebar expands as overlay on hover, so no dynamic margin needed
        "md:ml-16"
      )}
    >
      {children}
    </div>
  )
}
