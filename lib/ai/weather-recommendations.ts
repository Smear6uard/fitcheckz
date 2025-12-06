/**
 * Weather-aware clothing recommendations
 */

export interface WeatherConditions {
  temperature: number // Fahrenheit
  condition: WeatherCondition
  precipitation: number // 0-100 (chance of rain/snow)
  windSpeed?: number // mph
  humidity?: number // 0-100
}

export type WeatherCondition =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'snowy'
  | 'windy'
  | 'foggy'

interface CategoryRecommendation {
  category: string
  priority: 'required' | 'recommended' | 'optional' | 'avoid'
  reason: string
}

/**
 * Temperature-based clothing recommendations
 */
function getTemperatureRecommendations(temp: number): CategoryRecommendation[] {
  const recommendations: CategoryRecommendation[] = []

  if (temp < 32) {
    // Freezing
    recommendations.push(
      { category: 'coat', priority: 'required', reason: 'Freezing temperatures' },
      { category: 'jacket', priority: 'required', reason: 'Freezing temperatures' },
      { category: 'long pants', priority: 'required', reason: 'Stay warm' },
      { category: 'boots', priority: 'recommended', reason: 'Cold weather protection' },
      { category: 'scarf', priority: 'recommended', reason: 'Extra warmth' },
      { category: 'gloves', priority: 'recommended', reason: 'Protect hands' },
      { category: 'shorts', priority: 'avoid', reason: 'Too cold' },
      { category: 't-shirt', priority: 'avoid', reason: 'Insufficient warmth' }
    )
  } else if (temp < 50) {
    // Cold
    recommendations.push(
      { category: 'jacket', priority: 'required', reason: 'Cold weather' },
      { category: 'long pants', priority: 'recommended', reason: 'Keep warm' },
      { category: 'cardigan', priority: 'optional', reason: 'Layering option' },
      { category: 'boots', priority: 'optional', reason: 'Warmth and style' },
      { category: 'shorts', priority: 'avoid', reason: 'Too cold' }
    )
  } else if (temp < 65) {
    // Cool
    recommendations.push(
      { category: 'light jacket', priority: 'recommended', reason: 'Cool weather' },
      { category: 'long sleeves', priority: 'recommended', reason: 'Comfortable coverage' },
      { category: 'jeans', priority: 'optional', reason: 'Good for cool weather' },
      { category: 'sweater', priority: 'optional', reason: 'Layering option' }
    )
  } else if (temp < 75) {
    // Mild
    recommendations.push(
      { category: 't-shirt', priority: 'recommended', reason: 'Comfortable temperature' },
      { category: 'jeans', priority: 'recommended', reason: 'Versatile choice' },
      { category: 'sneakers', priority: 'recommended', reason: 'Comfortable footwear' },
      { category: 'heavy coat', priority: 'avoid', reason: 'Too warm' }
    )
  } else if (temp < 85) {
    // Warm
    recommendations.push(
      { category: 't-shirt', priority: 'recommended', reason: 'Stay cool' },
      { category: 'shorts', priority: 'recommended', reason: 'Hot weather comfort' },
      { category: 'sandals', priority: 'optional', reason: 'Breathable footwear' },
      { category: 'light fabrics', priority: 'recommended', reason: 'Breathability' },
      { category: 'jacket', priority: 'avoid', reason: 'Too hot' },
      { category: 'sweater', priority: 'avoid', reason: 'Too warm' }
    )
  } else {
    // Hot
    recommendations.push(
      { category: 'tank top', priority: 'recommended', reason: 'Extreme heat' },
      { category: 'shorts', priority: 'recommended', reason: 'Maximum cooling' },
      { category: 'sandals', priority: 'recommended', reason: 'Breathable footwear' },
      { category: 'light colors', priority: 'recommended', reason: 'Reflect heat' },
      { category: 'long sleeves', priority: 'avoid', reason: 'Too hot' },
      { category: 'jeans', priority: 'avoid', reason: 'Heavy and warm' }
    )
  }

  return recommendations
}

/**
 * Precipitation-based recommendations
 */
function getPrecipitationRecommendations(
  precipitation: number,
  condition: WeatherCondition
): CategoryRecommendation[] {
  const recommendations: CategoryRecommendation[] = []

  if (condition === 'rainy' || precipitation > 60) {
    recommendations.push(
      { category: 'rain jacket', priority: 'required', reason: 'Rain protection' },
      { category: 'waterproof shoes', priority: 'required', reason: 'Keep feet dry' },
      { category: 'boots', priority: 'recommended', reason: 'Water resistance' },
      { category: 'suede', priority: 'avoid', reason: 'Damaged by water' },
      { category: 'canvas shoes', priority: 'avoid', reason: 'Not waterproof' }
    )
  } else if (condition === 'snowy') {
    recommendations.push(
      { category: 'winter coat', priority: 'required', reason: 'Snow protection' },
      { category: 'waterproof boots', priority: 'required', reason: 'Snow and slush' },
      { category: 'gloves', priority: 'recommended', reason: 'Keep hands warm and dry' },
      { category: 'scarf', priority: 'recommended', reason: 'Extra protection' }
    )
  } else if (precipitation > 30) {
    recommendations.push(
      { category: 'light jacket', priority: 'optional', reason: 'Possible rain' },
      { category: 'closed-toe shoes', priority: 'recommended', reason: 'Protection from moisture' }
    )
  }

  return recommendations
}

/**
 * Wind-based recommendations
 */
function getWindRecommendations(windSpeed: number): CategoryRecommendation[] {
  const recommendations: CategoryRecommendation[] = []

  if (windSpeed > 20) {
    recommendations.push(
      { category: 'windbreaker', priority: 'recommended', reason: 'High wind protection' },
      { category: 'fitted clothing', priority: 'recommended', reason: 'Prevent billowing' },
      { category: 'loose dress', priority: 'avoid', reason: 'Difficult in wind' }
    )
  }

  return recommendations
}

/**
 * Gets comprehensive weather-based recommendations
 */
export function getWeatherRecommendations(
  weather: WeatherConditions
): CategoryRecommendation[] {
  const recommendations: CategoryRecommendation[] = []

  // Temperature recommendations
  recommendations.push(...getTemperatureRecommendations(weather.temperature))

  // Precipitation recommendations
  recommendations.push(...getPrecipitationRecommendations(
    weather.precipitation,
    weather.condition
  ))

  // Wind recommendations
  if (weather.windSpeed) {
    recommendations.push(...getWindRecommendations(weather.windSpeed))
  }

  // Remove duplicates (keep highest priority)
  const uniqueRecs = new Map<string, CategoryRecommendation>()
  const priorityOrder = { required: 0, recommended: 1, optional: 2, avoid: 3 }

  for (const rec of recommendations) {
    const existing = uniqueRecs.get(rec.category)
    if (!existing || priorityOrder[rec.priority] < priorityOrder[existing.priority]) {
      uniqueRecs.set(rec.category, rec)
    }
  }

  return Array.from(uniqueRecs.values())
}

/**
 * Scores outfit based on weather appropriateness (0-100)
 */
export function scoreWeatherAppropriateness(
  itemCategories: string[],
  weather: WeatherConditions
): { score: number; feedback: string[] } {
  const recommendations = getWeatherRecommendations(weather)
  let score = 100
  const feedback: string[] = []

  const normalizedCategories = itemCategories.map(c => c.toLowerCase())

  // Check required items
  const requiredRecs = recommendations.filter(r => r.priority === 'required')
  for (const rec of requiredRecs) {
    const hasItem = normalizedCategories.some(cat =>
      cat.includes(rec.category) || rec.category.includes(cat)
    )

    if (!hasItem) {
      score -= 25
      feedback.push(`Missing ${rec.category}: ${rec.reason}`)
    }
  }

  // Check avoided items
  const avoidRecs = recommendations.filter(r => r.priority === 'avoid')
  for (const rec of avoidRecs) {
    const hasItem = normalizedCategories.some(cat =>
      cat.includes(rec.category) || rec.category.includes(cat)
    )

    if (hasItem) {
      score -= 15
      feedback.push(`Avoid ${rec.category}: ${rec.reason}`)
    }
  }

  // Bonus for recommended items
  const recommendedRecs = recommendations.filter(r => r.priority === 'recommended')
  let recommendedCount = 0
  for (const rec of recommendedRecs) {
    const hasItem = normalizedCategories.some(cat =>
      cat.includes(rec.category) || rec.category.includes(cat)
    )

    if (hasItem) {
      recommendedCount++
    }
  }

  if (recommendedCount >= 2) {
    score = Math.min(100, score + 10)
    feedback.push('Well-suited for the weather')
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    feedback,
  }
}

/**
 * Mock weather fetch (replace with actual API in production)
 */
export async function fetchWeather(location?: string): Promise<WeatherConditions> {
  // TODO: Integrate with actual weather API (OpenWeatherMap, Weather.gov, etc.)

  // Mock data for now
  return {
    temperature: 72,
    condition: 'sunny',
    precipitation: 10,
    windSpeed: 5,
    humidity: 45,
  }
}
