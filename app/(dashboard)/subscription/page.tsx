"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PricingCard } from "@/components/subscription/PricingCard"
import { SubscriptionBadge } from "@/components/subscription/SubscriptionBadge"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SubscriptionPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscription()
    
    // Check for success/cancel from Stripe
    const params = new URLSearchParams(window.location.search)
    if (params.get("success") === "true") {
      toast.success("Subscription activated!")
      fetchSubscription()
    } else if (params.get("canceled") === "true") {
      toast.error("Checkout canceled")
    }
  }, [])

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/subscription")
      if (res.ok) {
        const data = await res.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return

    try {
      const res = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
      })

      if (!res.ok) throw new Error("Failed to cancel subscription")

      toast.success("Subscription canceled")
      fetchSubscription()
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel subscription")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  const currentTier = subscription?.tier || "free"

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing
          </p>
        </div>
        <SubscriptionBadge tier={currentTier} />
      </div>

      {currentTier === "pro" && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>
              Your Pro subscription is active
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription?.current_period_end && (
              <p className="text-sm text-muted-foreground">
                Renews on:{" "}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Plans</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <PricingCard
            name="Free"
            price="$0"
            description="Perfect for trying out Fitcheckz"
            features={[
              "5 outfit suggestions per week",
              "Up to 50 wardrobe items",
              "View outfit history",
              "Basic features",
            ]}
            currentTier={currentTier}
          />
          <PricingCard
            name="Pro"
            price="$9.99"
            description="Unlock unlimited styling potential"
            features={[
              "Unlimited outfit suggestions",
              "Unlimited wardrobe items",
              "Advanced analytics",
              "Priority support",
              "Early access to new features",
            ]}
            priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID}
            currentTier={currentTier}
            isPro
          />
        </div>
      </div>
    </div>
  )
}

