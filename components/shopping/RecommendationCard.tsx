"use client"

import { useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import {
  ShoppingBag,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Minus,
  Check,
  Search,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface RecommendationCardProps {
  recommendation: {
    id: string
    title: string
    description: string
    category: string
    suggestedColors: string[]
    priceRange: "budget" | "mid" | "luxury"
    priority: "high" | "medium" | "low"
    reason: string
    searchQuery: string
    imagePrompt: string
  }
  onAddToWishlist?: (id: string) => void
  onDismiss?: (id: string) => void
  isInWishlist?: boolean
}

export function RecommendationCard({
  recommendation,
  onAddToWishlist,
  onDismiss,
  isInWishlist = false,
}: RecommendationCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdded, setIsAdded] = useState(isInWishlist)

  // Card hover animation
  const cardSpring = useSpring({
    transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
    boxShadow: isHovered
      ? "0 12px 24px -8px rgba(32, 200, 168, 0.15)"
      : "0 2px 8px -2px rgba(0, 0, 0, 0.08)",
    config: config.gentle,
  })

  const priorityConfig = {
    high: {
      label: "Essential",
      color: "bg-brand-lime text-brand-charcoal",
      icon: TrendingUp,
    },
    medium: {
      label: "Recommended",
      color: "bg-brand-teal text-white",
      icon: Sparkles,
    },
    low: {
      label: "Nice to Have",
      color: "bg-brand-lavender text-brand-charcoal",
      icon: Minus,
    },
  }

  const priceLabels = {
    budget: "$",
    mid: "$$",
    luxury: "$$$",
  }

  const categoryEmoji: Record<string, string> = {
    top: "👕",
    bottom: "👖",
    dress: "👗",
    jacket: "🧥",
    shoes: "👟",
    accessories: "👜",
    outerwear: "🧥",
  }

  const Priority = priorityConfig[recommendation.priority]

  const handleAddToWishlist = () => {
    setIsAdded(true)
    onAddToWishlist?.(recommendation.id)
  }

  const handleSearch = () => {
    // Open Google Shopping search in new tab
    const searchUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(recommendation.searchQuery)}`
    window.open(searchUrl, "_blank")
  }

  const AnimatedCard = animated(Card)

  return (
    <AnimatedCard
      style={cardSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-enhanced overflow-hidden"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">
                {categoryEmoji[recommendation.category] || "👕"}
              </span>
              <CardTitle className="text-lg line-clamp-1">
                {recommendation.title}
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn("text-xs", Priority.color)}>
                <Priority.icon className="h-3 w-3 mr-1" />
                {Priority.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {priceLabels[recommendation.priceRange]}
              </Badge>
              <Badge variant="secondary" className="text-xs capitalize">
                {recommendation.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {recommendation.description}
        </p>

        {/* Reason chip */}
        <div className="flex items-start gap-2 text-sm bg-brand-lime/10 rounded-lg p-3">
          <Sparkles className="h-4 w-4 text-brand-lime shrink-0 mt-0.5" />
          <span className="text-brand-charcoal">{recommendation.reason}</span>
        </div>

        {/* Suggested colors */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Suggested Colors
          </p>
          <div className="flex gap-2">
            {recommendation.suggestedColors.map((color) => (
              <TooltipProvider key={color}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 border-white shadow-sm cursor-help",
                        getColorClass(color)
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{color}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSearch}
            className="flex-1 gap-2"
          >
            <Search className="h-4 w-4" />
            Find Similar
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            variant={isAdded ? "secondary" : "outline"}
            size="icon"
            onClick={handleAddToWishlist}
            disabled={isAdded}
          >
            {isAdded ? (
              <Check className="h-4 w-4 text-brand-teal" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}

// Helper to get Tailwind color class for common colors
function getColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    white: "bg-white",
    black: "bg-black",
    navy: "bg-blue-900",
    gray: "bg-gray-500",
    charcoal: "bg-gray-700",
    beige: "bg-amber-100",
    cream: "bg-amber-50",
    tan: "bg-amber-200",
    camel: "bg-amber-300",
    indigo: "bg-indigo-600",
    "light wash": "bg-blue-200",
    "light blue": "bg-blue-300",
    sage: "bg-green-300",
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    pink: "bg-pink-400",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    brown: "bg-amber-700",
  }

  return colorMap[color.toLowerCase()] || "bg-gray-400"
}
