"use client"

import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"

interface SubscriptionBadgeProps {
  tier: string
}

export function SubscriptionBadge({ tier }: SubscriptionBadgeProps) {
  if (tier === "pro") {
    return (
      <Badge className="gap-1 bg-[#C4515E] text-white hover:bg-[#B34452]">
        <Crown className="h-3 w-3" />
        Pro
      </Badge>
    )
  }

  return <Badge variant="secondary">Free</Badge>
}

