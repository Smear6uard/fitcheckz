import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { HeroScroll } from "@/components/landing/hero-scroll"
import { VideoSection } from "@/components/landing/video-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { OutfitShowcaseSection } from "@/components/landing/outfit-showcase-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FAQSection } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import { StructuredData } from "@/components/seo/structured-data"

export const metadata: Metadata = {
  metadataBase: new URL("https://styleum.app"),
  title: "Styleum — Get 6 Outfit Picks Every Morning | Wardrobe Stylist App",
  description:
    "Stop staring at your closet. Styleum gives you 6 personalized outfit suggestions every morning based on your wardrobe, weather, and style. Free to start.",
  keywords: [
    "outfit planner",
    "wardrobe app",
    "what to wear today",
    "daily outfit suggestions",
    "closet organizer",
    "style assistant",
    "morning outfit picks",
    "wardrobe stylist",
    "fashion app",
    "outfit ideas",
  ],
  authors: [{ name: "Styleum" }],
  creator: "Styleum",
  publisher: "Sameer Studios LLC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://styleum.app",
    siteName: "Styleum",
    title: "Styleum — Get 6 Outfit Picks Every Morning",
    description:
      "Stop staring at your closet. Get personalized outfit suggestions every morning based on your wardrobe, weather, and calendar.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Styleum - Your daily outfit assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Styleum — Get 6 Outfit Picks Every Morning",
    description:
      "Stop staring at your closet. Get personalized outfit suggestions every morning.",
    images: ["/images/og-image.jpg"],
    creator: "@styleum",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://styleum.app",
  },
  category: "lifestyle",
}

export default function LandingPage() {
  return (
    <>
      <StructuredData />
      <Header />
      <main id="main-content">
        <HeroScroll />
        <VideoSection />
        <HowItWorksSection />
        <OutfitShowcaseSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
