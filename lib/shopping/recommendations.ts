/**
 * Shopping Recommendations Engine
 * Uses AI to analyze wardrobe gaps and recommend items to purchase
 */

import OpenAI from "openai"

export interface WardrobeItem {
  id: string
  item_name: string
  category: string
  primary_color: string | null
  secondary_colors: string[] | null
  seasons: string[] | null
  occasions: string[] | null
}

export interface WardrobeAnalysis {
  totalItems: number
  categoryBreakdown: Record<string, number>
  colorDistribution: Record<string, number>
  seasonalCoverage: Record<string, number>
  occasionCoverage: Record<string, number>
  missingEssentials: string[]
  styleGaps: string[]
}

export interface ShoppingRecommendation {
  id: string
  title: string
  description: string
  category: string
  suggestedColors: string[]
  priceRange: "budget" | "mid" | "luxury"
  priority: "high" | "medium" | "low"
  reason: string
  searchQuery: string
  imagePrompt: string
}

// Analyze wardrobe and identify gaps
export function analyzeWardrobe(items: WardrobeItem[]): WardrobeAnalysis {
  const categoryBreakdown: Record<string, number> = {}
  const colorDistribution: Record<string, number> = {}
  const seasonalCoverage: Record<string, number> = {
    spring: 0,
    summer: 0,
    fall: 0,
    winter: 0,
  }
  const occasionCoverage: Record<string, number> = {
    casual: 0,
    work: 0,
    formal: 0,
    athletic: 0,
    party: 0,
    date: 0,
  }

  // Count items by category
  items.forEach((item) => {
    // Category
    categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1

    // Colors
    if (item.primary_color) {
      colorDistribution[item.primary_color] =
        (colorDistribution[item.primary_color] || 0) + 1
    }
    item.secondary_colors?.forEach((color) => {
      colorDistribution[color] = (colorDistribution[color] || 0) + 0.5
    })

    // Seasons
    item.seasons?.forEach((season) => {
      if (seasonalCoverage[season] !== undefined) {
        seasonalCoverage[season]++
      }
    })

    // Occasions
    item.occasions?.forEach((occasion) => {
      if (occasionCoverage[occasion] !== undefined) {
        occasionCoverage[occasion]++
      }
    })
  })

  // Identify missing essentials
  const essentials = {
    top: 3,
    bottom: 2,
    shoes: 2,
    jacket: 1,
    accessories: 1,
  }

  const missingEssentials: string[] = []
  Object.entries(essentials).forEach(([category, minCount]) => {
    if ((categoryBreakdown[category] || 0) < minCount) {
      missingEssentials.push(
        `Need ${minCount - (categoryBreakdown[category] || 0)} more ${category}${category !== "accessories" ? "s" : ""}`
      )
    }
  })

  // Identify style gaps
  const styleGaps: string[] = []

  // Check seasonal gaps
  Object.entries(seasonalCoverage).forEach(([season, count]) => {
    if (count < 3) {
      styleGaps.push(`Limited ${season} wardrobe (${count} items)`)
    }
  })

  // Check occasion gaps
  Object.entries(occasionCoverage).forEach(([occasion, count]) => {
    if (count < 2) {
      styleGaps.push(`Few ${occasion} options (${count} items)`)
    }
  })

  // Check color variety
  const colorCount = Object.keys(colorDistribution).length
  if (colorCount < 4) {
    styleGaps.push("Limited color variety")
  }

  // Check for neutrals
  const neutrals = ["black", "white", "gray", "navy", "beige", "cream", "tan"]
  const hasNeutrals = neutrals.some((c) => colorDistribution[c] > 0)
  if (!hasNeutrals) {
    styleGaps.push("Missing neutral basics")
  }

  return {
    totalItems: items.length,
    categoryBreakdown,
    colorDistribution,
    seasonalCoverage,
    occasionCoverage,
    missingEssentials,
    styleGaps,
  }
}

// Generate AI-powered shopping recommendations
export async function generateRecommendations(
  analysis: WardrobeAnalysis,
  userPreferences: {
    aesthetic?: string
    budgetRange?: string
    bodyType?: string
  }
): Promise<ShoppingRecommendation[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const prompt = `You are a fashion stylist AI helping someone build a complete wardrobe. Based on their current wardrobe analysis, suggest 5-8 specific items they should consider purchasing.

Current Wardrobe Analysis:
- Total items: ${analysis.totalItems}
- Categories: ${JSON.stringify(analysis.categoryBreakdown)}
- Colors: ${JSON.stringify(analysis.colorDistribution)}
- Seasonal coverage: ${JSON.stringify(analysis.seasonalCoverage)}
- Occasion coverage: ${JSON.stringify(analysis.occasionCoverage)}
- Missing essentials: ${analysis.missingEssentials.join(", ") || "None"}
- Style gaps: ${analysis.styleGaps.join(", ") || "None"}

User Preferences:
- Style aesthetic: ${userPreferences.aesthetic || "Not specified"}
- Budget: ${userPreferences.budgetRange || "mid"}
- Body type: ${userPreferences.bodyType || "Not specified"}

Return a JSON array of recommendations. Each recommendation should have:
- title: Short product name (e.g., "Classic White Oxford Shirt")
- description: 2-3 sentence description of why this item would help
- category: One of "top", "bottom", "dress", "jacket", "shoes", "accessories", "outerwear"
- suggestedColors: Array of 1-3 suggested colors
- priceRange: "budget", "mid", or "luxury" based on user preference
- priority: "high" for essentials, "medium" for improvements, "low" for nice-to-haves
- reason: One sentence explaining why this fills a gap
- searchQuery: A specific search query to find this item (e.g., "white oxford button down shirt mens")
- imagePrompt: A prompt to describe how this item would look

Return ONLY the JSON array, no other text.`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  })

  const content = response.choices[0]?.message?.content || "[]"

  try {
    // Clean up the response - remove markdown code blocks if present
    let cleanedContent = content.trim()
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.slice(7)
    }
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3)
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3)
    }

    const recommendations = JSON.parse(cleanedContent.trim())

    // Add unique IDs
    return recommendations.map((rec: Omit<ShoppingRecommendation, "id">, index: number) => ({
      ...rec,
      id: `rec-${Date.now()}-${index}`,
    }))
  } catch (error) {
    console.error("Error parsing AI recommendations:", error)
    return []
  }
}

// Get quick recommendations based on simple gap analysis (no AI needed)
export function getQuickRecommendations(
  analysis: WardrobeAnalysis,
  budgetRange: string = "mid"
): ShoppingRecommendation[] {
  const recommendations: ShoppingRecommendation[] = []

  // Check for basic category gaps
  if ((analysis.categoryBreakdown["top"] || 0) < 3) {
    recommendations.push({
      id: `quick-${Date.now()}-1`,
      title: "Classic Neutral Top",
      description:
        "A versatile neutral top is essential for building outfits. It can be dressed up or down and matches with almost anything.",
      category: "top",
      suggestedColors: ["white", "black", "navy"],
      priceRange: budgetRange as "budget" | "mid" | "luxury",
      priority: "high",
      reason: "Your wardrobe needs more tops for outfit variety",
      searchQuery: "classic neutral t-shirt basic",
      imagePrompt: "A simple, well-fitted neutral colored top",
    })
  }

  if ((analysis.categoryBreakdown["bottom"] || 0) < 2) {
    recommendations.push({
      id: `quick-${Date.now()}-2`,
      title: "Well-Fitted Jeans",
      description:
        "Quality denim is a wardrobe foundation. Look for a flattering cut that works with multiple top styles.",
      category: "bottom",
      suggestedColors: ["indigo", "black", "light wash"],
      priceRange: budgetRange as "budget" | "mid" | "luxury",
      priority: "high",
      reason: "Essential bottoms are missing from your wardrobe",
      searchQuery: "high quality jeans comfortable fit",
      imagePrompt: "A pair of well-fitted classic jeans",
    })
  }

  if ((analysis.categoryBreakdown["shoes"] || 0) < 2) {
    recommendations.push({
      id: `quick-${Date.now()}-3`,
      title: "Versatile Sneakers",
      description:
        "A clean pair of sneakers works for casual outings, light exercise, and can even dress down formal looks.",
      category: "shoes",
      suggestedColors: ["white", "black", "gray"],
      priceRange: budgetRange as "budget" | "mid" | "luxury",
      priority: "high",
      reason: "You need more footwear options",
      searchQuery: "minimalist white sneakers comfortable",
      imagePrompt: "Clean minimalist white sneakers",
    })
  }

  // Check for seasonal gaps
  if (analysis.seasonalCoverage["winter"] < 2) {
    recommendations.push({
      id: `quick-${Date.now()}-4`,
      title: "Warm Winter Layer",
      description:
        "Stay stylish in cold weather with a quality jacket or sweater that provides warmth without bulk.",
      category: "jacket",
      suggestedColors: ["camel", "black", "charcoal"],
      priceRange: budgetRange as "budget" | "mid" | "luxury",
      priority: "medium",
      reason: "Your winter wardrobe needs reinforcement",
      searchQuery: "warm winter jacket coat stylish",
      imagePrompt: "A stylish warm winter coat or jacket",
    })
  }

  if (analysis.seasonalCoverage["summer"] < 2) {
    recommendations.push({
      id: `quick-${Date.now()}-5`,
      title: "Breathable Summer Top",
      description:
        "Light, breathable fabrics keep you cool and looking fresh during hot weather.",
      category: "top",
      suggestedColors: ["white", "light blue", "sage"],
      priceRange: budgetRange as "budget" | "mid" | "luxury",
      priority: "medium",
      reason: "Limited summer clothing options",
      searchQuery: "lightweight summer shirt breathable",
      imagePrompt: "A light, breathable summer shirt",
    })
  }

  // Check for occasion gaps
  if (analysis.occasionCoverage["formal"] < 1) {
    recommendations.push({
      id: `quick-${Date.now()}-6`,
      title: "Smart Formal Piece",
      description:
        "Having one versatile formal piece ensures you're prepared for special events, interviews, or important occasions.",
      category: "top",
      suggestedColors: ["white", "light blue", "black"],
      priceRange: budgetRange as "budget" | "mid" | "luxury",
      priority: "medium",
      reason: "No formal wear in your wardrobe",
      searchQuery: "formal dress shirt blazer smart",
      imagePrompt: "An elegant formal shirt or blazer",
    })
  }

  if (analysis.occasionCoverage["athletic"] < 1) {
    recommendations.push({
      id: `quick-${Date.now()}-7`,
      title: "Comfortable Athleisure",
      description:
        "Athleisure pieces work for workouts, errands, and casual days while keeping you comfortable.",
      category: "top",
      suggestedColors: ["black", "navy", "gray"],
      priceRange: budgetRange as "budget" | "mid" | "luxury",
      priority: "low",
      reason: "No athletic or activewear options",
      searchQuery: "athleisure comfortable workout clothes",
      imagePrompt: "Comfortable athleisure wear",
    })
  }

  return recommendations
}
