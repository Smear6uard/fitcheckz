"use client"

import { useState } from "react"
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

export function OutfitGenerator({ onGenerate }: { onGenerate: (outfits: any[]) => void }) {
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState({
    occasion: "",
    season: "",
    mood: "",
    timeOfDay: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/outfits/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to generate outfits")
      }

      const data = await res.json()
      onGenerate(data.outfits)
      toast.success("Outfits generated!")
    } catch (error: any) {
      toast.error(error.message || "Failed to generate outfits")
    } finally {
      setLoading(false)
    }
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
        {loading ? "Generating..." : "Generate Outfits"}
      </Button>
    </form>
  )
}

