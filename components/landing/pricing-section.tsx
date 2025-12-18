import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Free",
    id: "tier-free",
    price: "$0",
    bestFor: "getting started",
    description: "Perfect for trying out AI styling.",
    features: [
      "Up to 50 items",
      "5 outfit recommendations/week",
      "Basic style analysis",
    ],
    cta: "Get Started Free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    price: "$9.99",
    period: "/month",
    bestFor: "style obsessives",
    description: "Unlimited styling for the fashion-forward.",
    features: [
      "Unlimited items",
      "Unlimited outfits",
      "Shopping recommendations",
      "Advanced color analysis",
      "Occasion-based suggestions",
    ],
    cta: "Go Pro",
    href: "/signup?plan=pro",
    featured: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 lg:py-20 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(34,211,238,0.05)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(34,211,238,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.15em] mb-3">PRICING</h2>
          <p className="mt-2 font-sans text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl leading-tight text-balance">
            No weird fees. Just outfits.
          </p>
          <p className="mt-4 text-base leading-7 text-zinc-400 max-w-xl mx-auto">
            Start free, upgrade when you're ready.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl p-8 transition-all duration-500 group overflow-hidden ${
                  tier.featured
                    ? "bg-zinc-900 border-2 border-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.15)] scale-105 lg:scale-110 hover:-translate-y-3 hover:shadow-[0_0_100px_rgba(34,211,238,0.25)]"
                    : "bg-zinc-900 border border-zinc-800 hover:shadow-[0_20px_50px_rgba(34,211,238,0.08)] hover:-translate-y-2 hover:border-cyan-400/30"
                }`}
              >
                {/* Background glow on hover for non-featured */}
                {!tier.featured && (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}

                {/* Top gradient line for featured */}
                {tier.featured && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-zinc-100">
                      {tier.name}
                    </h3>
                    {/* Cyan accent badge for featured tier */}
                    {tier.featured && (
                      <span className="rounded-full bg-cyan-400 text-zinc-950 px-3 py-1 text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium mb-4 text-zinc-500">
                    {tier.featured ? "For" : "Best for"} {tier.bestFor}
                  </p>
                  <p className="mt-2 flex items-baseline gap-1 text-zinc-100">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-sm text-zinc-500">{tier.period}</span>}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                    {tier.description}
                  </p>
                  <ul className="mt-8 space-y-3 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                        <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    className={`mt-8 w-full transition-all duration-300 ${
                      tier.featured ? "bg-cyan-400 text-zinc-950 hover:bg-cyan-300 shadow-lg hover:shadow-[0_10px_40px_rgba(34,211,238,0.3)] hover:scale-[1.03]" : "hover:scale-[1.02]"
                    }`}
                    variant={tier.featured ? "default" : "outline"}
                    asChild
                  >
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
