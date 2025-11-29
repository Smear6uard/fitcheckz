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
    <section className="py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-3">WHY FITCHECKZ</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight text-balance">
            Not another generic AI stylist.
          </p>
        </div>

        {/* Tightened horizontal strip layout for cohesive feel */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {differences.map((item, index) => {
            // Different colored left borders for visual distinction
            const borderColors = [
              'border-l-4 border-l-primary', // First card: teal
              'border-l-4 border-l-[#CCFF00]', // Second card: lime
              'border-l-4 border-l-emerald-500', // Third card: emerald
            ]
            
            return (
              <ScrollReveal key={item.title} delay={index * 100}>
                {/* Enhanced hover states with colored left border for distinction */}
                <div
                  className={`relative bg-card rounded-xl p-6 shadow-sm border border-border ${borderColors[index]} hover:shadow-xl hover:border-primary/30 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* PLACEHOLDER: AI outfit recommendation screenshot - appears after cards */}
        <ScrollReveal delay={300} visibleClassName="animate-slide-tilt-in">
          <div className="mt-8 max-w-2xl mx-auto aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <p className="text-gray-400 text-sm">AI recommendation with explanation screenshot</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

