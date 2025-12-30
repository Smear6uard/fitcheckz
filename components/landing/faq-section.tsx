"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"

const faqs = [
  {
    question: "Will it actually match my style?",
    answer:
      "Yes. You tell us your vibe, then the AI learns from what you wear and skip. After a week, it knows what you like better than you do.",
  },
  {
    question: "What if I only have like 20 items?",
    answer:
      "Perfect. Most people only actually wear 20-30 things anyway. We'll find combinations you never knew existed in there.",
  },
  {
    question: "How long does setup actually take?",
    answer:
      "2 minutes. Snap some photos, answer 3 questions, wake up to outfits tomorrow. That's it.",
  },
]

export function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-[#FDFBF7] py-12 md:py-16" ref={ref}>
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          You&apos;re probably wondering...
        </motion.h2>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl border border-[#EBE5DC] overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-[#1A1A1A] pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-[#6B7280] flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="px-5 pb-5 text-[#4C4C4B] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
