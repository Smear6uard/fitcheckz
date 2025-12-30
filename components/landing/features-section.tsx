"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const features = [
  {
    title: "Stop the closet spiral.",
    description: "No more 20 minutes staring at clothes. 6 options. Pick one. Go.",
  },
  {
    title: "Actually wear what you own.",
    description: "That shirt buried in the back? It'll show up. Nothing collects dust.",
  },
  {
    title: "Never dress wrong for weather.",
    description: "No jackets in July. No freezing in a t-shirt. Every pick checks the forecast.",
  },
  {
    title: "47 days of not hating your outfit.",
    description: "Build the streak. Wake up styled. Start to actually like getting dressed.",
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="features" className="bg-[#FDFBF7] py-12 md:py-16" ref={ref}>
      <div className="max-w-3xl mx-auto px-6">
        {/* NO section header - features speak for themselves */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2 leading-tight">
                {feature.title}
              </h3>
              <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
