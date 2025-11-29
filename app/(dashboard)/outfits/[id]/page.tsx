"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OutfitViewer } from "@/components/outfits/OutfitViewer"
import { OutfitFeedback } from "@/components/outfits/OutfitFeedback"
import { toast } from "sonner"
import { ArrowLeft, Check } from "lucide-react"

export default function OutfitDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [outfit, setOutfit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchOutfit(params.id as string)
    }
  }, [params.id])

  const fetchOutfit = async (id: string) => {
    try {
      const res = await fetch("/api/outfits/history")
      if (!res.ok) throw new Error("Failed to fetch outfits")
      const outfits = await res.json()
      const foundOutfit = outfits.find((o: any) => o.id === id)
      if (foundOutfit) {
        setOutfit(foundOutfit)
      } else {
        toast.error("Outfit not found")
        router.push("/outfits")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load outfit")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkWorn = async () => {
    if (!outfit) return

    try {
      const res = await fetch(`/api/outfits/${outfit.id}/mark-worn`, {
        method: "POST",
      })

      if (!res.ok) throw new Error("Failed to mark as worn")

      toast.success("Outfit marked as worn!")
      fetchOutfit(outfit.id)
    } catch (error: any) {
      toast.error(error.message || "Failed to mark outfit")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!outfit) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {!outfit.worn && (
          <Button onClick={handleMarkWorn} variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Mark as Worn
          </Button>
        )}
      </div>

      <OutfitViewer outfit={outfit} />

      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>
            Help us improve by sharing your experience with this outfit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OutfitFeedback
            outfitId={outfit.id}
            onSubmitted={() => fetchOutfit(outfit.id)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

