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
    cta: "Start Pro Trial",
    href: "/signup?plan=pro",
    featured: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-3">PRICING</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight text-balance">
            Simple, transparent pricing
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground max-w-xl mx-auto">
            Start free, upgrade when you're ready.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
                  tier.featured
                    ? "bg-primary text-primary-foreground ring-2 ring-primary shadow-2xl scale-105 lg:scale-110 border-2 border-primary/50 hover:-translate-y-2 hover:shadow-3xl before:absolute before:inset-0 before:rounded-2xl before:bg-[#CCFF00]/10 before:blur-2xl before:-z-10"
                    : "bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-3 hover:scale-[1.02] hover:border-primary/30"
                }`}
              >
                {/* Enhanced hover states for pricing cards */}
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`text-lg font-semibold ${tier.featured ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {tier.name}
                  </h3>
                  {/* Lime accent badge for featured tier */}
                  {tier.featured && (
                    <span className="rounded-full bg-[#CCFF00]/20 text-[#CCFF00] px-3 py-1 text-xs font-medium border border-[#CCFF00]/30">
                      Popular
                    </span>
                  )}
                </div>
                <p className={`text-xs font-medium mb-4 ${tier.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {tier.featured ? "For" : "Best for"} {tier.bestFor}
                </p>
                <p
                  className={`mt-2 flex items-baseline gap-1 ${tier.featured ? "text-primary-foreground" : "text-foreground"}`}
                >
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && <span className="text-sm opacity-80">{tier.period}</span>}
                </p>
                <p
                  className={`mt-4 text-sm leading-6 ${tier.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {tier.description}
                </p>
                <ul className="mt-8 space-y-3 flex-1">
                  {tier.features.map((feature, index) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`h-5 w-5 flex-shrink-0 ${tier.featured ? "text-primary-foreground" : "text-primary"}`}
                      />
                      <span
                        className={`text-sm ${index === 2 && tier.featured ? "font-semibold text-primary-foreground" : tier.featured ? "text-primary-foreground/90" : "text-muted-foreground"}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                {/* Enhanced button hover with scale */}
                <Button
                  size="lg"
                  className={`mt-8 w-full hover:scale-[1.02] transition-all duration-300 ${
                    tier.featured ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg" : ""
                  }`}
                  variant={tier.featured ? "default" : "outline"}
                  asChild
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
