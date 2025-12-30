"use client"

import { useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { Globe, Lock, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { toast } from "@/lib/utils/toast-personality"

interface PublicToggleProps {
  outfitId: string
  initialIsPublic?: boolean
  onToggle?: (isPublic: boolean) => void
  className?: string
  showLabel?: boolean
}

export function PublicToggle({
  outfitId,
  initialIsPublic = false,
  onToggle,
  className,
  showLabel = true,
}: PublicToggleProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [isLoading, setIsLoading] = useState(false)

  // Icon animation
  const iconSpring = useSpring({
    transform: isPublic ? "scale(1.1) rotate(360deg)" : "scale(1) rotate(0deg)",
    config: config.wobbly,
  })

  const handleToggle = async (checked: boolean) => {
    if (isLoading) return

    setIsLoading(true)
    const previousValue = isPublic

    // Optimistic update
    setIsPublic(checked)

    try {
      const res = await fetch(`/api/outfits/${outfitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: checked }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update")
      }

      onToggle?.(checked)

      if (checked) {
        toast.success("Outfit is now public! Share your style with the world.")
      } else {
        toast.info("Outfit is now private.")
      }
    } catch (error) {
      // Revert on error
      setIsPublic(previousValue)
      toast.error(
        error instanceof Error ? error.message : "Failed to update visibility"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const Icon = isPublic ? Globe : Lock

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-2",
              isLoading && "opacity-70",
              className
            )}
          >
            <animated.div style={iconSpring}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isPublic ? "text-primary" : "text-muted-foreground"
                  )}
                />
              )}
            </animated.div>
            <Switch
              id={`public-toggle-${outfitId}`}
              checked={isPublic}
              onCheckedChange={handleToggle}
              disabled={isLoading}
              className={cn(
                isPublic && "data-[state=checked]:bg-primary"
              )}
            />
            {showLabel && (
              <Label
                htmlFor={`public-toggle-${outfitId}`}
                className="text-sm cursor-pointer"
              >
                {isPublic ? "Public" : "Private"}
              </Label>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isPublic
              ? "This outfit is visible to everyone in the Explore feed"
              : "Only you can see this outfit"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
