"use client"

import { ScrollReveal } from "@/components/common/ScrollReveal"

const quotes = [
  {
    quote: "I actually look forward to getting dressed now.",
    context: "That moment when your closet stops stressing you out and starts inspiring you.",
  },
  {
    quote: "My 47-day streak is sacred.",
    context: "When style becomes a habit, confidence becomes automatic.",
  },
]

export function HowItFeelsSection() {
  return (
    <section className="py-12 md:py-16 bg-[#FDFBF7]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            How it feels
          </h2>
        </div>

        {/* Quote Cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {quotes.map((item, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div
                className="bg-white p-6 md:p-8 rounded-2xl border border-[#EBE5DC]"
                style={{
                  boxShadow: "0 8px 30px rgba(44, 24, 16, 0.08)",
                }}
              >
                <p className="text-xl md:text-2xl font-bold text-[#1A1A1A] leading-snug mb-3">
                  "{item.quote}"
                </p>
                <p className="text-[#6B7280] text-sm md:text-base">
                  {item.context}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
