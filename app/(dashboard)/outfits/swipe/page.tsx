"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SwipeCard } from "@/components/outfits/SwipeCard"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { fetchWithRetry, handleApiError, parseApiError } from "@/lib/utils/api-error-handler"

function SwipePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [outfits, setOutfits] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [likedCount, setLikedCount] = useState(0)

  // Get outfits from URL params (passed as serialized JSON)
  useEffect(() => {
    try {
      const outfitsParam = searchParams.get('outfits')
      if (outfitsParam) {
        const parsedOutfits = JSON.parse(decodeURIComponent(outfitsParam))
        setOutfits(parsedOutfits)
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to parse outfits:', error)
      toast.error('Failed to load outfits')
      router.push('/outfits')
    }
  }, [searchParams, router])

  const moveToNext = () => {
    if (currentIndex < outfits.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Finished all outfits
      showSummary()
    }
  }

  const showSummary = () => {
    const message = likedCount > 0
      ? `Great! You liked ${likedCount} out of ${outfits.length} outfits.`
      : `No worries! Generate more outfits to find your perfect match.`

    toast.success(message, {
      duration: 3000,
    })

    setTimeout(() => {
      router.push('/outfits?tab=favorites')
    }, 1500)
  }

  const handleSwipeRight = async () => {
    const outfit = outfits[currentIndex]
    if (!outfit) return

    try {
      await fetchWithRetry(`/api/outfits/${outfit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: true }),
      })

      setLikedCount(likedCount + 1)
      toast.success("Added to favorites!")
      moveToNext()
    } catch (error) {
      handleApiError(error, "Like Outfit")
    }
  }

  const handleSwipeLeft = () => {
    moveToNext()
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (outfits.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-4">
        <p className="text-lg text-muted-foreground mb-4">No outfits to swipe through</p>
        <Button onClick={() => router.push('/outfits')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Outfits
        </Button>
      </div>
    )
  }

  const currentOutfit = outfits[currentIndex]

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="sm" onClick={() => router.push('/outfits')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-sm font-medium">
          {currentIndex + 1} / {outfits.length}
        </div>
        <div className="w-16" />
      </div>

      {/* Swipe Card */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <SwipeCard
          outfit={currentOutfit}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
        />
      </div>

      {/* Bottom Actions */}
      <div className="p-6 safe-area-bottom flex justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 touch-target-lg"
          onClick={handleSwipeLeft}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          size="lg"
          className="rounded-full w-16 h-16 touch-target-lg bg-red-500 hover:bg-red-600"
          onClick={handleSwipeRight}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

export default function OutfitSwipePage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SwipePageContent />
    </Suspense>
  )
}
