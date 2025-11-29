"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/auth/UserMenu"
import { Sparkles, LayoutDashboard, Shirt, ShirtIcon, User, CreditCard, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Wardrobe", href: "/wardrobe", icon: Shirt },
  { name: "Outfits", href: "/outfits", icon: ShirtIcon },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Subscription", href: "/subscription", icon: CreditCard },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Fitcheckz</span>
            </Link>
            <div className="hidden md:flex gap-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    asChild
                    className={cn(
                      "gap-2",
                      isActive && "bg-secondary"
                    )}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}

