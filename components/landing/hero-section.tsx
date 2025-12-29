"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-[#0a0a0a]">
      {/* Background decoration - subtle teal glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Main center glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(20,184,166,0.12)_0%,transparent_50%)]" />
        {/* Secondary glow top-right */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(20,184,166,0.08)_0%,transparent_60%)]" />
        {/* Accent glow bottom-left */}
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(20,184,166,0.06)_0%,transparent_60%)]" />
        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-line-accent opacity-50" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content (60% on desktop) */}
          <div className="lg:col-span-3 text-center lg:text-left">
            <h1 className="font-sans text-5xl font-bold tracking-tight text-zinc-100 sm:text-6xl lg:text-7xl leading-[1.05] text-balance">
              Stop staring at your{" "}
              <span className="font-bold text-[#14b8a6]">closet.</span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-zinc-400 max-w-2xl lg:max-w-none text-pretty">
              Upload what you own. Get outfits that actually work. It's that simple.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start lg:justify-start gap-4">
              {/* Primary button with enhanced glow and animations */}
              <Button
                size="lg"
                className="group/btn text-base px-8 py-6 w-full sm:w-auto bg-[#14b8a6] text-zinc-950 hover:bg-[#0d9488] hover:scale-105 hover:brightness-110 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]"
                asChild
              >
                <Link href="/signup" className="flex items-center">
                  <span>Get your first outfit</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110" />
                </Link>
              </Button>
              {/* Secondary button with lively hover effects */}
              <Button
                variant="outline"
                size="lg"
                className="group/btn2 text-base px-8 py-6 w-full sm:w-auto bg-transparent border-zinc-700 text-zinc-100 hover:border-[#14b8a6] hover:bg-[rgba(20,184,166,0.1)] hover:text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all duration-300"
                asChild
              >
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Instant recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Privacy-first approach</span>
              </div>
            </div>
          </div>

          {/* Right: App Preview Card */}
          <div className="lg:col-span-2 relative group/card">
            {/* Enhanced glow effect with teal accent - animates on hover */}
            <div className="relative animate-float -rotate-2">
              <div className="absolute inset-0 bg-[rgba(20,184,166,0.15)] rounded-2xl blur-2xl transform scale-95 transition-all duration-500 group-hover/card:bg-[rgba(20,184,166,0.25)] group-hover/card:scale-100" />
              <div className="relative bg-zinc-900 rounded-2xl shadow-card border border-zinc-800 overflow-hidden transition-all duration-500 group-hover/card:shadow-[0_35px_60px_rgba(20,184,166,0.15)] group-hover/card:border-[rgba(20,184,166,0.3)]">
                <div className="bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b border-zinc-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-sm text-zinc-500">styleum.app</div>
                </div>
                {/* Product demo area */}
                <div className="aspect-video bg-gradient-to-br from-zinc-900 via-[rgba(20,184,166,0.05)] to-zinc-900 flex items-center justify-center relative overflow-hidden">
                  {/* Animated gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,184,166,0.1)] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                  <div className="text-center p-6 relative z-10">
                    <Sparkles className="h-12 w-12 text-[#14b8a6] mx-auto mb-4 animate-pulse" />
                    <p className="text-lg text-zinc-100 font-semibold">AI that actually gets your style</p>
                    <p className="text-sm text-zinc-500 mt-2">Upload your wardrobe, get personalized looks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
