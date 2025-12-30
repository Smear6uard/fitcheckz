import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { QueryProvider } from "@/lib/query/provider"
import { CookieConsent } from "@/components/ui/cookie-consent"
import "./globals.css"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Styleum - Your AI Personal Stylist",
  description:
    "Stop staring at your closet. AI-powered outfit recommendations from your real wardrobe.",
  generator: "v0.app",
  keywords: ["AI stylist", "outfit recommendations", "fashion", "wardrobe", "personal styling", "Styleum"],
  authors: [{ name: "Sameer Studios LLC" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Styleum",
  },
  openGraph: {
    title: "Styleum - Your AI Personal Stylist",
    description: "Stop staring at your closet.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#C4515E",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body className="font-sans bg-background text-foreground antialiased">
        <QueryProvider>
          {children}
          <Toaster
            position="top-center"
            theme="light"
            offset={16}
            toastOptions={{
              className: "z-[9999]",
              style: {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              }
            }}
            containerAriaLabel="Notifications"
          />
          <Analytics />
          <CookieConsent />
        </QueryProvider>
      </body>
    </html>
  )
}
