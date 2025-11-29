import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-16 lg:py-20 bg-primary">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 hover:scale-110 transition-transform">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl leading-tight text-balance">
            Ready to get your fit checked?
          </h2>
          <p className="mt-6 text-lg leading-8 text-primary-foreground/80">
            Start free. No credit card required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Enhanced button hover with scale */}
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl text-base px-8 py-6 w-full sm:w-auto"
              asChild
            >
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:scale-[1.02] transition-all duration-300 text-base px-8 py-6 w-full sm:w-auto bg-transparent"
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
