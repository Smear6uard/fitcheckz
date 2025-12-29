import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,184,166,0.1)] to-transparent" />

      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[rgba(20,184,166,0.2)] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to get styled?
        </h2>
        <p className="text-zinc-400 mb-8">
          Join 500+ people who stopped staring at their closet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="group/btn px-8 py-4 rounded-xl bg-[#14b8a6] text-white font-semibold hover:bg-[#0d9488] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(20,184,166,0.4)]"
            asChild
          >
            <Link href="/signup" className="flex items-center">
              <span>Get your first outfit</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-300"
            asChild
          >
            <Link href="#features">Learn more</Link>
          </Button>
        </div>
        <p className="text-zinc-500 text-sm mt-6">
          Free forever. No credit card needed.
        </p>
      </div>
    </section>
  )
}
