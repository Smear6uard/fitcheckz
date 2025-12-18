"use client"

export function SeeItInActionSection() {
  return (
    // Visual demo section with dark theme
    <section className="py-20 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-900 text-white overflow-hidden relative">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(34,211,238,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center mb-12">
          <span className="text-cyan-400 text-sm font-medium tracking-[0.15em] uppercase">See the magic</span>
          <h2 className="font-sans text-4xl md:text-5xl font-bold mt-4 text-zinc-100">From &quot;I have nothing to wear&quot; to &quot;okay wait I look good&quot;</h2>
          <p className="text-zinc-400 mt-4">Watch your closet transform into curated outfits</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Before side */}
          <div className="relative group">
            <div className="text-sm text-zinc-500 mb-2 uppercase tracking-wider">Before</div>
            {/* PLACEHOLDER: Messy closet or unorganized clothes image */}
            <div className="aspect-square bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 transition-all duration-500 group-hover:border-zinc-700 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <p className="text-zinc-500">Messy closet image</p>
            </div>
          </div>

          {/* After side */}
          <div className="relative group">
            <div className="text-sm text-cyan-400 mb-2 uppercase tracking-wider">After</div>
            {/* PLACEHOLDER: Styled outfit or organized wardrobe image */}
            <div className="aspect-square bg-gradient-to-br from-cyan-400/10 to-cyan-400/5 rounded-2xl flex items-center justify-center border border-cyan-400/20 transition-all duration-500 group-hover:border-cyan-400/40 group-hover:shadow-[0_20px_50px_rgba(34,211,238,0.15)]">
              <p className="text-cyan-400/70">Styled outfit image</p>
            </div>
          </div>
        </div>

        {/* Stats strip with cyan accent and hover effects */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-sm md:text-base">
          <div className="group cursor-default">
            <div className="text-4xl md:text-5xl font-bold text-cyan-400 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-300">30s</div>
            <div className="text-zinc-500 mt-2 text-sm uppercase tracking-wider group-hover:text-zinc-400 transition-colors duration-300">Average styling time</div>
          </div>
          <div className="group cursor-default">
            <div className="text-4xl md:text-5xl font-bold text-cyan-400 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-300">1000+</div>
            <div className="text-zinc-500 mt-2 text-sm uppercase tracking-wider group-hover:text-zinc-400 transition-colors duration-300">Outfit combinations</div>
          </div>
          <div className="group cursor-default">
            <div className="text-4xl md:text-5xl font-bold text-cyan-400 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-300">0</div>
            <div className="text-zinc-500 mt-2 text-sm uppercase tracking-wider group-hover:text-zinc-400 transition-colors duration-300">Fashion degree required</div>
          </div>
        </div>
      </div>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </section>
  )
}
