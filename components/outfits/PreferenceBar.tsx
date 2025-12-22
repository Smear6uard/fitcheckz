"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PreferenceBarProps {
  preferences: {
    occasion?: string
    timeOfDay?: string
    season?: string
    mood?: string
  }
  onEdit?: () => void
  onClear?: () => void
  className?: string
}

export function PreferenceBar({
  preferences,
  onEdit,
  onClear,
  className,
}: PreferenceBarProps) {
  const { occasion, timeOfDay, season, mood } = preferences

  // Filter out undefined values
  const activePreferences = [occasion, timeOfDay, season, mood].filter(Boolean)

  if (activePreferences.length === 0) {
    return null
  }

  // Format preference names for display
  const formatPreference = (value: string | undefined): string => {
    if (!value) return ""
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50 border border-border/50",
        className
      )}
    >
      <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
        {occasion && (
          <Badge variant="secondary" className="bg-brand-accent/10 text-brand-accent border-brand-accent/20">
            {formatPreference(occasion)}
          </Badge>
        )}
        {timeOfDay && (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
            {formatPreference(timeOfDay)}
          </Badge>
        )}
        {season && (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            {formatPreference(season)}
          </Badge>
        )}
        {mood && (
          <Badge variant="secondary" className="bg-rose-500/10 text-rose-400 border-rose-500/20">
            {formatPreference(mood)}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
        {onClear && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
