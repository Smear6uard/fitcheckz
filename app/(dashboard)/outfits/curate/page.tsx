"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OutfitGenerator } from "@/components/outfits/OutfitGenerator"
import { OutfitCard } from "@/components/outfits/OutfitCard"
import { OutfitFeed } from "@/components/outfits/OutfitFeed"
import { PreferenceBar } from "@/components/outfits/PreferenceBar"
import { StarterOutfitCard } from "@/components/outfits/StarterOutfitCard"
import { CurationStatus, type CurationState } from "@/components/outfits/CurationStatus"
import { Button } from "@/components/ui/button"
import { Shirt, Plus, ArrowRight } from "lucide-react"
import { fetchWithRetry, handleApiError, parseApiError } from "@/lib/utils/api-error-handler"
import { useOutfitCache } from "@/lib/hooks/useOutfitCache"
import { useIsMobile } from "@/lib/hooks/useMediaQuery"
import { animated, useTransition, config } from "@react-spring/web"
import Link from "next/link"

export default function CuratePage() {
  // Responsive detection
  const isMobile = useIsMobile()

  // Outfit caching
  const { cachedOutfits, setCachedOutfits, isHydrated } = useOutfitCache()

  // Curation state
  const [curationState, setCurationState] = useState<CurationState>("idle")
  const [pendingOutfits, setPendingOutfits] = useState<any[]>([])
  const [revealedOutfits, setRevealedOutfits] = useState<any[]>([])
  const [showStarterCard, setShowStarterCard] = useState(false)
  const revealIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasHydratedRef = useRef(false)

  // Preference tracking for PreferenceBar
  const [selectedPreferences, setSelectedPreferences] = useState<{
    occasion?: string
    timeOfDay?: string
    season?: string
    mood?: string
  }>({})

  // Feed mode state - when true, form is hidden and full-screen feed is shown
  const [isFeedActive, setIsFeedActive] = useState(false)

  // Session-only likes (local state, not persisted to DB)
  const [sessionLikes, setSessionLikes] = useState<Set<string>>(new Set())

  // Other state
  const [wardrobeItemCount, setWardrobeItemCount] = useState<number | null>(null)
  const [checkingWardrobe, setCheckingWardrobe] = useState(true)

  // Check if user has reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  // Hydrate from cache on initial mount only
  useEffect(() => {
    if (isHydrated && !hasHydratedRef.current) {
      hasHydratedRef.current = true
      if (cachedOutfits.length > 0) {
        setRevealedOutfits(cachedOutfits)
        if (isMobile) {
          setIsFeedActive(true)
        }
      }
    }
  }, [isHydrated, cachedOutfits, isMobile])

  // Check wardrobe on mount
  useEffect(() => {
    const checkWardrobe = async () => {
      try {
        const res = await fetch("/api/wardrobe/stats")
        if (res.ok) {
          const data = await res.json()
          setWardrobeItemCount(data.totalItems || 0)
        }
      } catch (error) {
        console.error("Failed to check wardrobe:", error)
      } finally {
        setCheckingWardrobe(false)
      }
    }
    checkWardrobe()
  }, [])

  // Progressive reveal effect
  useEffect(() => {
    if (pendingOutfits.length === 0) return

    let currentIndex = 0
    setCurationState("revealing")

    if (revealIntervalRef.current) {
      clearInterval(revealIntervalRef.current)
    }

    const staggerMs = prefersReducedMotion ? 100 : 250
    const outfitsToReveal = [...pendingOutfits]

    revealIntervalRef.current = setInterval(() => {
      if (currentIndex >= outfitsToReveal.length) {
        if (revealIntervalRef.current) {
          clearInterval(revealIntervalRef.current)
        }
        setCurationState("idle")
        setPendingOutfits([])
        setShowStarterCard(false)
        if (isMobile) {
          setIsFeedActive(true)
        }
        return
      }

      const outfitToAdd = outfitsToReveal[currentIndex]
      setRevealedOutfits((prev) => {
        if (prev.some((o) => o.id === outfitToAdd.id)) {
          return prev
        }
        return [...prev, outfitToAdd]
      })

      if (currentIndex === 0) {
        setShowStarterCard(false)
      }
      currentIndex++
    }, staggerMs)

    return () => {
      if (revealIntervalRef.current) {
        clearInterval(revealIntervalRef.current)
      }
    }
  }, [pendingOutfits, prefersReducedMotion, isMobile])

  // Callbacks for OutfitGenerator
  const handleStartCuration = useCallback(() => {
    setCurationState("curating")
    setShowStarterCard(true)
  }, [])

  const handleOutfitsReady = useCallback((outfits: any[]) => {
    setCachedOutfits(outfits)
    setRevealedOutfits([])
    setPendingOutfits(outfits)
    if (isMobile) {
      setIsFeedActive(true)
    }
  }, [setCachedOutfits, isMobile])

  const handleCurationError = useCallback(() => {
    setCurationState("error")
    setShowStarterCard(false)
  }, [])

  const handleRetry = useCallback(() => {
    setCurationState("idle")
  }, [])

  // Session-only like handler
  const handleSessionLike = useCallback((id: string, liked: boolean) => {
    setSessionLikes((prev) => {
      const next = new Set(prev)
      if (liked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
    setRevealedOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, liked } : o))
    )
  }, [])

  // Favorite handler - persists to DB
  const handleFavorite = async (id: string, favorited: boolean) => {
    try {
      const res = await fetchWithRetry(`/api/outfits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: favorited }),
      })

      if (!res.ok) {
        throw await parseApiError(res)
      }

      setRevealedOutfits((prev) =>
        prev.map((o) => (o.id === id ? { ...o, liked: favorited } : o))
      )
    } catch (error) {
      handleApiError(error, "Update Favorite")
    }
  }

  // Curate more handler
  const handleCurateMore = useCallback(() => {
    setIsFeedActive(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Outfit card transitions for progressive reveal (desktop only)
  const outfitTransitions = useTransition(revealedOutfits, {
    keys: (outfit) => outfit.id,
    from: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, transform: "translateY(20px)" },
    enter: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, transform: "translateY(0px)" },
    config: config.gentle,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Style Me</h1>
        <p className="text-muted-foreground">
          Get personalized outfit recommendations from your wardrobe
        </p>
      </div>

      {checkingWardrobe ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </CardContent>
        </Card>
      ) : wardrobeItemCount !== null && wardrobeItemCount < 2 ? (
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Shirt className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Build Your Wardrobe First</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              You need at least 2 items in your wardrobe to curate outfit recommendations.
              Add your clothing items to unlock personalized styling!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/wardrobe/upload">
                  <Plus className="h-4 w-4" />
                  Add Items to Wardrobe
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/wardrobe">
                  View Your Wardrobe
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Show PreferenceBar when in feed mode on mobile */}
          {isMobile && isFeedActive && revealedOutfits.length > 0 && (
            <PreferenceBar
              preferences={selectedPreferences}
              onEdit={() => setIsFeedActive(false)}
              onClear={() => {
                setSelectedPreferences({})
                setIsFeedActive(false)
              }}
              className="mb-4"
            />
          )}

          {/* Generator Card - hidden when feed is active on mobile */}
          {(!isMobile || !isFeedActive) && (
            <Card>
              <CardHeader>
                <CardTitle>Curate New Looks</CardTitle>
                <CardDescription>
                  Select your preferences and we&apos;ll find the perfect outfit combinations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OutfitGenerator
                  onStartCuration={handleStartCuration}
                  onOutfitsReady={handleOutfitsReady}
                  onCurationError={handleCurationError}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Curation Status */}
      {curationState !== "idle" && (
        <CurationStatus
          state={curationState}
          revealedCount={revealedOutfits.length}
          totalCount={pendingOutfits.length || revealedOutfits.length}
          onRetry={handleRetry}
        />
      )}

      {/* Curated Outfits - Responsive Display */}
      {(revealedOutfits.length > 0 || showStarterCard) && (
        <div className="space-y-4">
          {!isMobile && (
            <h2 className="text-2xl font-semibold">Your Curated Looks</h2>
          )}

          {/* Mobile: Full-screen vertical swipe feed */}
          {isMobile ? (
            <div className="-mx-4 -mb-4">
              {showStarterCard && revealedOutfits.length === 0 ? (
                <div className="px-4">
                  <StarterOutfitCard />
                </div>
              ) : (
                <OutfitFeed
                  outfits={revealedOutfits}
                  onLike={handleSessionLike}
                  onFavorite={handleFavorite}
                  onCurateMore={handleCurateMore}
                />
              )}
            </div>
          ) : (
            /* Desktop: Grid layout */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {showStarterCard && revealedOutfits.length === 0 && (
                <div className="w-full max-w-md">
                  <StarterOutfitCard />
                </div>
              )}

              {outfitTransitions((style, outfit) => (
                <animated.div
                  key={outfit.id}
                  style={style}
                  className="w-full max-w-md"
                >
                  <OutfitCard
                    outfit={outfit}
                    variant="grid"
                    onLike={handleSessionLike}
                    onFavorite={handleFavorite}
                  />
                </animated.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
