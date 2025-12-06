import { parseColor, calculateColorHarmony, isSeasonAppropriate, type Color } from './color-theory'

export interface ScoredOutfit {
  items: WardrobeItem[]
  scores: OutfitScores
  overallScore: number
  feedback: string[]
  warnings: string[]
}

export interface OutfitScores {
  colorHarmony: number
  occasionFit: number
  styleConsistency: number
  seasonality: number
  formality: number
  overall: number
}

interface WardrobeItem {
  id: string
  item_name: string
  category: string
  color?: string
  brand?: string
  occasions?: string[]
  season?: string
  style_tags?: string[]
}

type Occasion = 'casual' | 'work' | 'date' | 'formal' | 'gym' | 'travel'
type Season = 'spring' | 'summer' | 'fall' | 'autumn' | 'winter' | 'all-season'

/**
 * Category formality levels (0-100)
 */
const CATEGORY_FORMALITY: Record<string, number> = {
  // Very Formal (80-100)
  'suit jacket': 95,
  'blazer': 90,
  'dress shirt': 85,
  'tie': 95,
  'dress pants': 85,
  'dress shoes': 90,
  'dress': 80,

  // Business Casual (60-80)
  'button-up': 70,
  'slacks': 70,
  'loafers': 65,
  'cardigan': 65,

  // Smart Casual (40-60)
  'polo': 55,
  'chinos': 50,
  'blouse': 60,
  'skirt': 55,
  'ankle boots': 55,

  // Casual (20-40)
  't-shirt': 30,
  'jeans': 35,
  'sneakers': 30,
  'sweatshirt': 25,
  'hoodie': 20,

  // Activewear (0-20)
  'athletic shorts': 10,
  'tank top': 15,
  'running shoes': 10,
  'leggings': 15,
}

/**
 * Occasion formality requirements (0-100)
 */
const OCCASION_FORMALITY: Record<Occasion, { min: number; max: number }> = {
  formal: { min: 80, max: 100 },
  work: { min: 60, max: 90 },
  date: { min: 50, max: 85 },
  casual: { min: 20, max: 60 },
  travel: { min: 25, max: 55 },
  gym: { min: 0, max: 20 },
}

/**
 * Gets formality score for a category
 */
function getCategoryFormality(category: string): number {
  const normalized = category.toLowerCase().trim()

  // Exact match
  if (CATEGORY_FORMALITY[normalized]) {
    return CATEGORY_FORMALITY[normalized]
  }

  // Partial match
  for (const [key, value] of Object.entries(CATEGORY_FORMALITY)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value
    }
  }

  // Default to middle
  return 50
}

/**
 * Calculates color harmony score for outfit
 */
function scoreColorHarmony(items: WardrobeItem[], season?: string): number {
  const colors: Color[] = items
    .filter(item => item.color)
    .map(item => parseColor(item.color!))

  if (colors.length === 0) return 50 // Neutral score if no color info

  let score = calculateColorHarmony(colors)

  // Apply season bonus/penalty
  if (season && isSeasonAppropriate(colors, season)) {
    score = Math.min(100, score + 5)
  } else if (season) {
    score = Math.max(0, score - 10)
  }

  return score
}

/**
 * Calculates occasion appropriateness score
 */
function scoreOccasionFit(items: WardrobeItem[], occasion: Occasion): number {
  const occasionReq = OCCASION_FORMALITY[occasion]
  if (!occasionReq) return 50

  // Calculate average formality of outfit
  const formalityScores = items.map(item => getCategoryFormality(item.category))
  const avgFormality = formalityScores.reduce((a, b) => a + b, 0) / formalityScores.length

  // Check if formality is in appropriate range
  if (avgFormality >= occasionReq.min && avgFormality <= occasionReq.max) {
    // Perfect range - score based on how centered it is
    const center = (occasionReq.min + occasionReq.max) / 2
    const deviation = Math.abs(avgFormality - center)
    const maxDeviation = (occasionReq.max - occasionReq.min) / 2
    return 100 - (deviation / maxDeviation) * 20
  }

  // Outside range - penalize based on distance
  if (avgFormality < occasionReq.min) {
    const deficit = occasionReq.min - avgFormality
    return Math.max(0, 50 - deficit)
  } else {
    const excess = avgFormality - occasionReq.max
    return Math.max(0, 50 - excess)
  }
}

/**
 * Calculates style consistency score
 */
function scoreStyleConsistency(items: WardrobeItem[]): number {
  const allTags = items
    .flatMap(item => item.style_tags || [])
    .map(tag => tag.toLowerCase())

  if (allTags.length === 0) return 50 // Neutral if no style tags

  // Count tag frequency
  const tagCounts = new Map<string, number>()
  allTags.forEach(tag => {
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
  })

  // Check for style conflicts
  const conflictingStyles = [
    ['formal', 'casual'],
    ['athletic', 'dressy'],
    ['minimalist', 'maximalist'],
    ['vintage', 'modern'],
  ]

  for (const [style1, style2] of conflictingStyles) {
    if (allTags.includes(style1) && allTags.includes(style2)) {
      return 40 // Penalty for conflicting styles
    }
  }

  // Reward for consistent style
  const maxCount = Math.max(...tagCounts.values())
  const consistency = maxCount / allTags.length

  return 50 + consistency * 50
}

/**
 * Calculates seasonality score
 */
function scoreSeasonality(items: WardrobeItem[], targetSeason?: Season): number {
  if (!targetSeason || targetSeason === 'all-season') return 100

  const seasonalItems = items.filter(item => item.season)

  if (seasonalItems.length === 0) return 50 // Neutral if no season info

  // Count items appropriate for target season
  const appropriateCount = seasonalItems.filter(item => {
    const itemSeason = item.season?.toLowerCase()
    return itemSeason === targetSeason || itemSeason === 'all-season'
  }).length

  const score = (appropriateCount / seasonalItems.length) * 100

  return score
}

/**
 * Calculates formality consistency score
 */
function scoreFormalityConsistency(items: WardrobeItem[]): number {
  const formalityScores = items.map(item => getCategoryFormality(item.category))

  if (formalityScores.length < 2) return 100

  // Calculate standard deviation
  const avg = formalityScores.reduce((a, b) => a + b, 0) / formalityScores.length
  const variance = formalityScores.reduce((sum, score) =>
    sum + Math.pow(score - avg, 2), 0
  ) / formalityScores.length
  const stdDev = Math.sqrt(variance)

  // Lower std dev = more consistent = higher score
  // Penalize if std dev > 20
  if (stdDev > 20) {
    return Math.max(0, 100 - (stdDev - 20) * 2)
  }

  return 100
}

/**
 * Scores a complete outfit across all dimensions
 */
export function scoreOutfit(
  items: WardrobeItem[],
  occasion: Occasion,
  season?: Season
): ScoredOutfit {
  const scores: OutfitScores = {
    colorHarmony: scoreColorHarmony(items, season),
    occasionFit: scoreOccasionFit(items, occasion),
    styleConsistency: scoreStyleConsistency(items),
    seasonality: scoreSeasonality(items, season),
    formality: scoreFormalityConsistency(items),
    overall: 0,
  }

  // Weighted average for overall score
  scores.overall = Math.round(
    scores.colorHarmony * 0.25 +
    scores.occasionFit * 0.30 +
    scores.styleConsistency * 0.20 +
    scores.seasonality * 0.15 +
    scores.formality * 0.10
  )

  const feedback: string[] = []
  const warnings: string[] = []

  // Generate feedback
  if (scores.colorHarmony >= 85) {
    feedback.push('Excellent color harmony')
  } else if (scores.colorHarmony < 60) {
    warnings.push('Color combination could be improved')
  }

  if (scores.occasionFit >= 85) {
    feedback.push(`Perfect for ${occasion}`)
  } else if (scores.occasionFit < 60) {
    warnings.push(`May not be appropriate for ${occasion}`)
  }

  if (scores.styleConsistency >= 85) {
    feedback.push('Very cohesive style')
  } else if (scores.styleConsistency < 60) {
    warnings.push('Mixed styles - consider more consistency')
  }

  if (scores.formality < 70) {
    warnings.push('Formality levels vary significantly')
  }

  return {
    items,
    scores,
    overallScore: scores.overall,
    feedback,
    warnings,
  }
}

/**
 * Compares and ranks multiple outfits
 */
export function rankOutfits(
  outfits: WardrobeItem[][],
  occasion: Occasion,
  season?: Season
): ScoredOutfit[] {
  const scored = outfits.map(items => scoreOutfit(items, occasion, season))

  return scored.sort((a, b) => b.overallScore - a.overallScore)
}

/**
 * Gets a letter grade for a score
 */
export function getScoreGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

/**
 * Gets a color class for score visualization
 */
export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}
