import { Metadata } from "next"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "FitCheckz - AI-Powered Style",
  description: "Discover and share outfit inspiration with the FitCheckz community",
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream to-white">
      {/* Simple header for public pages */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-lime" />
            <span className="text-xl font-bold bg-gradient-to-r from-brand-charcoal to-brand-teal bg-clip-text text-transparent">
              FitCheckz
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Simple footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} FitCheckz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
