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
    <section id="how-it-works" className="py-16 lg:py-20 bg-[#0f0f0f] relative overflow-hidden">
      {/* Top gradient divider line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(20,184,166,0.6)] to-transparent" />

      {/* Ambient glows */}
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(20,184,166,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(20,184,166,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-[#14b8a6] uppercase tracking-[0.15em] mb-3">HOW IT WORKS</h2>
          <p className="mt-2 font-sans text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl leading-tight text-balance">
            Three steps. Zero stress.
          </p>
          <p className="mt-4 text-base leading-7 text-zinc-400 max-w-xl mx-auto">
            Get dressed faster. Look better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <ScrollReveal key={step.name} delay={index * 150}>
              <div
                className={`relative bg-zinc-900 rounded-2xl p-8 border border-zinc-800 transition-all duration-500 group overflow-hidden ${
                  index === 1 ? 'md:-mt-4' : index === 2 ? 'md:mt-4' : ''
                } hover:shadow-[0_25px_50px_rgba(20,184,166,0.12)] hover:border-[rgba(20,184,166,0.3)] hover:-translate-y-2`}
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,184,166,0.1)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    {/* Prominent teal step number */}
                    <span className="text-6xl md:text-7xl font-bold text-[#14b8a6]/20 leading-none transition-colors duration-500 group-hover:text-[#14b8a6]/30">
                      {step.step}
                    </span>
                    {/* Icon with teal gradient glow - pulses on hover */}
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#14b8a6] text-zinc-950 mt-2 flex-shrink-0 shadow-[0_0_30px_rgba(20,184,166,0.2)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(20,184,166,0.4)]">
                      <step.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-3">{step.name}</h3>
                  <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* PLACEHOLDER: Style preferences screenshot */}
        <ScrollReveal delay={450} visibleClassName="animate-slide-tilt-in">
          <div className="mt-8 max-w-xl mx-auto aspect-video bg-gradient-to-br from-zinc-900 to-[rgba(20,184,166,0.1)] rounded-2xl flex items-center justify-center border border-zinc-800 hover:border-[rgba(20,184,166,0.3)] hover:shadow-[0_20px_40px_rgba(20,184,166,0.08)] transition-all duration-500">
            <p className="text-zinc-500 text-sm">Style preferences screenshot</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
