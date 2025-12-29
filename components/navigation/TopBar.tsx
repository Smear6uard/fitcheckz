"use client"

import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/auth/UserMenu"
import { MobileTopBar } from "./MobileTopBar"

export function TopBar({ className }: { className?: string }) {
  return (
    <>
      {/* Mobile top bar with avatar drawer trigger */}
      <MobileTopBar />

      {/* Desktop top bar - minimal, just user menu on right */}
      <header
        className={cn(
          "sticky top-0 z-50 h-14 border-b border-sidebar-border bg-background/80 backdrop-blur-xl",
          "transition-[margin-left] duration-200 ease-out",
          "hidden md:block",
          className
        )}
      >
        <div className="flex h-full items-center justify-end px-4">
          {/* Right side - user menu */}
          <div className="flex items-center gap-3">
            <UserMenu />
          </div>
        </div>
      </header>
    </>
  )
}
