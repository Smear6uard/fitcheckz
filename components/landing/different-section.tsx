"use client"

import { CheckCircle } from "lucide-react"
import { ScrollReveal } from "@/components/common/ScrollReveal"

const comparisons = [
  { feature: "Wardrobe", others: "Stock photos", styleum: "Your real clothes" },
  { feature: "Recommendations", others: "Trust us", styleum: "Explains the why" },
  { feature: "Style range", others: "Safe only", styleum: "Safe + bold options" },
]

export function DifferentSection() {
  return (
    <section className="py-16 lg:py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(20,184,166,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-[#14b8a6] uppercase tracking-[0.15em] mb-3">WHY STYLEUM</h2>
          <p className="mt-2 font-sans text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl leading-tight text-balance">
            Not another basic AI stylist.
          </p>
        </div>

        {/* Comparison Table */}
        <ScrollReveal delay={100}>
          <div className="max-w-2xl mx-auto">
            {/* Header row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div></div>
              <div className="text-center text-zinc-400 text-sm">Other Apps</div>
              <div className="text-center text-[#14b8a6] text-sm font-medium">Styleum</div>
            </div>

            {/* Comparison rows */}
            {comparisons.map((row, index) => (
              <ScrollReveal key={row.feature} delay={150 + index * 100}>
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10 items-center">
                  <div className="text-white font-medium">{row.feature}</div>
                  <div className="text-center text-zinc-500">{row.others}</div>
                  <div className="text-center text-white flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#14b8a6] flex-shrink-0" />
                    <span>{row.styleum}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
