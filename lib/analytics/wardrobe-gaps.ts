/**
 * Wardrobe gaps analysis logic
 * Identifies missing or underrepresented categories, colors, and seasons
 */

export interface WardrobeGap {
  type: "category" | "color" | "season" | "versatility"
  severity: "critical" | "moderate" | "suggestion"
  title: string
  description: string
  emoji: string
  recommendation: string
}

interface WardrobeStats {
  totalItems: number
  categoryBreakdown: Record<string, number>
  colorBreakdown: Record<string, number>
  seasonBreakdown?: Record<string, number>
}

// Essential categories and their minimum recommended counts
const ESSENTIAL_CATEGORIES = {
  top: { min: 5, label: "Tops", emoji: "👕" },
  bottom: { min: 3, label: "Bottoms", emoji: "👖" },
  shoes: { min: 2, label: "Shoes", emoji: "👟" },
  outerwear: { min: 1, label: "Outerwear", emoji: "🧥" },
  accessories: { min: 2, label: "Accessories", emoji: "👜" },
}

// Neutral colors that are versatile
const NEUTRAL_COLORS = ["black", "white", "gray", "grey", "navy", "beige", "cream", "tan", "khaki", "charcoal"]

// Color temperature groupings
const WARM_COLORS = ["red", "orange", "yellow", "coral", "peach", "rust", "burgundy", "terracotta", "mustard"]
const COOL_COLORS = ["blue", "green", "purple", "teal", "mint", "lavender", "sage"]

export function analyzeWardrobeGaps(stats: WardrobeStats): WardrobeGap[] {
  const gaps: WardrobeGap[] = []

  // 1. Check for missing essential categories
  for (const [category, config] of Object.entries(ESSENTIAL_CATEGORIES)) {
    const count = stats.categoryBreakdown[category] || 0

    if (count === 0) {
      gaps.push({
        type: "category",
        severity: "critical",
        title: `No ${config.label}`,
        description: `Your wardrobe has no ${config.label.toLowerCase()}. This is an essential category!`,
        emoji: config.emoji,
        recommendation: `Add at least ${config.min} versatile ${config.label.toLowerCase()} to complete your wardrobe.`,
      })
    } else if (count < config.min) {
      gaps.push({
        type: "category",
        severity: "moderate",
        title: `Few ${config.label}`,
        description: `You only have ${count} ${config.label.toLowerCase()}. Consider adding more variety.`,
        emoji: config.emoji,
        recommendation: `Aim for at least ${config.min} ${config.label.toLowerCase()} for outfit variety.`,
      })
    }
  }

  // 2. Check color balance
  const colors = Object.keys(stats.colorBreakdown).map(c => c.toLowerCase())
  const neutralCount = colors.filter(c =>
    NEUTRAL_COLORS.some(nc => c.includes(nc) || nc.includes(c))
  ).length

  const hasWarm = colors.some(c =>
    WARM_COLORS.some(wc => c.includes(wc) || wc.includes(c))
  )
  const hasCool = colors.some(c =>
    COOL_COLORS.some(cc => c.includes(cc) || cc.includes(c))
  )

  if (neutralCount === 0 && stats.totalItems >= 5) {
    gaps.push({
      type: "color",
      severity: "moderate",
      title: "Missing Neutrals",
      description: "Your wardrobe lacks neutral colors that pair with everything.",
      emoji: "⬛",
      recommendation: "Add black, white, navy, or beige pieces for versatile outfit building.",
    })
  }

  if (hasWarm && !hasCool && colors.length >= 5) {
    gaps.push({
      type: "color",
      severity: "suggestion",
      title: "All Warm Tones",
      description: "Your palette is all warm colors. Cool tones could add variety!",
      emoji: "🎨",
      recommendation: "Try adding blue, green, or purple pieces for balance.",
    })
  } else if (hasCool && !hasWarm && colors.length >= 5) {
    gaps.push({
      type: "color",
      severity: "suggestion",
      title: "All Cool Tones",
      description: "Your palette is all cool colors. Warm tones could add variety!",
      emoji: "🎨",
      recommendation: "Try adding red, orange, or terracotta pieces for warmth.",
    })
  }

  // 3. Check for single-color dominance
  const totalColorItems = Object.values(stats.colorBreakdown).reduce((a, b) => a + b, 0)
  for (const [color, count] of Object.entries(stats.colorBreakdown)) {
    const percentage = (count / totalColorItems) * 100
    if (percentage > 50 && totalColorItems >= 10) {
      gaps.push({
        type: "color",
        severity: "suggestion",
        title: `Heavy on ${color}`,
        description: `${percentage.toFixed(0)}% of your wardrobe is ${color}. Diversify for more options!`,
        emoji: "🔄",
        recommendation: `Branch out with complementary colors to ${color}.`,
      })
      break // Only show one color dominance warning
    }
  }

  // 4. Small wardrobe suggestions
  if (stats.totalItems < 15 && stats.totalItems > 0) {
    gaps.push({
      type: "versatility",
      severity: "suggestion",
      title: "Growing Wardrobe",
      description: `With ${stats.totalItems} items, there's room to build more outfit combinations.`,
      emoji: "🌱",
      recommendation: "Focus on versatile basics that mix and match well.",
    })
  }

  // 5. Category imbalance check
  const categoryValues = Object.values(stats.categoryBreakdown)
  if (categoryValues.length >= 2) {
    const maxCategory = Math.max(...categoryValues)
    const minCategory = Math.min(...categoryValues)
    const imbalanceRatio = maxCategory / (minCategory || 1)

    if (imbalanceRatio > 5 && stats.totalItems >= 10) {
      const heavyCategory = Object.entries(stats.categoryBreakdown)
        .find(([_, count]) => count === maxCategory)?.[0]
      const lightCategory = Object.entries(stats.categoryBreakdown)
        .find(([_, count]) => count === minCategory)?.[0]

      if (heavyCategory && lightCategory) {
        gaps.push({
          type: "category",
          severity: "suggestion",
          title: "Category Imbalance",
          description: `Way more ${heavyCategory}s than ${lightCategory}s in your closet.`,
          emoji: "⚖️",
          recommendation: `Balance out with more ${lightCategory}s for outfit variety.`,
        })
      }
    }
  }

  // Sort by severity
  const severityOrder = { critical: 0, moderate: 1, suggestion: 2 }
  gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  return gaps
}

/**
 * Get positive insights about the wardrobe
 */
export function getWardrobeStrengths(stats: WardrobeStats): string[] {
  const strengths: string[] = []

  // Good variety of colors
  const colorCount = Object.keys(stats.colorBreakdown).length
  if (colorCount >= 8) {
    strengths.push("Great color variety – you have options for any mood!")
  } else if (colorCount >= 5) {
    strengths.push("Solid color palette building up")
  }

  // Good category coverage
  const categoryCount = Object.keys(stats.categoryBreakdown).length
  if (categoryCount >= 5) {
    strengths.push("Well-rounded wardrobe across categories")
  }

  // Has neutral foundation
  const colors = Object.keys(stats.colorBreakdown).map(c => c.toLowerCase())
  const hasNeutrals = colors.some(c =>
    NEUTRAL_COLORS.some(nc => c.includes(nc) || nc.includes(c))
  )
  if (hasNeutrals) {
    strengths.push("Strong neutral base for easy mixing")
  }

  // Balanced tops and bottoms
  const tops = stats.categoryBreakdown["top"] || 0
  const bottoms = stats.categoryBreakdown["bottom"] || 0
  if (tops >= 3 && bottoms >= 2 && tops / (bottoms || 1) <= 3) {
    strengths.push("Good tops-to-bottoms ratio")
  }

  // Has outerwear
  const outerwear = stats.categoryBreakdown["outerwear"] || stats.categoryBreakdown["jacket"] || 0
  if (outerwear >= 1) {
    strengths.push("Got layering pieces covered")
  }

  return strengths
}
