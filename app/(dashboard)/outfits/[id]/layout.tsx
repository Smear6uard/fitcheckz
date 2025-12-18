import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"

interface Props {
  params: Promise<{ id: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  // Try to fetch outfit data for rich OG metadata
  try {
    const supabase = await createClient()
    const { data: outfit } = await supabase
      .from("outfit_suggestions")
      .select("occasion, overall_score, visualization_url")
      .eq("id", id)
      .single()

    const title = outfit?.occasion
      ? `${outfit.occasion} Outfit - Styleum`
      : "Outfit Suggestion - Styleum"

    const description = outfit?.overall_score
      ? `Check out this ${outfit.occasion || "outfit"} recommendation with a score of ${outfit.overall_score}/100!`
      : "AI-powered outfit recommendation from your real wardrobe."

    // Use visualization if available, otherwise use OG image generator
    const ogImage = outfit?.visualization_url || `/api/share/${id}/og`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    }
  } catch {
    // Fallback metadata if fetch fails
    return {
      title: "Outfit Suggestion - Styleum",
      description: "AI-powered outfit recommendation from your real wardrobe.",
      openGraph: {
        title: "Outfit Suggestion - Styleum",
        description: "AI-powered outfit recommendation from your real wardrobe.",
        images: [`/api/share/${id}/og`],
      },
    }
  }
}

export default function OutfitDetailLayout({ children }: Props) {
  return <>{children}</>
}
