"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WardrobeGrid } from "@/components/wardrobe/WardrobeGrid"
import { WardrobeGridSkeleton } from "@/components/wardrobe/WardrobeGridSkeleton"
import { WardrobeFilters, type FilterState } from "@/components/wardrobe/WardrobeFilters"
import { useWardrobe } from "@/lib/query/wardrobe"
import { usePullToRefresh } from "@/lib/hooks/usePullToRefresh"
import { EmptyState } from "@/components/ui/empty-state"
import { Plus, ChevronLeft, ChevronRight, RefreshCw, AlertTriangle } from "lucide-react"

export default function WardrobePage() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
  })

  // Fetch with server-side pagination and category filter
  const { data, isLoading, error, refetch } = useWardrobe({
    page,
    limit: 20,
    category: filters.category || undefined,
  })

  // Pull-to-refresh on mobile
  const { containerRef, isRefreshing, pullProgress } = usePullToRefresh({
    onRefresh: async () => {
      await refetch()
    },
    threshold: 80,
  })

  // Client-side filtering for search
  const filteredItems = useMemo(() => {
    if (!data?.items) return []

    let filtered = [...data.items]

    if (filters.search) {
      filtered = filtered.filter((item) =>
        item.item_name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    return filtered
  }, [data?.items, filters.search])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    // Reset to page 1 when category changes (server-side filter)
    if (newFilters.category !== filters.category) {
      setPage(1)
    }
  }

  const totalPages = data?.totalPages || 1
  const totalItems = data?.total || 0

  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Failed to load wardrobe"
        description="We couldn't load your wardrobe items. Please check your connection and try again."
        action={{
          label: "Retry",
          onClick: () => refetch(),
        }}
      />
    )
  }

  return (
    <div ref={containerRef} className="space-y-8 disable-overscroll">
      {/* Pull-to-refresh indicator */}
      {pullProgress > 0 && (
        <div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-40 md:hidden"
          style={{
            opacity: pullProgress,
            transform: `translate(-50%, ${pullProgress * 20}px)`,
          }}
        >
          <RefreshCw
            className={`h-6 w-6 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
            style={{
              transform: `rotate(${pullProgress * 360}deg)`,
            }}
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wardrobe</h1>
          <p className="text-muted-foreground">
            Manage your digital closet ({totalItems} items)
          </p>
        </div>
        <Button asChild className="touch-target">
          <Link href="/wardrobe/upload">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Link>
        </Button>
      </div>

      <WardrobeFilters onFilterChange={handleFilterChange} />
      {isLoading ? (
        <WardrobeGridSkeleton count={20} />
      ) : (
        <WardrobeGrid items={filteredItems} />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="touch-target"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="touch-target"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

