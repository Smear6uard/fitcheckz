"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import { UserMenu } from "@/components/auth/UserMenu"
import { Button } from "@/components/ui/button"

export function TopBar({ className }: { className?: string }) {
  const { isCollapsed, setIsMobileMenuOpen } = useSidebar()

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 border-b border-sidebar-border bg-background/80 backdrop-blur-xl",
        "transition-[margin-left] duration-200 ease-out",
        className
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        {/* Mobile: Hamburger + Logo | Desktop: Empty (logo in sidebar) */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 md:hidden">
            <Image
              src="/favicon.png"
              alt="Styleum"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="font-serif text-lg text-foreground">
              Styleum<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        {/* Right side - user menu */}
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
