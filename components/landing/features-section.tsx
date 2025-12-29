"use client"

import { Sparkles, Camera, Palette, Calendar, TrendingUp, Lock } from "lucide-react"
import { ScrollReveal } from "@/components/common/ScrollReveal"

const features = [
  {
    name: "AI Style Analysis",
    description: "Learns your colors, fit, and vibe automatically.",
    icon: Sparkles,
  },
  {
    name: "Digital Wardrobe",
    description: "Your real closet, organized and searchable.",
    icon: Camera,
  },
  {
    name: "Color Coordination",
    description: "Matches colors that actually work together.",
    icon: Palette,
  },
  {
    name: "Occasion Planning",
    description: "Right outfit for work, dates, or weekends.",
    icon: Calendar,
  },
  {
    name: "Style Evolution",
    description: "Tracks what you wear. Gets smarter over time.",
    icon: TrendingUp,
  },
  {
    name: "Privacy First",
    description: "Your photos stay yours. Always encrypted.",
    icon: Lock,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 lg:py-20 bg-[#0f0f0f] relative">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(20,184,166,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative">
        {/* Left-aligned heading */}
        <div className="max-w-4xl text-left mb-16">
          <h2 className="text-xs font-semibold text-[#14b8a6] uppercase tracking-[0.15em] mb-3">FEATURES</h2>
          <p className="mt-2 font-sans text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl leading-tight text-balance">
            Your closet.{" "}
            <span className="relative inline-block">
              <span className="text-[#14b8a6]">Styled by AI.</span>
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent rounded-full opacity-90" />
            </span>
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
                } hover:shadow-[0_20px_50px_rgba(20,184,166,0.1)] hover:border-[rgba(20,184,166,0.3)] hover:-translate-y-2`}
              >
                {/* Top gradient line reveal on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,184,166,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.2)] text-[#14b8a6] transition-all duration-300 group-hover:bg-[#14b8a6] group-hover:text-zinc-950 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-zinc-100">{feature.name}</h3>
                  <p className="mt-2 text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">{feature.description}</p>

                  {/* PLACEHOLDER: Wardrobe grid screenshot - only in first featured card */}
                  {index === 0 && (
                    <div className="aspect-[4/3] bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl mt-4 flex items-center justify-center border border-zinc-800 group-hover:border-[rgba(20,184,166,0.2)] transition-colors duration-300">
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
