"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

const navigation = [
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.getElementById(href.replace('#', ''))
      if (element) {
        const offset = 112
        const position = element.getBoundingClientRect().top + window.pageYOffset - offset
        window.scrollTo({ top: position, behavior: 'smooth' })
      }
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Gradient background - more sophisticated than flat color */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1512] to-[#1A1512]/95 backdrop-blur-md" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <nav className="flex h-28 items-center justify-between">
            
            {/* Logo - Large and proud */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/favicon.png"
                  alt="Styleum"
                  width={44}
                  height={44}
                  className="rounded-xl transition-transform group-hover:scale-105"
                />
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-xl bg-[#C4515E]/0 group-hover:bg-[#C4515E]/20 transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white tracking-tight leading-none">
                  Styleum<span className="text-[#C4515E]">.</span>
                </span>
                <span className="text-[10px] text-white/40 font-medium tracking-wide">
                  OUTFIT PICKS AT 7AM
                </span>
              </div>
            </Link>

            {/* Desktop nav - centered feel */}
            <div className="hidden lg:flex lg:items-center lg:gap-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="relative text-sm font-medium text-white/50 hover:text-white transition-colors py-2 group"
                >
                  {item.name}
                  {/* Underline on hover */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4515E] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Right side - CTA cluster */}
            <div className="hidden lg:flex lg:items-center lg:gap-4">
              {/* Sign in - text link */}
              <Link
                href="/login"
                className="text-sm font-medium text-white/50 hover:text-white transition-colors px-3 py-2"
              >
                Sign in
              </Link>
              
              {/* Primary CTA - pill with 7AM badge */}
              <Link
                href="/signup"
                className="group flex items-center gap-2 bg-[#C4515E] hover:bg-[#B34452] text-white font-semibold pl-3 pr-5 py-3 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-[#C4515E]/25"
              >
                {/* 7AM badge */}
                <span className="flex items-center justify-center w-10 h-6 font-mono text-xs bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                  7AM
                </span>
                <span>Get started</span>
                <svg 
                  className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>
        </div>

        {/* Bottom border - subtle */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </header>

      {/* Mobile menu - slides down */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-28 left-0 right-0 z-50 bg-[#1A1512] border-b border-white/10 shadow-2xl">
          <div className="px-6 py-6 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block py-4 text-lg font-medium text-white/70 hover:text-white hover:pl-2 transition-all border-b border-white/5"
              >
                {item.name}
              </a>
            ))}
            
            <div className="pt-6 space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 text-base font-medium text-white/70 border border-white/20 rounded-full hover:bg-white/5 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-[#C4515E] text-white font-semibold py-4 rounded-full text-base"
              >
                <span className="font-mono text-sm bg-white/20 px-2.5 py-1 rounded-md">7AM</span>
                <span>Get started</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
