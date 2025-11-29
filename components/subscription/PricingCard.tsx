"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  priceId?: string
  currentTier?: string
  isPro?: boolean
}

export function PricingCard({
  name,
  price,
  description,
  features,
  priceId,
  currentTier,
  isPro = false,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const isCurrentPlan = currentTier === (isPro ? "pro" : "free")

  const handleUpgrade = async () => {
    if (!priceId) {
      toast.error("Price ID not configured")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      if (!res.ok) throw new Error("Failed to create checkout")

      const { url } = await res.json()
      window.location.href = url
    } catch (error: any) {
      toast.error(error.message || "Failed to start checkout")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={isPro ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          {isCurrentPlan && <Badge>Current Plan</Badge>}
        </div>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
          {isPro && <span className="text-muted-foreground">/month</span>}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        {isPro && !isCurrentPlan && (
          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Processing..." : "Upgrade to Pro"}
          </Button>
        )}
        {isCurrentPlan && (
          <Button variant="outline" className="w-full" disabled>
            Current Plan
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

