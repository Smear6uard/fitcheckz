"use client"

import { useState } from "react"

export function VideoSection() {
  const [hasVideo] = useState(false) // Set to true when video is available

  return (
    <section className="relative w-full">
      {/* Full-bleed video - no padding, no max-width */}
      <div className="w-full aspect-video md:aspect-[21/9] bg-[#1A1512] overflow-hidden">
        {hasVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/demo.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white/60 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white/40 text-sm uppercase tracking-widest">
                Video coming soon
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
