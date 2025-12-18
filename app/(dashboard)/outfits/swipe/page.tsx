"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SwipeCard } from "@/components/outfits/SwipeCard"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { fetchWithRetry, handleApiError } from "@/lib/utils/api-error-handler"

function SwipePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [outfits, setOutfits] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [likedCount, setLikedCount] = useState(0)

  // Get outfits by IDs from URL params
  useEffect(() => {
    async function fetchOutfits() {
      try {
        const idsParam = searchParams.get('ids')

        // Support legacy format (full JSON) for backwards compatibility
        const outfitsParam = searchParams.get('outfits')
        if (outfitsParam) {
          try {
            const parsedOutfits = JSON.parse(decodeURIComponent(outfitsParam))
            setOutfits(parsedOutfits)
            setLoading(false)
            return
          } catch {
            // Fall through to ID-based fetching
          }
        }

        if (!idsParam) {
          setLoading(false)
          return
        }

        // Fetch outfits by IDs
        const ids = idsParam.split(',').filter(Boolean)
        if (ids.length === 0) {
          setLoading(false)
          return
        }

        const res = await fetch(`/api/outfits?ids=${encodeURIComponent(ids.join(','))}`)

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to fetch outfits')
        }

        const data = await res.json()
        const fetchedOutfits = data.outfits || []
        
        // Ensure outfits have items array
        const outfitsWithItems = fetchedOutfits.map((outfit: any) => ({
          ...outfit,
          items: outfit.items || [],
        }))
        
        setOutfits(outfitsWithItems)
      } catch (error) {
        console.error('Failed to load outfits:', error)
        toast.error('Failed to load outfits')
        router.push('/outfits')
      } finally {
        setLoading(false)
      }
    }

    fetchOutfits()
  }, [searchParams, router])

  const moveToNext = () => {
    if (currentIndex < outfits.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      showSummary()
    }
  }

  const showSummary = () => {
    const message = likedCount > 0
      ? `Great! You liked ${likedCount} out of ${outfits.length} outfits.`
      : `No worries! Generate more outfits to find your perfect match.`

    toast.success(message, { duration: 3000 })
    setTimeout(() => router.push('/outfits?tab=favorites'), 1500)
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

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-[9999]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading outfits...</p>
        </div>
      </div>
    )
  }

  // No outfits state
  if (outfits.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-4 z-[9999]">
        <p className="text-lg text-muted-foreground mb-4">No outfits to show</p>
        <Button onClick={() => router.push('/outfits')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Outfits
        </Button>
      </div>
    )
  }

  // Main content
  const currentOutfit = outfits[currentIndex]

  // No current outfit
  if (!currentOutfit) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-4 z-[9999]">
        <p className="text-lg text-muted-foreground mb-4">No outfit available</p>
        <Button onClick={() => router.push('/outfits')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Outfits
        </Button>
      </div>
    )
  }

  // Main content - use inline styles for bulletproof full-screen coverage
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
      }}
      className="bg-background"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b bg-background shrink-0">
        <Button variant="ghost" size="sm" onClick={() => router.push('/outfits')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-sm font-medium">
          {currentIndex + 1} / {outfits.length}
        </div>
        <div className="w-16" />
      </div>

      {/* Swipe Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <SwipeCard
          outfit={currentOutfit}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
        />
      </div>

      {/* Bottom Actions */}
      <div className="p-4 flex justify-center gap-6 border-t bg-background">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16"
          onClick={handleSwipeLeft}
        >
          <X className="h-7 w-7" />
        </Button>
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90"
          onClick={handleSwipeRight}
        >
          <Heart className="h-7 w-7 fill-current" />
        </Button>
      </div>
    </div>
  )
}

export default function OutfitSwipePage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-background z-[9999]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <SwipePageContent />
    </Suspense>
  )
}
