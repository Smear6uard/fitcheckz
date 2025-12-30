"use client"

import { useState } from "react"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"

interface OutfitCard {
  id: number
  image: string
  score: number
  hook: string
  label: string
}

const outfits: OutfitCard[] = [
  {
    id: 1,
    image: "/outfit-placeholder-1.jpg",
    score: 94,
    hook: "Smart casual with a bold twist",
    label: "Today's Top Pick",
  },
  {
    id: 2,
    image: "/outfit-placeholder-2.jpg",
    score: 91,
    hook: "Weekend brunch ready",
    label: "Weekend Vibe",
  },
  {
    id: 3,
    image: "/outfit-placeholder-3.jpg",
    score: 88,
    hook: "Clean and minimal",
    label: "Everyday Essential",
  },
]

export function SwipeableOutfitCards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-150, 0, 150], [-8, 0, 8])
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 80) {
      // Swipe detected
      if (info.offset.x > 0) {
        // Swiped right - go to previous
        setCurrentIndex((prev) => (prev === 0 ? outfits.length - 1 : prev - 1))
      } else {
        // Swiped left - go to next
        setCurrentIndex((prev) => (prev === outfits.length - 1 ? 0 : prev + 1))
      }
    }
  }

  const currentOutfit = outfits[currentIndex]

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Background cards (stacked behind) */}
      <div className="absolute inset-0 -z-20 rotate-[-4deg] -translate-x-2 translate-y-6 bg-white rounded-3xl border border-[#EBE5DC] opacity-30" />
      <div className="absolute inset-0 -z-10 rotate-[3deg] translate-x-3 translate-y-3 bg-white rounded-3xl border border-[#EBE5DC] opacity-60" />

      {/* Active Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentOutfit.id}
          className="relative bg-white rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            x,
            rotate,
            opacity,
            boxShadow: "0 25px 60px -15px rgba(196, 81, 94, 0.3)",
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileTap={{ cursor: "grabbing" }}
        >
          {/* Outfit Image */}
          <div className="aspect-[4/5] bg-gradient-to-br from-[#F5F3EF] to-[#EBE5DC] relative">
            {/* Placeholder with outfit silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-32 mx-auto mb-4 bg-[#EBE5DC] rounded-lg" />
                <div className="w-16 h-4 mx-auto bg-[#EBE5DC] rounded" />
              </div>
            </div>
            {/* Score badge */}
            <div className="absolute top-4 right-4 bg-[#C4515E] text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              {currentOutfit.score}
            </div>
          </div>

          {/* Card Footer */}
          <div className="p-5 border-t border-[#EBE5DC]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#4C4C4B]">{currentOutfit.label}</span>
              <div className="flex gap-1">
                {outfits.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      idx === currentIndex ? "bg-[#C4515E]" : "bg-[#EBE5DC]"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="font-semibold text-[#1A1A1A] text-lg">"{currentOutfit.hook}"</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe Hint */}
      <p className="text-center text-[#6B7280] text-sm mt-6 select-none">
        <span className="inline-block animate-pulse">Swipe to explore</span>
      </p>
    </div>
  )
}
