"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"

interface SidebarNavGroupProps {
  label: string
  children: ReactNode
}

export function SidebarNavGroup({ label, children }: SidebarNavGroupProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="space-y-1">
      {/* Group label - hidden when collapsed */}
      <div
        className={cn(
          "px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-200",
          isCollapsed ? "opacity-0 h-0 overflow-hidden py-0" : "opacity-100"
        )}
      >
        {label}
      </div>
      {/* Nav items */}
      <nav className="space-y-0.5">{children}</nav>
    </div>
  )
}
