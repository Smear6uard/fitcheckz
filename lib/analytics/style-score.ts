/**
 * Style Score calculation logic
 * Calculates a comprehensive style score based on wardrobe composition and usage
 */

export interface StyleScoreBreakdown {
  overall: number
  variety: number
  balance: number
  versatility: number
  activity: number
}

export interface StyleScoreResult {
  score: number
  breakdown: StyleScoreBreakdown
  level: StyleLevel
  nextLevel: StyleLevel | null
  pointsToNextLevel: number
  insights: string[]
}

export interface StyleLevel {
  name: string
  minScore: number
  emoji: string
  title: string
  description: string
}

export const STYLE_LEVELS: StyleLevel[] = [
  {
    name: "starter",
    minScore: 0,
    emoji: "🌱",
    title: "Style Seedling",
    description: "Just starting your fashion journey!",
  },
  {
    name: "explorer",
    minScore: 20,
    emoji: "🔍",
    title: "Style Explorer",
    description: "Discovering your unique aesthetic",
  },
  {
    name: "enthusiast",
    minScore: 40,
    emoji: "✨",
    title: "Style Enthusiast",
    description: "Building a solid wardrobe foundation",
  },
  {
    name: "curator",
    minScore: 60,
    emoji: "👑",
    title: "Style Curator",
    description: "You've got great taste!",
  },
  {
    name: "icon",
    minScore: 80,
    emoji: "💎",
    title: "Style Icon",
    description: "Your wardrobe is goals!",
  },
  {
    name: "legend",
    minScore: 95,
    emoji: "🌟",
    title: "Fashion Legend",
    description: "Peak wardrobe excellence achieved!",
  },
]

interface ScoreInput {
  totalItems: number
  categoryBreakdown: Record<string, number>
  colorBreakdown: Record<string, number>
  outfitsGenerated?: number
  outfitsWorn?: number
  avgOutfitScore?: number
}

/**
 * Calculate variety score (0-100)
 * Based on number of unique colors and categories
 */
function calculateVarietyScore(input: ScoreInput): number {
  const categoryCount = Object.keys(input.categoryBreakdown).length
  const colorCount = Object.keys(input.colorBreakdown).length

  // Category variety (max 50 points for 6+ categories)
  const categoryScore = Math.min(categoryCount / 6, 1) * 50

  // Color variety (max 50 points for 10+ colors)
  const colorScore = Math.min(colorCount / 10, 1) * 50

  return Math.round(categoryScore + colorScore)
}

/**
 * Calculate balance score (0-100)
 * Based on category distribution and color balance
 */
function calculateBalanceScore(input: ScoreInput): number {
  const categories = Object.values(input.categoryBreakdown)
  const colors = Object.values(input.colorBreakdown)

  if (categories.length < 2 || colors.length < 2) return 20

  // Calculate category balance using coefficient of variation (lower is better)
  const catMean = categories.reduce((a, b) => a + b, 0) / categories.length
  const catStdDev = Math.sqrt(
    categories.reduce((sum, val) => sum + Math.pow(val - catMean, 2), 0) / categories.length
  )
  const catCV = catStdDev / catMean

  // Convert CV to score (CV of 0 = 100, CV of 2+ = 0)
  const categoryBalanceScore = Math.max(0, Math.min(100, (1 - catCV / 2) * 100)) * 0.6

  // Calculate color balance
  const colorMean = colors.reduce((a, b) => a + b, 0) / colors.length
  const colorStdDev = Math.sqrt(
    colors.reduce((sum, val) => sum + Math.pow(val - colorMean, 2), 0) / colors.length
  )
  const colorCV = colorStdDev / colorMean
  const colorBalanceScore = Math.max(0, Math.min(100, (1 - colorCV / 2) * 100)) * 0.4

  return Math.round(categoryBalanceScore + colorBalanceScore)
}

/**
 * Calculate versatility score (0-100)
 * Based on having key wardrobe essentials
 */
function calculateVersatilityScore(input: ScoreInput): number {
  const essentials = ["top", "bottom", "shoes"]
  const niceToHave = ["outerwear", "jacket", "accessories", "dress"]

  let score = 0

  // Essential categories (60 points max)
  for (const category of essentials) {
    const count = input.categoryBreakdown[category] || 0
    if (count >= 3) score += 20
    else if (count >= 1) score += 10
  }

  // Nice to have categories (40 points max)
  for (const category of niceToHave) {
    const count = input.categoryBreakdown[category] || 0
    if (count >= 2) score += 10
    else if (count >= 1) score += 5
  }

  // Bonus for neutral colors (versatile for mixing)
  const neutrals = ["black", "white", "gray", "grey", "navy", "beige"]
  const hasNeutrals = Object.keys(input.colorBreakdown).some(c =>
    neutrals.some(n => c.toLowerCase().includes(n))
  )
  if (hasNeutrals) score += 10

  return Math.min(100, score)
}

/**
 * Calculate activity score (0-100)
 * Based on outfit generation and wearing
 */
function calculateActivityScore(input: ScoreInput): number {
  // If no activity data, give a moderate base score
  if (!input.outfitsGenerated) return 40

  let score = 0

  // Outfits generated (max 40 points)
  score += Math.min(input.outfitsGenerated / 10, 1) * 40

  // Outfits worn (max 40 points)
  if (input.outfitsWorn) {
    score += Math.min(input.outfitsWorn / 5, 1) * 40
  }

  // Average outfit score bonus (max 20 points)
  if (input.avgOutfitScore) {
    score += (input.avgOutfitScore / 100) * 20
  }

  return Math.round(Math.min(100, score))
}

/**
 * Calculate the overall style score
 */
export function calculateStyleScore(input: ScoreInput): StyleScoreResult {
  // Minimum items for meaningful score
  if (input.totalItems < 3) {
    return {
      score: 0,
      breakdown: {
        overall: 0,
        variety: 0,
        balance: 0,
        versatility: 0,
        activity: 0,
      },
      level: STYLE_LEVELS[0],
      nextLevel: STYLE_LEVELS[1],
      pointsToNextLevel: 20,
      insights: ["Add more items to unlock your Style Score!"],
    }
  }

  const variety = calculateVarietyScore(input)
  const balance = calculateBalanceScore(input)
  const versatility = calculateVersatilityScore(input)
  const activity = calculateActivityScore(input)

  // Weighted average
  const weights = {
    variety: 0.25,
    balance: 0.2,
    versatility: 0.35,
    activity: 0.2,
  }

  const overall = Math.round(
    variety * weights.variety +
    balance * weights.balance +
    versatility * weights.versatility +
    activity * weights.activity
  )

  // Determine level
  let level = STYLE_LEVELS[0]
  let nextLevel: StyleLevel | null = STYLE_LEVELS[1]

  for (let i = STYLE_LEVELS.length - 1; i >= 0; i--) {
    if (overall >= STYLE_LEVELS[i].minScore) {
      level = STYLE_LEVELS[i]
      nextLevel = STYLE_LEVELS[i + 1] || null
      break
    }
  }

  const pointsToNextLevel = nextLevel ? nextLevel.minScore - overall : 0

  // Generate insights
  const insights: string[] = []

  if (variety < 50) {
    insights.push("Add more variety to your colors and categories")
  } else if (variety >= 80) {
    insights.push("Amazing variety in your wardrobe! 🌈")
  }

  if (balance < 50) {
    insights.push("Your wardrobe is a bit imbalanced – diversify!")
  } else if (balance >= 80) {
    insights.push("Great balance across your wardrobe 👌")
  }

  if (versatility < 50) {
    insights.push("Focus on versatile essentials")
  } else if (versatility >= 80) {
    insights.push("Your wardrobe is super versatile! Mix & match away")
  }

  if (activity < 50) {
    insights.push("Generate and wear more outfits to boost your score")
  }

  return {
    score: overall,
    breakdown: {
      overall,
      variety,
      balance,
      versatility,
      activity,
    },
    level,
    nextLevel,
    pointsToNextLevel,
    insights,
  }
}
