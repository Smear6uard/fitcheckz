"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/auth/UserMenu"
import { MobileTopBar } from "./MobileTopBar"

export function TopBar({ className }: { className?: string }) {
  return (
    <>
      {/* Mobile top bar with avatar drawer trigger */}
      <MobileTopBar />

      {/* Desktop top bar - logo left, avatar right */}
      <header
        className={cn(
          "sticky top-0 z-50 h-14 border-b border-[#1f1f1f] bg-[#0f0f0f]",
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
          <span className="font-serif text-lg text-white">
            Styleum<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Right side - user menu */}
        <UserMenu />
      </header>
    </>
  )
}
