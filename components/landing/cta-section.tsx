import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-[#14b8a6] via-[#14b8a6] to-[#14b8a6] relative overflow-hidden">
      {/* Multiple layered glows for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/15 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[rgba(13,148,136,0.5)] rounded-full blur-3xl" />
      </div>

      {/* Animated particles/sparkles effect via pseudo gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08)_0%,transparent_40%)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 hover:scale-110 hover:bg-white/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="font-sans text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl leading-tight text-balance">
            Ready to get <span className="font-bold">styled</span>?
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-950/80">
            Start free. No credit card needed.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary button with enhanced glow and animations */}
            <Button
              size="lg"
              className="group/btn bg-zinc-950 text-[#14b8a6] hover:bg-zinc-900 hover:scale-105 hover:brightness-110 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(0,0,0,0.6)] text-base px-8 py-6 w-full sm:w-auto"
              asChild
            >
              <Link href="/signup" className="flex items-center">
                <span>Try it free</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110" />
              </Link>
            </Button>
            {/* Secondary button with lively hover effects */}
            <Button
              variant="outline"
              size="lg"
              className="group/btn2 border-zinc-950/40 text-zinc-950 hover:border-zinc-950 hover:bg-zinc-950/20 hover:text-zinc-950 hover:scale-105 hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] transition-all duration-300 text-base px-8 py-6 w-full sm:w-auto bg-transparent"
              asChild
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
