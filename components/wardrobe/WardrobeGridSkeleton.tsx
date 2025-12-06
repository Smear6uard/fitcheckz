import { Skeleton } from "@/components/ui/skeleton"

interface WardrobeGridSkeletonProps {
  count?: number
}

export function WardrobeGridSkeleton({ count = 12 }: WardrobeGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          {/* Image skeleton */}
          <Skeleton className="aspect-square rounded-lg" />

          {/* Item name skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
