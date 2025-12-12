"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PricingCard } from "@/components/subscription/PricingCard"
import { SubscriptionBadge } from "@/components/subscription/SubscriptionBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getErrorMessage } from "@/lib/utils/error-handling"

export default function SubscriptionPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

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
    try {
      const res = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
      })

      if (!res.ok) throw new Error("Failed to cancel subscription")

      toast.success("Subscription canceled")
      setShowCancelDialog(false)
      fetchSubscription()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Failed to cancel subscription")
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-64 w-full" />
        <div>
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
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
            <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your Pro subscription? You'll lose access to unlimited outfit suggestions, unlimited wardrobe items, and all Pro features at the end of your current billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

