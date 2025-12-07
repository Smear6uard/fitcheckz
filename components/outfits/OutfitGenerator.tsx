"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Sparkles } from "lucide-react"
import { GenerationProgress } from "./GenerationProgress"
import { fetchWithRetry, handleApiError, parseApiError } from "@/lib/utils/api-error-handler"

export function OutfitGenerator({ onGenerate }: { onGenerate: (outfits: any[]) => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [progressStage, setProgressStage] = useState(0)
  const [params, setParams] = useState({
    occasion: "",
    season: "",
    mood: "",
    timeOfDay: "",
  })

  // Progress stage advancement while loading
  useEffect(() => {
    if (!loading) {
      setProgressStage(0)
      return
    }

    // Stage 0: Analyzing wardrobe (0s)
    // Stage 1: Finding combinations (3s)
    // Stage 2: Finalizing outfits (6s)
    // Stage 3: Almost ready (9s)
    const timers = [
      setTimeout(() => setProgressStage(1), 3000),
      setTimeout(() => setProgressStage(2), 6000),
      setTimeout(() => setProgressStage(3), 9000),
    ]

    return () => timers.forEach(clearTimeout)
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setProgressStage(0)

    try {
      const res = await fetchWithRetry(
        "/api/outfits/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        },
        {
          maxRetries: 2,
          onRetry: (attempt) => {
            toast.info(`Retrying... (attempt ${attempt}/2)`)
          },
        }
      )

      if (!res.ok) {
        throw await parseApiError(res)
      }

      const data = await res.json()

      // Redirect to swipe page with outfits
      const outfitsParam = encodeURIComponent(JSON.stringify(data.outfits))
      router.push(`/outfits/swipe?outfits=${outfitsParam}`)

      toast.success("Outfits generated!")
    } catch (error: unknown) {
      handleApiError(error, "Outfit Generation")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <GenerationProgress stage={progressStage} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="occasion">Occasion</Label>
          <Select
            value={params.occasion}
            onValueChange={(value) => setParams({ ...params, occasion: value })}
            required
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="gym">Gym</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="season">Season</Label>
          <Select
            value={params.season}
            onValueChange={(value) => setParams({ ...params, season: value })}
            required
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spring">Spring</SelectItem>
              <SelectItem value="summer">Summer</SelectItem>
              <SelectItem value="fall">Fall</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
              <SelectItem value="all-season">All Season</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mood">Mood</Label>
          <Select
            value={params.mood}
            onValueChange={(value) => setParams({ ...params, mood: value })}
            required
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="safe">Safe</SelectItem>
              <SelectItem value="trendy">Trendy</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="comfortable">Comfortable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeOfDay">Time of Day</Label>
          <Select
            value={params.timeOfDay}
            onValueChange={(value) => setParams({ ...params, timeOfDay: value })}
            required
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" />
        Generate Outfits
      </Button>
    </form>
  )
}

