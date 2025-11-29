"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-br from-background via-brand-cream/40 to-primary/10">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content (60% on desktop) */}
          <div className="lg:col-span-3 text-center lg:text-left">
            {/* Badge with stronger contrast for readability */}
            <Badge 
              variant="secondary" 
              className="mb-6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] bg-primary text-primary-foreground border-0"
            >
              AI STYLIST
            </Badge>

            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-8xl leading-[0.95] text-balance">
              Get your fit{" "}
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent underline-hand-drawn">
                checked.
              </span>
              <br />
              Dress with confidence.
            </h1>

            <p className="mt-8 text-lg leading-8 text-muted-foreground max-w-2xl lg:max-w-none text-pretty">
              Your personal AI stylist that gets you. Upload your wardrobe, get smart outfit recommendations, and never
              ask "what should I wear?" again.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start lg:justify-start gap-4">
              {/* Enhanced button hover with scale and color shift */}
              <Button 
                size="lg" 
                className="text-base px-8 py-6 w-full sm:w-auto hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-primary/90" 
                asChild
              >
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {/* Secondary button with subtle hover effects */}
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 py-6 w-full sm:w-auto bg-transparent hover:scale-[1.02] hover:border-primary/50 hover:bg-primary/5 transition-all duration-300" 
                asChild
              >
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Instant recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Privacy-first approach</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Right: App Preview Card - Prepared for GIF placeholder */}
          {/* On mobile: stacks below text. On desktop: appears on right beside headline */}
          <div className="lg:col-span-2 relative">
            {/* Enhanced glow effect with stronger shadow and subtle rotation for dynamic look */}
            <div className="relative animate-float shadow-[0_20px_60px_rgba(32,200,168,0.25)] -rotate-2">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl transform scale-95" />
              <div className="relative bg-card rounded-2xl shadow-2xl border border-border overflow-hidden hover:shadow-3xl transition-all duration-300">
                <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2 border-b border-border">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-chart-4/60" />
                    <div className="w-3 h-3 rounded-full bg-chart-2/60" />
                  </div>
                  <div className="flex-1 text-center text-sm text-muted-foreground">fitcheckz.app</div>
                </div>
                {/* PLACEHOLDER: Hero product demo GIF - upload item → AI outfit flow */}
                <div className="aspect-video bg-gradient-to-br from-secondary/50 via-primary/5 to-secondary/30 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Sparkles className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground font-medium">Product Demo GIF</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle scroll cue at bottom of hero */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground/80">
          <span>Scroll</span>
          <div className="h-8 w-px bg-muted-foreground/40 animate-[bounce_2s_infinite] rounded-full" />
        </div>
      </div>
    </section>
  )
}
