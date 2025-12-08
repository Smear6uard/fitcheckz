"use client"

import { ReactNode } from "react"
import { ErrorBoundary } from "@/components/error/ErrorBoundary"
import { OfflineBanner } from "@/components/error/OfflineBanner"
import { FloatingActionButton } from "@/components/ui/floating-action-button"

interface DashboardClientWrapperProps {
  children: ReactNode
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  return (
    <>
      <OfflineBanner />
      <ErrorBoundary>{children}</ErrorBoundary>
      <FloatingActionButton />
    </>
  )
}
