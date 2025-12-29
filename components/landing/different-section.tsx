"use client"

import { Shirt, Lightbulb, Sparkles } from "lucide-react"
import { ScrollReveal } from "@/components/common/ScrollReveal"

const differences = [
  {
    title: "Uses your real closet",
    description: "Not stock photos or products you don't own. We work with clothes you actually have in your wardrobe.",
    icon: Shirt,
  },
  {
    title: "Explains the why",
    description: "Every recommendation comes with styling insights. Learn from each outfit suggestion.",
    icon: Lightbulb,
  },
  {
    title: "Balances safe and bold",
    description: "Get both comfort picks and creative risks in every batch. Never boring, never too risky.",
    icon: Sparkles,
  },
]

export function DifferentSection() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(20,184,166,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-[#14b8a6] uppercase tracking-[0.15em] mb-3">WHY STYLEUM</h2>
          <p className="mt-2 font-sans text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl leading-tight text-balance">
            Not another basic AI stylist.
          </p>
        </div>

        {/* Dark cards with dramatic hover effects */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {differences.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 100}>
              <div
                className="relative bg-zinc-900 rounded-xl p-6 border border-zinc-800 transition-all duration-500 overflow-hidden group hover:shadow-[0_20px_50px_rgba(20,184,166,0.1)] hover:border-[rgba(20,184,166,0.3)] hover:-translate-y-2"
              >
                {/* Bottom accent gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,184,166,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon with glow effect on hover */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14b8a6] text-zinc-950 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(20,184,166,0.4)]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">{item.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* PLACEHOLDER: AI outfit recommendation screenshot */}
        <ScrollReveal delay={300} visibleClassName="animate-slide-tilt-in">
          <div className="mt-8 max-w-2xl mx-auto aspect-[16/9] bg-gradient-to-br from-zinc-900 to-[rgba(20,184,166,0.1)] rounded-2xl flex items-center justify-center border border-zinc-800 hover:border-[rgba(20,184,166,0.3)] hover:shadow-[0_20px_40px_rgba(20,184,166,0.08)] transition-all duration-500">
            <p className="text-zinc-500 text-sm">AI recommendation with explanation screenshot</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
