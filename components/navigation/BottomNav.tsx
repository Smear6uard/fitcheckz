'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Shirt, ShoppingBag, Wand2, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: Home,
    isCenter: false,
  },
  {
    href: '/wardrobe',
    label: 'Closet',
    icon: Shirt,
    isCenter: false,
  },
  {
    href: '/outfits/curate',
    label: 'Style Me',
    icon: Wand2,
    isCenter: true,
  },
  {
    href: '/shop',
    label: 'Shop',
    icon: ShoppingBag,
    isCenter: false,
  },
  {
    href: '/outfits',
    label: 'Saved',
    icon: Bookmark,
    isCenter: false,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 relative">
        {navItems.map((item, index) => {
          const isActive = !item.isCenter && pathname.startsWith(item.href)
          const Icon = item.icon

          // Center elevated button
          if (item.isCenter) {
            return (
              <Link
                key={`center-${index}`}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-full",
                    "bg-primary shadow-lg",
                    "transition-transform active:scale-95"
                  )}
                  style={{
                    boxShadow: '0 4px 12px rgba(196, 81, 94, 0.4)',
                  }}
                >
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-medium text-primary mt-1">{item.label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-3 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
