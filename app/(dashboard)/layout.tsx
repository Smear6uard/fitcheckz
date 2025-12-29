import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BottomNav } from "@/components/navigation/BottomNav"
import { DashboardClientWrapper } from "@/components/layout/DashboardClientWrapper"
import { OnboardingGuard } from "@/components/layout/OnboardingGuard"
import { SidebarProvider } from "@/components/navigation/SidebarContext"
import { Sidebar } from "@/components/navigation/Sidebar"
import { TopBar } from "@/components/navigation/TopBar"
import { MobileNavOverlay } from "@/components/navigation/MobileNavOverlay"
import { DashboardContent } from "@/components/navigation/DashboardContent"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardClientWrapper>
      <OnboardingGuard>
        <SidebarProvider>
          <div className="min-h-screen bg-background">
            {/* Desktop sidebar - hidden on mobile */}
            <Sidebar className="hidden md:flex" />

            {/* Main content area */}
            <DashboardContent>
              <TopBar />
              <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
                {children}
              </main>
            </DashboardContent>

            {/* Mobile navigation overlay */}
            <MobileNavOverlay />

            {/* Mobile bottom nav for quick access */}
            <BottomNav />
          </div>
        </SidebarProvider>
      </OnboardingGuard>
    </DashboardClientWrapper>
  )
}

