'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Shirt, Sparkles, User, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/wardrobe',
    label: 'Wardrobe',
    icon: Shirt,
  },
  {
    href: '/outfits',
    label: 'Outfits',
    icon: Sparkles,
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: Compass,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-[#2A2A2A] md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-3 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-[#8A8A8A] hover:text-white'
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
