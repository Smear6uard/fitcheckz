"use client"

import { Upload, Wand2, ShoppingBag } from "lucide-react"
import { ScrollReveal } from "@/components/common/ScrollReveal"

const steps = [
  {
    step: "01",
    name: "Upload Your Wardrobe",
    description: "Take photos of your clothes. Our AI organizes everything automatically.",
    icon: Upload,
  },
  {
    step: "02",
    name: "Tell Us Your Vibe",
    description: "Share your style preferences and occasions. We learn what you love.",
    icon: Wand2,
  },
  {
    step: "03",
    name: "Get Outfits & Shop Gaps",
    description: "Receive personalized outfit suggestions and shopping recommendations to complete your look.",
    icon: ShoppingBag,
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-3">HOW IT WORKS</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight text-balance">
            Three steps to effortless style
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground max-w-xl mx-auto">
            Get dressed faster. Look better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <ScrollReveal key={step.name} delay={index * 150}>
              {/* Enhanced hover states: stronger lift and shadow */}
              <div
                className={`relative bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-xl hover:border-primary/30 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-300 ${
                  index === 1 ? 'md:-mt-4' : index === 2 ? 'md:mt-4' : ''
                }`}
              >
              <div className="flex items-start gap-4 mb-6">
                <span className="text-7xl font-black text-primary/10 leading-none" style={{ fontFamily: 'system-ui, -apple-system' }}>
                  {step.step}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mt-2 flex-shrink-0">
                  <step.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.name}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
            </ScrollReveal>
          ))}
        </div>

        {/* PLACEHOLDER: Style preferences screenshot - appears after step 2 */}
        <ScrollReveal delay={450} visibleClassName="animate-slide-tilt-in">
          <div className="mt-8 max-w-xl mx-auto aspect-video bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl flex items-center justify-center">
            <p className="text-gray-400 text-sm">Style preferences screenshot</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
