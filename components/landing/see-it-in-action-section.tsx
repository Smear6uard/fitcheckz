"use client"

export function SeeItInActionSection() {
  return (
    // Visual demo section with dark luxury theme
    <section className="py-20 bg-gradient-to-b from-[#0f0708] via-[#141414] to-[#141414] text-white overflow-hidden relative">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(196,81,94,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium tracking-[0.15em] uppercase">See the magic</span>
          <h2 className="font-serif text-4xl md:text-5xl font-normal mt-4">From chaos to confidence</h2>
          <p className="text-[#8A8A8A] mt-4">Watch your closet transform into curated outfits</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Before side */}
          <div className="relative group">
            <div className="text-sm text-[#8A8A8A] mb-2 uppercase tracking-wider">Before</div>
            {/* PLACEHOLDER: Messy closet or unorganized clothes image */}
            <div className="aspect-square bg-[#1A1A1A] rounded-2xl flex items-center justify-center border border-[#2A2A2A] transition-all duration-500 group-hover:border-[#3A3A3A] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <p className="text-[#8A8A8A]">Messy closet image</p>
            </div>
          </div>

          {/* After side */}
          <div className="relative group">
            <div className="text-sm text-primary mb-2 uppercase tracking-wider">After</div>
            {/* PLACEHOLDER: Styled outfit or organized wardrobe image */}
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center border border-primary/20 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_20px_50px_rgba(196,81,94,0.2)]">
              <p className="text-primary/70">Styled outfit image</p>
            </div>
          </div>
        </div>

        {/* Stats strip with cherry accent and hover effects */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-sm md:text-base">
          <div className="group cursor-default">
            <div className="text-4xl md:text-5xl font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-[#D4656F]">30s</div>
            <div className="text-[#8A8A8A] mt-2 text-sm uppercase tracking-wider group-hover:text-[#a0a0a0] transition-colors duration-300">Average styling time</div>
          </div>
          <div className="group cursor-default">
            <div className="text-4xl md:text-5xl font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-[#D4656F]">1000+</div>
            <div className="text-[#8A8A8A] mt-2 text-sm uppercase tracking-wider group-hover:text-[#a0a0a0] transition-colors duration-300">Outfit combinations</div>
          </div>
          <div className="group cursor-default">
            <div className="text-4xl md:text-5xl font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-[#D4656F]">0</div>
            <div className="text-[#8A8A8A] mt-2 text-sm uppercase tracking-wider group-hover:text-[#a0a0a0] transition-colors duration-300">Fashion degree required</div>
          </div>
        </div>
      </div>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  )
}
