"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const personas = [
  {
    title: "The Overthinker",
    description: "You have clothes. You just can't decide.",
    detail: 'Every morning is a 20-minute spiral of "this doesn\'t go with that."',
  },
  {
    title: "The Rewear-er",
    description: "Same 5 outfits on rotation.",
    detail: "Meanwhile, 45 items in your closet collect dust.",
  },
  {
    title: "The Late Runner",
    description: "20 minutes deciding, 5 minutes to get ready.",
    detail: "You're not bad at fashion. You're bad at choosing under pressure.",
  },
]

export function WhoItsForSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="who-its-for" className="bg-[#FDFBF7] py-20 md:py-28" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-[-0.02em]">
            Sound like you?
          </h2>
        </motion.div>

        {/* Persona Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {personas.map((persona, index) => (
            <motion.article
              key={persona.title}
              className="bg-white p-7 rounded-2xl border border-[#EBE5DC] hover:border-[#C4515E]/30 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                {persona.title}
              </h3>
              <p className="text-[#C4515E] font-medium text-[15px] mb-3">
                {persona.description}
              </p>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                {persona.detail}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          className="text-center text-[#4C4C4B] text-lg mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          Styleum gives you 6 outfit suggestions every morning.
          <br className="hidden sm:block" />
          <span className="text-[#1A1A1A] font-medium">
            Just pick one and go.
          </span>
        </motion.p>
      </div>
    </section>
  )
}
