/**
 * Color theory utilities for outfit compatibility analysis
 */

export interface Color {
  name: string
  hex?: string
  family: ColorFamily
  temperature: 'warm' | 'cool' | 'neutral'
  intensity: 'light' | 'medium' | 'dark'
}

export type ColorFamily =
  | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink'
  | 'brown' | 'black' | 'white' | 'gray' | 'beige' | 'cream'

export type ColorScheme =
  | 'monochromatic'    // Same color, different shades
  | 'analogous'         // Adjacent colors on wheel
  | 'complementary'     // Opposite colors on wheel
  | 'triadic'          // Three evenly spaced colors
  | 'neutral'          // Black, white, gray, beige
  | 'accent'           // Neutrals with one pop color

const COLOR_WHEEL_ORDER: ColorFamily[] = [
  'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'
]

const NEUTRAL_COLORS: ColorFamily[] = ['black', 'white', 'gray', 'beige', 'brown', 'cream']

/**
 * Maps common color names to their properties
 */
export const COLOR_DATABASE: Record<string, Partial<Color>> = {
  // Reds
  red: { family: 'red', temperature: 'warm' },
  burgundy: { family: 'red', temperature: 'warm', intensity: 'dark' },
  maroon: { family: 'red', temperature: 'warm', intensity: 'dark' },
  pink: { family: 'pink', temperature: 'warm' },
  rose: { family: 'pink', temperature: 'warm' },

  // Oranges
  orange: { family: 'orange', temperature: 'warm' },
  coral: { family: 'orange', temperature: 'warm', intensity: 'light' },
  rust: { family: 'orange', temperature: 'warm', intensity: 'dark' },

  // Yellows
  yellow: { family: 'yellow', temperature: 'warm' },
  gold: { family: 'yellow', temperature: 'warm', intensity: 'medium' },
  mustard: { family: 'yellow', temperature: 'warm', intensity: 'dark' },

  // Greens
  green: { family: 'green', temperature: 'cool' },
  olive: { family: 'green', temperature: 'warm', intensity: 'dark' },
  emerald: { family: 'green', temperature: 'cool', intensity: 'dark' },
  mint: { family: 'green', temperature: 'cool', intensity: 'light' },
  sage: { family: 'green', temperature: 'cool', intensity: 'medium' },

  // Blues
  blue: { family: 'blue', temperature: 'cool' },
  navy: { family: 'blue', temperature: 'cool', intensity: 'dark' },
  teal: { family: 'blue', temperature: 'cool', intensity: 'medium' },
  sky: { family: 'blue', temperature: 'cool', intensity: 'light' },

  // Purples
  purple: { family: 'purple', temperature: 'cool' },
  lavender: { family: 'purple', temperature: 'cool', intensity: 'light' },
  plum: { family: 'purple', temperature: 'cool', intensity: 'dark' },

  // Neutrals
  black: { family: 'black', temperature: 'neutral', intensity: 'dark' },
  white: { family: 'white', temperature: 'neutral', intensity: 'light' },
  gray: { family: 'gray', temperature: 'neutral', intensity: 'medium' },
  grey: { family: 'gray', temperature: 'neutral', intensity: 'medium' },
  beige: { family: 'beige', temperature: 'neutral', intensity: 'light' },
  tan: { family: 'beige', temperature: 'neutral', intensity: 'medium' },
  brown: { family: 'brown', temperature: 'neutral', intensity: 'dark' },
  cream: { family: 'cream', temperature: 'neutral', intensity: 'light' },
  khaki: { family: 'beige', temperature: 'neutral', intensity: 'medium' },
}

/**
 * Parses a color name/description to Color object
 */
export function parseColor(colorName: string): Color {
  const normalized = colorName.toLowerCase().trim()

  // Check exact match first
  if (COLOR_DATABASE[normalized]) {
    return {
      name: colorName,
      ...COLOR_DATABASE[normalized],
    } as Color
  }

  // Try to find color family in the string
  for (const [key, value] of Object.entries(COLOR_DATABASE)) {
    if (normalized.includes(key)) {
      return {
        name: colorName,
        ...value,
      } as Color
    }
  }

  // Default fallback
  return {
    name: colorName,
    family: 'gray',
    temperature: 'neutral',
    intensity: 'medium',
  }
}

/**
 * Determines if two colors are on the color wheel
 */
function getColorWheelDistance(color1: ColorFamily, color2: ColorFamily): number {
  const index1 = COLOR_WHEEL_ORDER.indexOf(color1)
  const index2 = COLOR_WHEEL_ORDER.indexOf(color2)

  if (index1 === -1 || index2 === -1) return -1

  const distance = Math.abs(index1 - index2)
  return Math.min(distance, COLOR_WHEEL_ORDER.length - distance)
}

/**
 * Determines the color scheme of a set of colors
 */
export function identifyColorScheme(colors: Color[]): ColorScheme {
  if (colors.length < 2) return 'neutral'

  const nonNeutralColors = colors.filter(c => !NEUTRAL_COLORS.includes(c.family))

  // All neutral colors
  if (nonNeutralColors.length === 0) {
    return 'neutral'
  }

  // Neutrals with one accent color
  if (nonNeutralColors.length === 1 && colors.length > 1) {
    return 'accent'
  }

  // All same color family (monochromatic)
  if (nonNeutralColors.every(c => c.family === nonNeutralColors[0].family)) {
    return 'monochromatic'
  }

  // Check for complementary (opposite on wheel)
  if (nonNeutralColors.length === 2) {
    const distance = getColorWheelDistance(
      nonNeutralColors[0].family,
      nonNeutralColors[1].family
    )
    if (distance === 3 || distance === 4) {
      return 'complementary'
    }
  }

  // Check for analogous (adjacent on wheel)
  const distances = []
  for (let i = 0; i < nonNeutralColors.length - 1; i++) {
    const dist = getColorWheelDistance(
      nonNeutralColors[i].family,
      nonNeutralColors[i + 1].family
    )
    if (dist !== -1) distances.push(dist)
  }

  if (distances.every(d => d <= 2)) {
    return 'analogous'
  }

  return 'triadic'
}

/**
 * Calculates color harmony score (0-100)
 */
export function calculateColorHarmony(colors: Color[]): number {
  if (colors.length < 2) return 100

  const scheme = identifyColorScheme(colors)
  const nonNeutralColors = colors.filter(c => !NEUTRAL_COLORS.includes(c.family))

  // Base score by scheme
  const schemeScores: Record<ColorScheme, number> = {
    monochromatic: 95,
    neutral: 100,
    accent: 90,
    analogous: 85,
    complementary: 80,
    triadic: 75,
  }

  let score = schemeScores[scheme]

  // Penalize too many non-neutral colors
  if (nonNeutralColors.length > 3) {
    score -= (nonNeutralColors.length - 3) * 10
  }

  // Bonus for temperature consistency (unless complementary)
  if (scheme !== 'complementary' && nonNeutralColors.length >= 2) {
    const temperatures = nonNeutralColors.map(c => c.temperature).filter(t => t !== 'neutral')
    const allSameTemp = temperatures.every(t => t === temperatures[0])
    if (allSameTemp) {
      score += 5
    }
  }

  // Ensure score is in valid range
  return Math.max(0, Math.min(100, score))
}

/**
 * Suggests complementary colors for a given color
 */
export function suggestComplementaryColors(baseColor: Color): ColorFamily[] {
  if (NEUTRAL_COLORS.includes(baseColor.family)) {
    // Neutrals go with everything, suggest vibrant options
    return ['blue', 'red', 'green']
  }

  const wheelIndex = COLOR_WHEEL_ORDER.indexOf(baseColor.family)
  if (wheelIndex === -1) return []

  // Complementary (opposite)
  const complementaryIndex = (wheelIndex + 3) % COLOR_WHEEL_ORDER.length

  // Analogous (adjacent)
  const analogous1 = (wheelIndex + 1) % COLOR_WHEEL_ORDER.length
  const analogous2 = (wheelIndex - 1 + COLOR_WHEEL_ORDER.length) % COLOR_WHEEL_ORDER.length

  return [
    COLOR_WHEEL_ORDER[complementaryIndex],
    COLOR_WHEEL_ORDER[analogous1],
    COLOR_WHEEL_ORDER[analogous2],
  ]
}

/**
 * Checks if colors are appropriate for the season
 */
export function isSeasonAppropriate(colors: Color[], season: string): boolean {
  const seasonalColors: Record<string, ColorFamily[]> = {
    spring: ['pink', 'yellow', 'green', 'blue', 'white', 'cream'],
    summer: ['white', 'blue', 'yellow', 'pink', 'beige', 'cream'],
    fall: ['orange', 'brown', 'red', 'yellow', 'green', 'burgundy'],
    autumn: ['orange', 'brown', 'red', 'yellow', 'green', 'burgundy'],
    winter: ['black', 'white', 'gray', 'blue', 'red', 'purple'],
  }

  const appropriateColors = seasonalColors[season.toLowerCase()] || []
  if (appropriateColors.length === 0) return true

  // At least 50% of colors should be seasonal
  const seasonalCount = colors.filter(c =>
    appropriateColors.includes(c.family)
  ).length

  return seasonalCount >= colors.length * 0.5
}
