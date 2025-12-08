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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Globe, Lock } from "lucide-react"
import { toast } from "sonner"

interface Profile {
  username: string
  display_name: string | null
  bio: string | null
  is_public: boolean
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
    display_name: "",
    bio: "",
    is_public: false,
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
        display_name: data.display_name || "",
        bio: data.bio || "",
        is_public: data.is_public || false,
        body_type: data.body_type || "",
        height_cm: data.height_cm?.toString() || "",
        budget_range: data.budget_range || "",
        skin_tone: data.skin_tone || "",
        aesthetic_preference: data.aesthetic_preference || "",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load profile"
      toast.error(message)
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
        display_name: formData.display_name || null,
        bio: formData.bio || null,
        is_public: formData.is_public,
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Public Profile Toggle */}
      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">Public Profile</Label>
            <p className="text-sm text-muted-foreground">
              Make your profile visible to other users in the community
            </p>
          </div>
          <div className="flex items-center gap-2">
            {formData.is_public ? (
              <Globe className="h-4 w-4 text-brand-teal" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
            <Switch
              checked={formData.is_public}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, is_public: checked })
              }
              disabled={saving}
            />
          </div>
        </div>
        {formData.is_public && (
          <p className="text-xs text-brand-teal">
            Your profile will be visible at fitcheckz.com/u/{formData.username}
          </p>
        )}
      </div>

      <Separator />

      {/* Basic Info Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            disabled={saving}
          />
          <p className="text-xs text-muted-foreground">
            This is your unique handle (letters, numbers, underscores only)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="Your Name"
            disabled={saving}
          />
          <p className="text-xs text-muted-foreground">
            This is how your name will appear to others
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell others about your style..."
            maxLength={200}
            disabled={saving}
            className="resize-none"
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            {formData.bio.length}/200 characters
          </p>
        </div>
      </div>

      <Separator />

      {/* Style Preferences Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Style Preferences</h3>

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
      </div>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}

