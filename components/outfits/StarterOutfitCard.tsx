"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarterOutfitCardProps {
  className?: string
}

export function StarterOutfitCard({ className }: StarterOutfitCardProps) {
  return (
    <Card className={cn("card-enhanced overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-4 w-4 text-brand-lime opacity-50" />
              <span className="text-muted-foreground">Curating your first look...</span>
            </div>
          </div>

          {/* Placeholder score badge */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
            <span className="text-sm text-muted-foreground">--</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Placeholder items grid - blurred soft blocks */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-muted/30 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg,
                  hsl(var(--muted) / 0.3) 0%,
                  hsl(var(--muted) / 0.2) 50%,
                  hsl(var(--muted) / 0.3) 100%)`,
              }}
            />
          ))}
        </div>

        {/* Placeholder description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full rounded bg-muted/20" />
          <div className="h-4 w-4/5 rounded bg-muted/15" />
        </div>

        {/* Placeholder reactions */}
        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-10 w-20 rounded-full bg-muted/20"
            />
          ))}
        </div>

        {/* Placeholder buttons */}
        <div className="space-y-2">
          <div className="h-10 w-full rounded-md bg-muted/20" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 rounded-md bg-muted/15" />
            <div className="h-10 rounded-md bg-muted/15" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
