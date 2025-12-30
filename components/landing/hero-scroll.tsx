"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export function HeroScroll() {
  const [currentFrame, setCurrentFrame] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentFrame(1), 2000),
      setTimeout(() => setCurrentFrame(2), 4500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[85vh] w-full bg-[#FDFBF7] flex items-center justify-center overflow-hidden pt-32 pb-16"
    >
      {/* Skip link */}
      <a
        href="#how-it-works"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-6 focus:z-50 focus:bg-[#C4515E] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to content
      </a>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(196,81,94,0.06)_0%,transparent_50%)]" />
      </div>

      <div className="w-full px-6">
        <AnimatePresence mode="wait">
          {/* FRAME 0: "You have 50 things to wear." */}
          {currentFrame === 0 && (
            <motion.div
              key="frame0"
              className="text-center max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                id="hero-heading"
                className="text-display font-bold text-[#1A1A1A]"
              >
                You have 50 things
                <br />
                to wear.
              </h1>
            </motion.div>
          )}

          {/* FRAME 1: "But feel like you have nothing." */}
          {currentFrame === 1 && (
            <motion.div
              key="frame1"
              className="text-center max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-display font-bold">
                <span className="text-[#C4515E]/40">But feel like you</span>
                <br />
                <span className="text-[#C4515E]">have nothing.</span>
              </h2>
            </motion.div>
          )}

          {/* FRAME 2: Headline + CTA + Phone (CTA above phone) */}
          {currentFrame === 2 && (
            <motion.div
              key="frame2"
              className="flex flex-col items-center justify-center w-full py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Headline */}
              <motion.h2
                className="text-center mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="block text-headline font-bold text-[#1A1A1A]">
                  Every morning.
                </span>
                <span className="block text-headline font-bold text-[#1A1A1A]">
                  6 outfits.
                </span>
                <span className="block text-headline font-bold text-[#C4515E]">
                  Pick one.
                </span>
              </motion.h2>

              {/* CTA - ABOVE phone now */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-[#C4515E] hover:bg-[#B34452] text-white font-bold pl-4 pr-6 py-3.5 rounded-full text-base shadow-[0_8px_30px_rgba(196,81,94,0.4)] hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="font-mono text-sm text-white/70">7AM</span>
                  <span>Get tomorrow&apos;s outfit</span>
                </Link>
                <p className="text-[#9CA3AF] text-sm mt-4">
                  Free forever · 2 min setup
                </p>
              </motion.div>

              {/* Phone Mockup - can peek below fold */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-[220px] md:w-[260px] h-[440px] md:h-[520px] bg-[#1A1A1A] rounded-[2.5rem] p-2.5 shadow-2xl">
                  <div className="w-full h-full bg-[#FDFBF7] rounded-[2rem] overflow-hidden relative">
                    {/* Dynamic Island */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#1A1A1A] rounded-full" />

                    {/* App content placeholder */}
                    <div className="pt-10 px-3 h-full">
                      {/* Status bar with time */}
                      <div className="flex items-center justify-between mb-1 px-1">
                        <span className="text-[10px] font-semibold text-[#1A1A1A] font-mono">7:00</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-2 border border-[#1A1A1A] rounded-sm">
                            <div className="w-3 h-full bg-[#1A1A1A] rounded-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-[#1A1A1A] font-semibold text-xs">Good morning</p>
                          <p className="text-[#6B7280] text-[10px]">6 outfits ready</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#1A1A1A] text-[10px] font-medium">72°F</p>
                          <p className="text-[#6B7280] text-[8px]">Sunny</p>
                        </div>
                      </div>

                      {/* Outfit card placeholder */}
                      <div className="bg-white rounded-xl shadow-lg border border-[#EBE5DC] overflow-hidden">
                        <div className="aspect-[3/4] bg-gradient-to-br from-[#F5F3EF] to-[#E8E4DC] flex items-center justify-center relative">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-[#C4515E]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg
                                className="w-6 h-6 text-[#C4515E]"
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
                            <p className="text-[#9CA3AF] text-xs">Your outfit here</p>
                          </div>

                          {/* Swipe dots */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            <div className="w-1 h-1 bg-[#C4515E] rounded-full" />
                            <div className="w-1 h-1 bg-[#D1D5DB] rounded-full" />
                            <div className="w-1 h-1 bg-[#D1D5DB] rounded-full" />
                          </div>
                        </div>
                        <div className="p-2 flex items-center justify-between">
                          <span className="text-[#6B7280] text-[10px]">Today&apos;s Top Pick</span>
                          <span className="bg-[#C4515E] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                            94
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator - only show on Frame 0 and 1 */}
      {currentFrame < 2 && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-col items-center gap-1 text-[#9CA3AF]">
            <span className="text-[10px] tracking-wide">Scroll to explore</span>
            <motion.svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
          </div>
        </motion.div>
      )}
    </section>
  )
}
