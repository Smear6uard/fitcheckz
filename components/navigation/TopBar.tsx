"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/auth/UserMenu"
import { MobileTopBar } from "./MobileTopBar"
import { useSubscription } from "@/lib/hooks/useSubscription"

export function TopBar({ className }: { className?: string }) {
  const { isPro, loading } = useSubscription()

  return (
    <>
      {/* Mobile top bar with avatar drawer trigger */}
      <MobileTopBar />

      {/* Desktop top bar - logo left, avatar right */}
      <header
        className={cn(
          "sticky top-0 z-50 h-14 border-b border-border bg-background",
          "hidden md:flex items-center justify-between px-4",
          className
        )}
      >
        {/* Left side - logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
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

        {/* Right side - upgrade button + user menu */}
        <div className="flex items-center gap-3">
          {/* Upgrade button - only show for free users */}
          {!loading && !isPro && (
            <Link
              href="/subscription"
              className="px-3 py-1.5 rounded-full border border-[#C4515E] text-[#C4515E] text-sm font-medium hover:bg-[rgba(196,81,94,0.1)] transition-colors"
            >
              Upgrade
            </Link>
          )}
          <UserMenu />
        </div>
      </header>
    </>
  )
}
