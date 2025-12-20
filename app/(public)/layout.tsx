import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Styleum - AI-Powered Style",
  description: "Discover and share outfit inspiration with the Styleum community",
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
            <Image
              src="/favicon.png"
              alt="Styleum"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-brand-charcoal to-brand-teal bg-clip-text text-transparent">
              Styleum
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
            &copy; {new Date().getFullYear()} Styleum. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
