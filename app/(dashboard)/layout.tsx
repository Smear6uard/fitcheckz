import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/common/Navbar"
import { BottomNav } from "@/components/navigation/BottomNav"
import { DashboardClientWrapper } from "@/components/layout/DashboardClientWrapper"

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">{children}</main>
        <BottomNav />
      </div>
    </DashboardClientWrapper>
  )
}

