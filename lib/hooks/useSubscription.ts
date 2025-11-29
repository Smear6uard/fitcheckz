"use client"

import { useEffect, useState } from "react"

export function useSubscription() {
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscription()
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

  return {
    subscription,
    loading,
    tier: subscription?.tier || "free",
    isPro: subscription?.tier === "pro",
    refetch: fetchSubscription,
  }
}

