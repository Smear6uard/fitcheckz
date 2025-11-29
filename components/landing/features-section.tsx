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
    <section id="features" className="py-16 lg:py-20 bg-amber-50/30">
      <div className="mx-auto max-w-6xl px-6">
        {/* Left-aligned heading for visual interest */}
        <div className="max-w-4xl text-left mb-16">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-3">FEATURES</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight text-balance">
            Your real closet. <span className="underline-hand-drawn">Real outfits.</span>
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground max-w-xl">
            Your closet. Styled by AI.
          </p>
        </div>

        {/* Grid with featured first card spanning 2 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.name} delay={index * 100}>
              {/* First card is featured - larger and spans 2 columns on desktop */}
              <div
                className={`relative bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-xl hover:border-primary/30 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-300 group ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{feature.name}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{feature.description}</p>
                
                {/* PLACEHOLDER: Wardrobe grid screenshot - only in first featured card */}
                {index === 0 && (
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mt-4 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Wardrobe screenshot</p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
