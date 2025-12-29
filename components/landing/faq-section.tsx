"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollReveal } from "@/components/common/ScrollReveal"

const faqs = [
  {
    question: "How does Styleum use my photos?",
    answer:
      "Your wardrobe photos are stored securely and only used to generate outfit recommendations. We never share or sell your data.",
  },
  {
    question: "How does the AI make recommendations?",
    answer:
      "Our AI analyzes your items for color, style, and occasion compatibility, then suggests combinations based on your preferences and what works together.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel your Pro subscription at any time from your account settings. No questions asked.",
  },
  {
    question: "What happens to my data if I delete my account?",
    answer:
      "All your photos and data are permanently deleted when you delete your account.",
  },
]

export function FAQSection() {
  return (
    <section className="py-16 lg:py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(20,184,166,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-[#14b8a6] uppercase tracking-[0.15em] mb-3">FAQ</h2>
          <p className="mt-2 font-sans text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl leading-tight text-balance">
            You're probably wondering...
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.question} delay={index * 100}>
                {/* Dark accordion with dramatic hover effects */}
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-zinc-900 rounded-xl border border-zinc-800 px-6 transition-all duration-500 hover:border-[rgba(20,184,166,0.3)] hover:shadow-[0_10px_40px_rgba(20,184,166,0.08)] data-[state=open]:border-[rgba(20,184,166,0.3)] data-[state=open]:shadow-[0_10px_40px_rgba(20,184,166,0.08)]"
                >
                  <AccordionTrigger className="text-left font-sans font-medium text-zinc-100 hover:no-underline hover:text-[#14b8a6] transition-colors duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </ScrollReveal>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
