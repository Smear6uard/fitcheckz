"use client"

export function SeeItInActionSection() {
  return (
    // Visual demo section
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-lime-400 text-sm font-medium tracking-wider uppercase">See the magic</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">From chaos to confidence</h2>
          <p className="text-slate-400 mt-4">Watch your closet transform into curated outfits</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Before side */}
          <div className="relative">
            <div className="text-sm text-slate-500 mb-2 uppercase tracking-wider">Before</div>
            {/* PLACEHOLDER: Messy closet or unorganized clothes image */}
            <div className="aspect-square bg-slate-700/50 rounded-2xl flex items-center justify-center border border-slate-600">
              <p className="text-slate-500">Messy closet image</p>
            </div>
          </div>

          {/* After side */}
          <div className="relative">
            <div className="text-sm text-lime-400 mb-2 uppercase tracking-wider">After</div>
            {/* PLACEHOLDER: Styled outfit or organized wardrobe image */}
            <div className="aspect-square bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-teal-500/30">
              <p className="text-teal-300">Styled outfit image</p>
            </div>
          </div>
        </div>

        {/* Stats strip inside the same dark section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-sm md:text-base">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-teal-400">30s</div>
            <div className="text-slate-400 mt-2 text-sm">Average styling time</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-lime-400">1000+</div>
            <div className="text-slate-400 mt-2 text-sm">Outfit combinations</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-emerald-400">0</div>
            <div className="text-slate-400 mt-2 text-sm">Fashion degree required</div>
          </div>
        </div>
      </div>
    </section>
  )
}