import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitCheckz - Your AI Personal Stylist",
  description:
    "Get your fit checked. Dress with confidence. AI-powered outfit recommendations from your digital wardrobe.",
  generator: "v0.app",
  keywords: ["AI stylist", "outfit recommendations", "fashion", "wardrobe", "personal styling"],
  authors: [{ name: "FitCheckz" }],
  openGraph: {
    title: "FitCheckz - Your AI Personal Stylist",
    description: "Get your fit checked. Dress with confidence.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/Favicon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#32B8C6",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
