"use client"

import { Sparkles, Camera, Palette, Calendar, TrendingUp, Lock } from "lucide-react"
import { ScrollReveal } from "@/components/common/ScrollReveal"

const features = [
  {
    name: "AI Style Analysis",
    description:
      "Analyzes your actual wardrobe items for color, fit, and style compatibility. Learns your preferences from what you wear.",
    icon: Sparkles,
  },
  {
    name: "Digital Wardrobe",
    description: "Upload photos of clothes you actually own. Organize by category, color, and occasion. Your real closet, digitized.",
    icon: Camera,
  },
  {
    name: "Color Coordination",
    description: "Matches colors based on your skin tone and color theory. Suggests combinations that work with your existing pieces.",
    icon: Palette,
  },
  {
    name: "Occasion Planning",
    description: "Get outfit suggestions for specific events, weather, and times of day. From work meetings to weekend brunch.",
    icon: Calendar,
  },
  {
    name: "Style Evolution",
    description: "Tracks which outfits you actually wear. Learns your style patterns and suggests new directions to explore.",
    icon: TrendingUp,
  },
  {
    name: "Privacy First",
    description: "Your photos and data are encrypted and stored securely. We never share or sell your wardrobe information.",
    icon: Lock,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 lg:py-20 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 relative">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(34,211,238,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative">
        {/* Left-aligned heading */}
        <div className="max-w-4xl text-left mb-16">
          <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.15em] mb-3">FEATURES</h2>
          <p className="mt-2 font-sans text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl leading-tight text-balance">
            Your actual clothes.{" "}
            <span className="relative inline-block">
              <span className="text-cyan-400">Actual fits.</span>
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full opacity-90" />
            </span>
          </p>
          <p className="mt-4 text-base leading-7 text-zinc-400 max-w-xl">
            Your closet. Styled by AI.
          </p>
        </div>

        {/* Grid with featured first card spanning 2 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.name} delay={index * 100}>
              {/* Dark cards with dramatic hover effects */}
              <div
                className={`relative bg-zinc-900 rounded-2xl p-8 border border-zinc-800 transition-all duration-500 group overflow-hidden ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
                } hover:shadow-[0_20px_50px_rgba(34,211,238,0.1)] hover:border-cyan-400/30 hover:-translate-y-2`}
              >
                {/* Top gradient line reveal on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 transition-all duration-300 group-hover:bg-cyan-400 group-hover:text-zinc-950 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-zinc-100">{feature.name}</h3>
                  <p className="mt-2 text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">{feature.description}</p>

                  {/* PLACEHOLDER: Wardrobe grid screenshot - only in first featured card */}
                  {index === 0 && (
                    <div className="aspect-[4/3] bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl mt-4 flex items-center justify-center border border-zinc-800 group-hover:border-cyan-400/20 transition-colors duration-300">
                      <p className="text-zinc-500 text-sm">Wardrobe screenshot</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
