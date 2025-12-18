"use client"

import Link from "next/link"
import { Twitter, Instagram } from "lucide-react"
import type React from "react"

const footerNavigation = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "How It Works", href: "#how-it-works" },
  ],
  support: [
    { name: "Contact", href: "mailto:hello@styleum.app" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
  social: [
    { name: "Twitter", href: "https://twitter.com/styleumapp" },
    { name: "Instagram", href: "https://instagram.com/styleumapp" },
    { name: "TikTok", href: "https://tiktok.com/@styleumapp" },
  ],
}

// Simple TikTok icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  )
}

export function Footer() {
  const socialIcons: Record<string, React.ReactNode> = {
    Twitter: <Twitter className="h-4 w-4" />,
    Instagram: <Instagram className="h-4 w-4" />,
    TikTok: <TikTokIcon className="h-4 w-4" />,
  }

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A] relative">
      {/* Subtle gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-line-accent opacity-30" />

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          <div className="space-y-6">
            {/* Styleum logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-serif text-xl text-white tracking-tight">
                Styleum<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-sm leading-6 text-[#8A8A8A] max-w-xs">
              Your personal AI stylist that works with your real wardrobe.
            </p>
            <div className="flex gap-3">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#2A2A2A] hover:bg-primary text-[#8A8A8A] hover:text-white hover:scale-110 transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  {socialIcons[item.name] || <span className="text-xs">{item.name[0]}</span>}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">Product</h3>
              <ul className="mt-6 space-y-3">
                {footerNavigation.product.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#8A8A8A] hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">Support</h3>
              <ul className="mt-6 space-y-3">
                {footerNavigation.support.map((item) => (
                  <li key={item.name}>
                    {item.href.startsWith("mailto:") ? (
                      <a
                        href={item.href}
                        className="text-sm text-[#8A8A8A] hover:text-primary transition-colors"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-[#8A8A8A] hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-[#2A2A2A] pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#8A8A8A]">
              Made for style-seekers everywhere
            </p>
            <p className="text-xs text-[#8A8A8A]">
              &copy; {new Date().getFullYear()} Sameer Studios LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
