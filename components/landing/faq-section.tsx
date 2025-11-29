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
    question: "How does FitCheckz use my photos?",
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
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-3">FAQ</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight text-balance">
            Common questions
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.question} delay={index * 100}>
                {/* Enhanced hover state with left border accent */}
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card rounded-xl border border-border px-6 hover:border-l-4 hover:border-l-primary hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
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

