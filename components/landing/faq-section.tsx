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
    <section className="py-16 lg:py-20 bg-gradient-to-b from-[#0f0708] via-[#141414] to-[#141414] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(196,81,94,0.05)_0%,transparent_50%)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-3">FAQ</h2>
          <p className="mt-2 font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight text-balance">
            Common questions
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.question} delay={index * 100}>
                {/* Dark accordion with dramatic hover effects */}
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] px-6 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_10px_40px_rgba(196,81,94,0.1)] data-[state=open]:border-primary/30 data-[state=open]:shadow-[0_10px_40px_rgba(196,81,94,0.1)]"
                >
                  <AccordionTrigger className="text-left font-serif font-normal text-white hover:no-underline hover:text-primary transition-colors duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#8A8A8A] leading-relaxed">
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
