"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="bg-[#C4515E] py-24 md:py-32" ref={ref}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.h2
          className="text-headline font-bold text-white mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          Tomorrow at 7AM.
          <br />
          6 outfits. No decisions.
        </motion.h2>

        <motion.p
          className="text-white/70 text-xl mb-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
        >
          Wake up styled. Finally.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-[#C4515E] font-bold px-10 py-5 rounded-full text-xl hover:bg-white/90 hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            <span className="font-mono text-base text-[#C4515E]/60">7AM</span>
            <span>Get tomorrow&apos;s outfit</span>
          </Link>
        </motion.div>

        <motion.p
          className="mt-8 text-white/50 text-base"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          Free forever · 2-minute setup · No credit card
        </motion.p>
      </div>
    </section>
  )
}
