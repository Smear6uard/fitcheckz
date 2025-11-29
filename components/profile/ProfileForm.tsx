"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Profile {
  username: string
  body_type: string | null
  height_cm: number | null
  budget_range: string | null
  skin_tone: string | null
  aesthetic_preference: string | null
}

export function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    body_type: "",
    height_cm: "",
    budget_range: "",
    skin_tone: "",
    aesthetic_preference: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile")
      if (!res.ok) throw new Error("Failed to fetch profile")
      const data = await res.json()
      setProfile(data)
      setFormData({
        username: data.username || "",
        body_type: data.body_type || "",
        height_cm: data.height_cm?.toString() || "",
        budget_range: data.budget_range || "",
        skin_tone: data.skin_tone || "",
        aesthetic_preference: data.aesthetic_preference || "",
      })
    } catch (error: any) {
      toast.error(error.message || "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updateData = {
        username: formData.username,
        body_type: formData.body_type || null,
        height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
        budget_range: formData.budget_range || null,
        skin_tone: formData.skin_tone || null,
        aesthetic_preference: formData.aesthetic_preference || null,
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (!res.ok) throw new Error("Failed to update profile")

      toast.success("Profile updated!")
      await fetchProfile()
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          disabled={saving}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body_type">Body Type</Label>
        <Select
          value={formData.body_type}
          onValueChange={(value) => setFormData({ ...formData, body_type: value })}
          disabled={saving}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select body type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="petite">Petite</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="tall">Tall</SelectItem>
            <SelectItem value="plus-size">Plus Size</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="height_cm">Height (cm)</Label>
        <Input
          id="height_cm"
          type="number"
          value={formData.height_cm}
          onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
          placeholder="170"
          disabled={saving}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget_range">Budget Range</Label>
        <Select
          value={formData.budget_range}
          onValueChange={(value) => setFormData({ ...formData, budget_range: value })}
          disabled={saving}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select budget range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Budget</SelectItem>
            <SelectItem value="mid">Mid-range</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skin_tone">Skin Tone (Optional)</Label>
        <Select
          value={formData.skin_tone}
          onValueChange={(value) => setFormData({ ...formData, skin_tone: value })}
          disabled={saving}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select skin tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="deep">Deep</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="aesthetic_preference">Aesthetic Preference</Label>
        <Select
          value={formData.aesthetic_preference}
          onValueChange={(value) =>
            setFormData({ ...formData, aesthetic_preference: value })
          }
          disabled={saving}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select aesthetic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimalist">Minimalist</SelectItem>
            <SelectItem value="trendy">Trendy</SelectItem>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="edgy">Edgy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}

