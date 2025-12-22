"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getScoreColor, type OutfitScores } from "@/lib/ai/outfit-scorer"
import { Palette, Calendar, Sparkles, Shirt, Award, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface OutfitScoreCardProps {
  scores: OutfitScores
  feedback?: string[]
  warnings?: string[]
  compact?: boolean
}

/**
 * Get color classes based on score value
 */
function getScorePillColor(score: number): string {
  if (score >= 80) return "bg-green-500/20 text-green-400 border-green-500/30"
  if (score >= 60) return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  if (score >= 40) return "bg-amber-500/20 text-amber-400 border-amber-500/30"
  return "bg-red-500/20 text-red-400 border-red-500/30"
}

export function OutfitScoreCard({
  scores,
  feedback = [],
  warnings = [],
  compact = false,
}: OutfitScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const scoreItems = [
    {
      label: "Color Harmony",
      value: scores.colorHarmony,
      icon: Palette,
      description: "How well the colors work together",
    },
    {
      label: "Occasion Fit",
      value: scores.occasionFit,
      icon: Calendar,
      description: "Appropriateness for the occasion",
    },
    {
      label: "Style",
      value: scores.styleConsistency,
      icon: Sparkles,
      description: "Style cohesiveness",
    },
    {
      label: "Seasonality",
      value: scores.seasonality,
      icon: Shirt,
      description: "Season appropriateness",
    },
  ]

  // Compact mode: collapsible score pill
  if (compact) {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border font-bold text-sm",
                  getScorePillColor(scores.overall)
                )}
              >
                {scores.overall}
              </div>
              <span className="text-sm text-muted-foreground">Match Score</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pt-3 pb-1 space-y-3">
            {scoreItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <item.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <span className={cn("font-medium", getScoreColor(item.value))}>
                    {item.value}
                  </span>
                </div>
                <Progress value={item.value} className="h-1" />
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  // Full mode (for detail pages)
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Outfit Score
          </CardTitle>
          <div
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-full border-2 font-bold text-xl",
              getScorePillColor(scores.overall)
            )}
          >
            {scores.overall}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Individual Scores */}
        <div className="space-y-4">
          {scoreItems.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className={getScoreColor(item.value)}>{item.value}/100</span>
              </div>
              <Progress value={item.value} className="h-2" />
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Feedback */}
        {feedback.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Highlights</h4>
            <div className="space-y-1">
              {feedback.map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Suggestions</h4>
            <div className="space-y-1">
              {warnings.map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-500 mt-0.5">!</span>
                  <span className="text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Simple score badge for use in card headers
 */
export function OutfitScoreBadge({ score }: { score: number }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full border font-bold text-sm",
        getScorePillColor(score)
      )}
    >
      {score}
    </div>
  )
}
