"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#0f0708]">
      {/* Background decoration - bolder radial cherry glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Main center glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(196,81,94,0.25)_0%,transparent_50%)]" />
        {/* Secondary glow top-right */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(196,81,94,0.15)_0%,transparent_60%)]" />
        {/* Accent glow bottom-left */}
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(196,81,94,0.1)_0%,transparent_60%)]" />
        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-line-accent opacity-50" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content (60% on desktop) */}
          <div className="lg:col-span-3 text-center lg:text-left">
            {/* Badge with accent border */}
            <span className="inline-flex mb-6 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary border border-primary/30 rounded-full bg-primary/10">
              AI Stylist
            </span>

            <h1 className="font-serif text-5xl font-normal tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05] text-balance">
              Your wardrobe,{" "}
              <span className="italic text-primary">elevated.</span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-[#8A8A8A] max-w-2xl lg:max-w-none text-pretty">
              Your personal AI stylist that gets you. Upload your wardrobe, get smart outfit recommendations, and never
              ask "what should I wear?" again.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start lg:justify-start gap-4">
              {/* Primary button with enhanced glow and animations */}
              <Button
                size="lg"
                className="group/btn text-base px-8 py-6 w-full sm:w-auto bg-primary text-white hover:bg-primary/90 hover:scale-105 hover:brightness-110 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(196,81,94,0.5)] hover:shadow-primary/50"
                asChild
              >
                <Link href="/signup" className="flex items-center">
                  <span>Start Free Trial</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110" />
                </Link>
              </Button>
              {/* Secondary button with lively hover effects */}
              <Button
                variant="outline"
                size="lg"
                className="group/btn2 text-base px-8 py-6 w-full sm:w-auto bg-transparent border-[#2A2A2A] text-white hover:border-primary hover:bg-primary/10 hover:text-primary hover:scale-105 hover:shadow-[0_0_20px_rgba(196,81,94,0.3)] transition-all duration-300"
                asChild
              >
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-[#8A8A8A]">
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
            {/* Enhanced glow effect with cherry accent - animates on hover */}
            <div className="relative animate-float -rotate-2">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl transform scale-95 transition-all duration-500 group-hover/card:bg-primary/35 group-hover/card:scale-100" />
              <div className="relative bg-[#141414] rounded-2xl shadow-card border border-[#2A2A2A] overflow-hidden transition-all duration-500 group-hover/card:shadow-[0_35px_60px_rgba(196,81,94,0.25)] group-hover/card:border-primary/30">
                <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-2 border-b border-[#2A2A2A]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#C45C5C]" />
                    <div className="w-3 h-3 rounded-full bg-[#8A8A8A]" />
                    <div className="w-3 h-3 rounded-full bg-[#4A9F7E]" />
                  </div>
                  <div className="flex-1 text-center text-sm text-[#8A8A8A]">styleum.app</div>
                </div>
                {/* Product demo area */}
                <div className="aspect-video bg-gradient-to-br from-[#1A1A1A] via-primary/5 to-[#141414] flex items-center justify-center relative overflow-hidden">
                  {/* Animated gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                  <div className="text-center p-6 relative z-10">
                    <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                    <p className="text-lg text-white font-semibold">AI-Powered Outfit Matching</p>
                    <p className="text-sm text-[#8A8A8A] mt-2">Upload your wardrobe, get personalized looks</p>
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
