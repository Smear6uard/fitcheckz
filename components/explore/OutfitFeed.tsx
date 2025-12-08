"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { animated, useTransition, config } from "@react-spring/web"
import { Loader2, Sparkles, Filter } from "lucide-react"
import { ExploreOutfitCard } from "./ExploreOutfitCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const OCCASIONS = [
  { value: "all", label: "All Occasions" },
  { value: "casual", label: "Casual" },
  { value: "work", label: "Work" },
  { value: "formal", label: "Formal" },
  { value: "date", label: "Date Night" },
  { value: "party", label: "Party" },
  { value: "athletic", label: "Athletic" },
]

interface OutfitFeedProps {
  currentUserId?: string
}

export function OutfitFeed({ currentUserId }: OutfitFeedProps) {
  const [outfits, setOutfits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [occasion, setOccasion] = useState("all")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Fetch outfits
  const fetchOutfits = useCallback(
    async (pageNum: number, reset = false) => {
      if (reset) {
        setIsLoading(true)
        setOutfits([])
      } else {
        setIsLoadingMore(true)
      }

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "12",
        })

        if (occasion !== "all") {
          params.set("occasion", occasion)
        }

        const res = await fetch(`/api/community/explore?${params}`)

        if (res.ok) {
          const data = await res.json()

          if (reset) {
            setOutfits(data.outfits || [])
          } else {
            setOutfits((prev) => [...prev, ...(data.outfits || [])])
          }

          setHasMore(data.pagination?.hasMore || false)
        }
      } catch (error) {
        console.error("Error fetching outfits:", error)
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [occasion]
  )

  // Initial fetch and refetch on filter change
  useEffect(() => {
    setPage(1)
    fetchOutfits(1, true)
  }, [occasion, fetchOutfits])

  // Infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          setPage((prev) => prev + 1)
          fetchOutfits(page + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoadingMore, isLoading, page, fetchOutfits])

  // Animation for outfit cards
  const transitions = useTransition(outfits, {
    keys: (outfit) => outfit.id,
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    config: config.gentle,
    trail: 50,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal mb-4" />
        <p className="text-muted-foreground">Loading trending outfits...</p>
      </div>
    )
  }

  if (outfits.length === 0) {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={occasion} onValueChange={setOccasion}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by occasion" />
              </SelectTrigger>
              <SelectContent>
                {OCCASIONS.map((occ) => (
                  <SelectItem key={occ.value} value={occ.value}>
                    {occ.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <EmptyState
          icon={Sparkles}
          title="No public outfits yet"
          description="Be the first to share your style! Make your outfits public to appear here and inspire others."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((occ) => (
              <Badge
                key={occ.value}
                variant={occasion === occ.value ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  occasion === occ.value
                    ? "bg-brand-teal hover:bg-brand-teal/90"
                    : "hover:bg-muted"
                )}
                onClick={() => setOccasion(occ.value)}
              >
                {occ.label}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {outfits.length} outfit{outfits.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Outfit grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {transitions((style, outfit) => (
          <animated.div style={style}>
            <ExploreOutfitCard
              outfit={outfit}
              currentUserId={currentUserId}
            />
          </animated.div>
        ))}
      </div>

      {/* Load more sentinel */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {isLoadingMore && (
          <Loader2 className="h-6 w-6 animate-spin text-brand-teal" />
        )}
        {!hasMore && outfits.length > 0 && (
          <p className="text-sm text-muted-foreground">
            You've seen all the outfits!
          </p>
        )}
      </div>
    </div>
  )
}
