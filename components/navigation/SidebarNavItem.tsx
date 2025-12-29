"use client"

import Link from "next/link"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarNavItemProps {
  href: string
  icon: LucideIcon
  label: string
  isActive?: boolean
}

export function SidebarNavItem({ href, icon: Icon, label, isActive }: SidebarNavItemProps) {
  const { isCollapsed } = useSidebar()

  const linkContent = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "hover:bg-sidebar-accent hover:text-sidebar-foreground",
        isActive
          ? "bg-sidebar-accent text-sidebar-foreground"
          : "text-muted-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      {/* Active indicator - cherry red left border */}
      <span
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r transition-all duration-200",
          isActive ? "bg-[#F43F5E] scale-y-100" : "scale-y-0"
        )}
      />
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-colors duration-200",
          isActive && "text-[#F43F5E]"
        )}
      />
      <span
        className={cn(
          "transition-all duration-200 whitespace-nowrap",
          isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
        )}
      >
        {label}
      </span>
    </Link>
  )

  // Show tooltip when collapsed
  if (isCollapsed) {
    return (
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {label}
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }

  return <div className="relative">{linkContent}</div>
}
