"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Shirt,
  LayoutGrid,
  Wand2,
  ShoppingBag,
  User,
  Crown,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import { SidebarNavGroup } from "./SidebarNavGroup"
import { SidebarNavItem } from "./SidebarNavItem"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const sidebarNavigation = {
  myStyle: [
    { href: "/wardrobe", icon: Shirt, label: "Wardrobe" },
    { href: "/outfits", icon: LayoutGrid, label: "Outfits" },
  ],
  discover: [
    { href: "/dashboard", icon: Wand2, label: "Get Styled" },
    { href: "/shop", icon: ShoppingBag, label: "Shopping" },
  ],
  account: [
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/subscription", icon: Crown, label: "Subscription" },
  ],
}

export function Sidebar({ className }: { className?: string }) {
  const { isCollapsed, toggleSidebar, isHydrated } = useSidebar()
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar",
        "flex flex-col transition-[width] duration-200 ease-out",
        isCollapsed ? "w-16" : "w-60",
        className
      )}
    >
      {/* Logo section */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/favicon.png"
            alt="Styleum"
            width={32}
            height={32}
            className="rounded-md shrink-0"
          />
          <span
            className={cn(
              "font-serif text-lg text-sidebar-foreground transition-all duration-200 whitespace-nowrap",
              isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            )}
          >
            Styleum<span className="text-primary">.</span>
          </span>
        </Link>
      </div>

      {/* Navigation groups - scrollable */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <SidebarNavGroup label="My Style">
          {sidebarNavigation.myStyle.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
        </SidebarNavGroup>

        <SidebarNavGroup label="Discover">
          {sidebarNavigation.discover.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
        </SidebarNavGroup>

        <SidebarNavGroup label="Account">
          {sidebarNavigation.account.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
        </SidebarNavGroup>
      </div>

      {/* Collapse toggle - fixed at bottom */}
      <div className="border-t border-sidebar-border p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                "w-full h-10 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
                isCollapsed && "w-10 mx-auto"
              )}
            >
              {isCollapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <div className="flex items-center gap-2 w-full justify-start px-2">
                  <PanelLeftClose className="h-5 w-5" />
                  <span className="text-sm">Collapse</span>
                </div>
              )}
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" sideOffset={8}>
              Expand sidebar
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  )
}
