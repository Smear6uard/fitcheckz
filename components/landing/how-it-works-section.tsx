"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const steps = [
  {
    time: "7:00 AM",
    title: "6 outfits appear",
    description: "Weather-checked. Style-matched. Already done for you.",
  },
  {
    time: "7:01 AM",
    title: "You pick one",
    description: "Swipe. Tap. No thinking required.",
  },
  {
    time: "7:02 AM",
    title: "You're dressed",
    description: "No spiral. No second-guessing. Just go live your life.",
  },
]

export function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="how-it-works" className="bg-[#FDFBF7] py-24 md:py-32" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header - left aligned, bold */}
        <motion.h2
          className="text-headline font-bold text-[#1A1A1A] mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          Your morning,
          <br />
          <span className="text-[#C4515E]">solved.</span>
        </motion.h2>

        {/* Timeline - horizontal on desktop */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.time}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 }}
            >
              {/* Time with clock icon */}
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-4 h-4 text-[#C4515E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2" />
                </svg>
                <span className="text-[#C4515E] font-mono text-sm font-bold tracking-wide">
                  {step.time}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2 leading-tight">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[#6B7280] text-base">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
