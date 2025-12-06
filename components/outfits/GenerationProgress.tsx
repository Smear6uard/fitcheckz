import { Progress } from "@/components/ui/progress"
import { Sparkles } from "lucide-react"

interface GenerationProgressProps {
  stage: number
}

const STAGES = [
  { label: "Analyzing your wardrobe...", progress: 0 },
  { label: "Finding perfect combinations...", progress: 33 },
  { label: "Finalizing your outfits...", progress: 66 },
  { label: "Almost ready...", progress: 90 },
]

export function GenerationProgress({ stage }: GenerationProgressProps) {
  const currentStage = STAGES[Math.min(stage, STAGES.length - 1)]

  return (
    <div className="space-y-4 py-8">
      <div className="flex items-center justify-center gap-3">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <p className="text-lg font-medium">{currentStage.label}</p>
      </div>
      <Progress value={currentStage.progress} className="h-2" />
      <p className="text-center text-sm text-muted-foreground">
        This may take 10-15 seconds
      </p>
    </div>
  )
}
