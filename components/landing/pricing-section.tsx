"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"

export function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="pricing" className="bg-[#FDFBF7] py-20 md:py-28" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-headline font-bold text-[#1A1A1A]">
            Start free.
            <br />
            Upgrade when you want.
          </h2>
        </motion.div>

        {/* Pricing cards - side by side */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <motion.div
            className="bg-white rounded-2xl p-8 border border-[#EBE5DC]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm font-medium text-[#6B7280] mb-2">Free</p>
            <p className="text-4xl font-bold text-[#1A1A1A] mb-4">$0</p>

            <ul className="space-y-3 mb-8 text-[#4C4C4B]">
              <li className="flex items-center gap-2">
                <span className="text-[#C4515E]">✓</span> 50 items
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#C4515E]">✓</span> 6 daily outfits
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#C4515E]">✓</span> Weather sync
              </li>
            </ul>

            <Link
              href="/signup"
              className="block w-full text-center py-3 px-6 rounded-xl border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              Get started
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            className="bg-[#1A1512] rounded-2xl p-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute -top-3 left-8 bg-[#C4515E] text-white text-xs font-bold px-3 py-1 rounded-full">
              Popular
            </div>

            <p className="text-sm font-medium text-white/60 mb-2">Pro</p>
            <p className="text-4xl font-bold text-white mb-1">$6.99</p>
            <p className="text-white/40 text-sm mb-4">/month</p>

            <ul className="space-y-3 mb-8 text-white/80">
              <li className="flex items-center gap-2">
                <span className="text-[#C4515E]">✓</span> Unlimited items
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#C4515E]">✓</span> Unlimited outfits
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#C4515E]">✓</span> Shopping recs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#C4515E]">✓</span> Advanced styling
              </li>
            </ul>

            <Link
              href="/signup?plan=pro"
              className="block w-full text-center py-3 px-6 rounded-xl bg-[#C4515E] text-white font-semibold hover:bg-[#B34452] transition-colors"
            >
              Go Pro
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
