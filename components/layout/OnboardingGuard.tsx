"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkOnboarding = async () => {
      // Allow access to onboarding page
      if (pathname === "/onboarding") {
        setIsChecking(false)
        return
      }

      try {
        const res = await fetch("/api/onboarding")
        if (res.ok) {
          const data = await res.json()
          if (!data.completed) {
            router.push("/onboarding")
            return
          }
        }
      } catch (error) {
        console.error("Failed to check onboarding status:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkOnboarding()
  }, [pathname, router])

  // Show loading state while checking
  if (isChecking && pathname !== "/onboarding") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

