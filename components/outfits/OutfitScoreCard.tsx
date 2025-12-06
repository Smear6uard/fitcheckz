import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getScoreGrade, getScoreColor, type OutfitScores } from "@/lib/ai/outfit-scorer"
import { Palette, Calendar, Sparkles, Shirt, Award } from "lucide-react"

interface OutfitScoreCardProps {
  scores: OutfitScores
  feedback?: string[]
  warnings?: string[]
  compact?: boolean
}

export function OutfitScoreCard({
  scores,
  feedback = [],
  warnings = [],
  compact = false,
}: OutfitScoreCardProps) {
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

  const overallGrade = getScoreGrade(scores.overall)
  const gradeColors: Record<string, string> = {
    A: "bg-green-100 text-green-800 border-green-300",
    B: "bg-blue-100 text-blue-800 border-blue-300",
    C: "bg-yellow-100 text-yellow-800 border-yellow-300",
    D: "bg-orange-100 text-orange-800 border-orange-300",
    F: "bg-red-100 text-red-800 border-red-300",
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg ${gradeColors[overallGrade]}`}>
          {overallGrade}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Outfit Score</div>
          <div className="text-xs text-muted-foreground">{scores.overall}/100</div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Outfit Score
          </CardTitle>
          <div className={`flex items-center justify-center w-14 h-14 rounded-full border-2 font-bold text-xl ${gradeColors[overallGrade]}`}>
            {overallGrade}
          </div>
        </div>
        <div className="text-2xl font-bold">{scores.overall}/100</div>
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
                  <span className="text-green-600 mt-0.5">✓</span>
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
                  <span className="text-yellow-600 mt-0.5">!</span>
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
