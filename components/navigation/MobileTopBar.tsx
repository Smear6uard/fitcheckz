"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function MobileTopBar({ className }: { className?: string }) {
  const { setIsDrawerOpen } = useSidebar()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const initials = user?.email?.charAt(0).toUpperCase() || "U"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 border-b border-sidebar-border bg-background/80 backdrop-blur-xl md:hidden",
        className
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        {/* Left: Avatar (drawer trigger) */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt="User" />
            <AvatarFallback className="text-sm">{initials}</AvatarFallback>
          </Avatar>
        </Button>

        {/* Center: Logo */}
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

        {/* Right: Notifications (placeholder) */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
