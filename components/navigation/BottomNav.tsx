'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Shirt, LayoutGrid, User, Wand2 } from 'lucide-react'
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
    label: 'Wardrobe',
    icon: Shirt,
    isCenter: false,
  },
  {
    href: '/dashboard',
    label: 'Get Styled',
    icon: Wand2,
    isCenter: true,
  },
  {
    href: '/outfits',
    label: 'Outfits',
    icon: LayoutGrid,
    isCenter: false,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
    isCenter: false,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-[#2A2A2A] md:hidden safe-area-bottom">
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
                    "bg-[#C4515E] shadow-lg",
                    "transition-transform active:scale-95"
                  )}
                  style={{
                    boxShadow: '0 4px 12px rgba(196, 81, 94, 0.4)',
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-medium text-[#C4515E] mt-1">{item.label}</span>
              </Link>
            )
          }

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
