"use client"

import Link from "next/link"
import { Sparkles, Twitter, Instagram } from "lucide-react"
import type React from "react"

const footerNavigation = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "How It Works", href: "#how-it-works" },
  ],
  support: [
    { name: "Contact", href: "mailto:hello@fitcheckz.com" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
  social: [
    { name: "Twitter", href: "https://twitter.com/fitcheckz" },
    { name: "Instagram", href: "https://instagram.com/fitcheckz" },
    { name: "TikTok", href: "https://tiktok.com/@fitcheckz" },
  ],
}

export function Footer() {
  const socialIcons: Record<string, React.ReactNode> = {
    Twitter: <Twitter className="h-4 w-4" />,
    Instagram: <Instagram className="h-4 w-4" />,
    TikTok: <Sparkles className="h-4 w-4" />, // Using Sparkles as TikTok icon placeholder
  }

  return (
    <footer className="bg-card border-t border-border relative">
      {/* Subtle gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary group-hover:scale-110 transition-transform">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">FitCheckz</span>
            </Link>
            <p className="text-sm leading-6 text-muted-foreground max-w-xs">
              Your personal AI stylist that works with your real wardrobe.
            </p>
            <div className="flex gap-3">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-muted-foreground hover:scale-110 transition-all duration-300"
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
              <h3 className="text-sm font-semibold text-foreground tracking-wide">Product</h3>
              <ul className="mt-6 space-y-3">
                {footerNavigation.product.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wide">Support</h3>
              <ul className="mt-6 space-y-3">
                {footerNavigation.support.map((item) => (
                  <li key={item.name}>
                    {item.href.startsWith("mailto:") ? (
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="mt-16 border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Made for style-seekers everywhere
            </p>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} FitCheckz. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
