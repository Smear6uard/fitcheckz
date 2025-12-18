import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, DM_Sans, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { QueryProvider } from "@/lib/query/provider"
import { CookieConsent } from "@/components/ui/cookie-consent"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Styleum - Your AI Personal Stylist",
  description:
    "Your wardrobe, elevated. AI-powered outfit recommendations from your real closet.",
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
    description: "Your wardrobe, elevated.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/Favicon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${geistMono.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased">
        <QueryProvider>
          {children}
          <Toaster position="top-center" theme="dark" />
          <Analytics />
          <CookieConsent />
        </QueryProvider>
      </body>
    </html>
  )
}
