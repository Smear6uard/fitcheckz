"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface OutfitFeedbackProps {
  outfitId: string
  onSubmitted?: () => void
}

export function OutfitFeedback({ outfitId, onSubmitted }: OutfitFeedbackProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    rating: "",
    feedback_text: "",
    actually_worn: false,
    compliments: "",
    comfort_level: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/outfits/${outfitId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: formData.rating ? parseInt(formData.rating) : null,
          feedback_text: formData.feedback_text || null,
          actually_worn: formData.actually_worn,
          compliments: formData.compliments ? parseInt(formData.compliments) : 0,
          comfort_level: formData.comfort_level ? parseInt(formData.comfort_level) : null,
        }),
      })

      if (!res.ok) throw new Error("Failed to submit feedback")

      toast.success("Feedback submitted!")
      if (onSubmitted) {
        onSubmitted()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rating">Rating (1-5)</Label>
        <Select
          value={formData.rating}
          onValueChange={(value) => setFormData({ ...formData, rating: value })}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Poor</SelectItem>
            <SelectItem value="2">2 - Fair</SelectItem>
            <SelectItem value="3">3 - Good</SelectItem>
            <SelectItem value="4">4 - Very Good</SelectItem>
            <SelectItem value="5">5 - Excellent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback_text">Feedback</Label>
        <Input
          id="feedback_text"
          value={formData.feedback_text}
          onChange={(e) =>
            setFormData({ ...formData, feedback_text: e.target.value })
          }
          placeholder="Tell us what you think..."
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comfort_level">Comfort Level (1-5)</Label>
        <Select
          value={formData.comfort_level}
          onValueChange={(value) =>
            setFormData({ ...formData, comfort_level: value })
          }
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select comfort level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Uncomfortable</SelectItem>
            <SelectItem value="2">2 - Somewhat Uncomfortable</SelectItem>
            <SelectItem value="3">3 - Neutral</SelectItem>
            <SelectItem value="4">4 - Comfortable</SelectItem>
            <SelectItem value="5">5 - Very Comfortable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="compliments">Number of Compliments</Label>
        <Input
          id="compliments"
          type="number"
          min="0"
          value={formData.compliments}
          onChange={(e) =>
            setFormData({ ...formData, compliments: e.target.value })
          }
          disabled={loading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="actually_worn"
          checked={formData.actually_worn}
          onChange={(e) =>
            setFormData({ ...formData, actually_worn: e.target.checked })
          }
          className="rounded"
          disabled={loading}
        />
        <Label htmlFor="actually_worn" className="text-sm">
          I actually wore this outfit
        </Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  )
}

