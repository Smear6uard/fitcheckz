"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sparkles, Infinity, TrendingUp, Zap, Crown } from "lucide-react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils/error-handling"

interface UpgradePromptProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "outfit" | "wardrobe"
  current?: number
  limit?: number
}

export function UpgradePrompt({
  open,
  onOpenChange,
  type,
  current,
  limit,
}: UpgradePromptProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      // Get price ID from environment variable (available in client via NEXT_PUBLIC_ prefix)
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
      if (!priceId) {
        toast.error("Price ID not configured. Please contact support.")
        setLoading(false)
        return
      }

      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      if (!res.ok) throw new Error("Failed to create checkout")

      const { url } = await res.json()
      window.location.href = url
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Failed to start checkout. Please try again.")
      setLoading(false)
    }
  }

  const getContent = () => {
    if (type === "outfit") {
      return {
        title: "Unlock Unlimited Outfit Suggestions",
        description: `You've used all ${limit} of your weekly outfit suggestions. Upgrade to Pro for unlimited outfit recommendations!`,
        features: [
          { icon: Infinity, text: "Unlimited outfit suggestions" },
          { icon: Sparkles, text: "Premium styling recommendations" },
          { icon: TrendingUp, text: "Priority processing" },
        ],
      }
    } else {
      return {
        title: "Expand Your Wardrobe Collection",
        description: `You've reached the ${limit} item limit on the free plan. Upgrade to Pro to add unlimited items to your wardrobe!`,
        features: [
          { icon: Infinity, text: "Unlimited wardrobe items" },
          { icon: Zap, text: "Faster uploads" },
          { icon: Crown, text: "Advanced organization" },
        ],
      }
    }
  }

  const content = getContent()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{content.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {content.features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </div>
            )
          })}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
          >
            {loading ? "Loading..." : "Upgrade to Pro - $9.99/month"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
