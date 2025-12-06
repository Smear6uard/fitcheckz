import { DashboardStatsSkeleton } from "@/components/dashboard/DashboardStatsSkeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-muted animate-pulse rounded" />
        <div className="h-5 w-96 bg-muted animate-pulse rounded" />
      </div>

      <DashboardStatsSkeleton />
    </div>
  )
}
