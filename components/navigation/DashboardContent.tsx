"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"

interface DashboardContentProps {
  children: ReactNode
}

export function DashboardContent({ children }: DashboardContentProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen transition-[margin-left] duration-200 ease-out",
        // Desktop: offset by sidebar width
        "md:ml-60",
        // When collapsed on desktop
        isCollapsed && "md:ml-16"
      )}
    >
      {children}
    </div>
  )
}
