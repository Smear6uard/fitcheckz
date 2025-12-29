"use client"

export function SeeItInActionSection() {
  return (
    // Visual demo section with dark theme
    <section className="py-20 bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(20,184,166,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(20,184,166,0.5)] to-transparent" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center mb-12">
          <span className="text-[#14b8a6] text-sm font-medium tracking-[0.15em] uppercase">See the magic</span>
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
            <div className="text-sm text-[#14b8a6] mb-2 uppercase tracking-wider">After</div>
            {/* PLACEHOLDER: Styled outfit or organized wardrobe image */}
            <div className="aspect-square bg-gradient-to-br from-[rgba(20,184,166,0.1)] to-[rgba(20,184,166,0.05)] rounded-2xl flex items-center justify-center border border-[rgba(20,184,166,0.2)] transition-all duration-500 group-hover:border-[rgba(20,184,166,0.4)] group-hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)]">
              <p className="text-[#14b8a6]/70">Styled outfit image</p>
            </div>
          </div>
        </div>

        {/* Stats strip with visual card containers */}
        <div className="mt-16 flex justify-center gap-4 md:gap-8">
          <div className="px-6 py-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center group cursor-default hover:border-white/[0.1] transition-all duration-300">
            <div className="text-3xl font-bold text-[#14b8a6] transition-all duration-300 group-hover:scale-110">30s</div>
            <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Avg styling time</div>
          </div>
          <div className="px-6 py-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center group cursor-default hover:border-white/[0.1] transition-all duration-300">
            <div className="text-3xl font-bold text-[#14b8a6] transition-all duration-300 group-hover:scale-110">1000+</div>
            <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Outfit combos</div>
          </div>
          <div className="px-6 py-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center group cursor-default hover:border-white/[0.1] transition-all duration-300">
            <div className="text-3xl font-bold text-[#14b8a6] transition-all duration-300 group-hover:scale-110">0</div>
            <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Fashion degree</div>
          </div>
        </div>
      </div>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(20,184,166,0.3)] to-transparent" />
    </section>
  )
}
