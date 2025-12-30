"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const outfits = [
  { label: "Mon 7AM" },
  { label: "Tue 7AM" },
  { label: "Wed 7AM" },
  { label: "Thu 7AM" },
  { label: "Fri 7AM" },
]

export function OutfitShowcaseSection() {
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const scrollPrev = () => {
    scrollRef.current?.scrollBy({ left: -356, behavior: "smooth" }) // 340px card + 16px gap
  }

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 356, behavior: "smooth" })
  }

  return (
    <section className="bg-[#1A1512] py-16 md:py-24 overflow-hidden" ref={ref}>
      {/* Header */}
      <motion.div
        className="max-w-5xl mx-auto px-6 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
      >
        <h2 className="text-headline font-bold text-white">
          A week of outfits.
          <br />
          <span className="text-white/30">Zero closet spirals.</span>
        </h2>
      </motion.div>

      {/* Full-bleed horizontal scroll with navigation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
      >
        {/* Desktop navigation arrows */}
        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Previous outfit"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Next outfit"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-6 md:pl-[calc((100vw-64rem)/2+1.5rem)]"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {outfits.map((outfit, index) => (
            <motion.div
              key={outfit.label}
              className="flex-shrink-0 w-[280px] md:w-[340px] snap-start"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-gradient-to-br from-[#2A2420] to-[#1A1512] border border-white/10">
                {/* Placeholder for outfit image */}
                <div className="w-full h-full flex items-center justify-center group cursor-pointer">
                  <div className="text-center transition-transform duration-500 group-hover:scale-105">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-8 h-8 text-white/20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-white/30 text-sm">Outfit photo</p>
                  </div>
                </div>
              </div>
              <p className="text-white/60 text-sm font-mono tracking-wide">{outfit.label}</p>
            </motion.div>
          ))}

          {/* Spacer for last item */}
          <div className="flex-shrink-0 w-6" />
        </div>
      </motion.div>
    </section>
  )
}
