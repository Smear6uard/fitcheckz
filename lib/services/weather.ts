/**
 * Weather service for fetching current weather data
 * Uses OpenWeatherMap API (free tier)
 */

export interface WeatherData {
  temperature: number // Fahrenheit
  temperatureCelsius: number
  condition: WeatherCondition
  description: string
  humidity: number
  windSpeed: number
  icon: string
  location: string
  timestamp: number
}

export type WeatherCondition =
  | "clear"
  | "cloudy"
  | "rain"
  | "snow"
  | "thunderstorm"
  | "drizzle"
  | "mist"
  | "fog"

export interface GeoLocation {
  latitude: number
  longitude: number
}

// Map OpenWeatherMap condition codes to our simplified conditions
function mapCondition(weatherId: number): WeatherCondition {
  if (weatherId >= 200 && weatherId < 300) return "thunderstorm"
  if (weatherId >= 300 && weatherId < 400) return "drizzle"
  if (weatherId >= 500 && weatherId < 600) return "rain"
  if (weatherId >= 600 && weatherId < 700) return "snow"
  if (weatherId >= 700 && weatherId < 800) {
    if (weatherId === 701 || weatherId === 721 || weatherId === 741) return "mist"
    return "fog"
  }
  if (weatherId === 800) return "clear"
  return "cloudy" // 801-804 are various cloud coverages
}

// Get weather emoji for display
export function getWeatherEmoji(condition: WeatherCondition): string {
  const emojis: Record<WeatherCondition, string> = {
    clear: "☀️",
    cloudy: "☁️",
    rain: "🌧️",
    snow: "❄️",
    thunderstorm: "⛈️",
    drizzle: "🌦️",
    mist: "🌫️",
    fog: "🌫️",
  }
  return emojis[condition]
}

// Get suggested season based on temperature
export function getSuggestedSeason(tempF: number): string {
  if (tempF >= 80) return "summer"
  if (tempF >= 60) return "spring"
  if (tempF >= 40) return "fall"
  return "winter"
}

// Get outfit recommendation based on weather
export function getWeatherRecommendation(weather: WeatherData): string {
  const { temperature, condition } = weather

  if (condition === "rain" || condition === "drizzle") {
    return "Don't forget a waterproof jacket or umbrella!"
  }
  if (condition === "snow") {
    return "Bundle up with warm layers and waterproof boots."
  }
  if (condition === "thunderstorm") {
    return "Maybe stay cozy indoors today?"
  }

  if (temperature >= 85) {
    return "Keep it light and breathable – it's hot out there!"
  }
  if (temperature >= 70) {
    return "Perfect weather for light layers."
  }
  if (temperature >= 55) {
    return "A light jacket or sweater would be perfect."
  }
  if (temperature >= 40) {
    return "Time for a warm jacket and layers."
  }

  return "Bundle up – it's cold out there!"
}

/**
 * Fetch weather data from OpenWeatherMap API
 */
export async function fetchWeatherData(
  location: GeoLocation,
  apiKey: string
): Promise<WeatherData> {
  const { latitude, longitude } = location

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`,
    { next: { revalidate: 1800 } } // Cache for 30 minutes
  )

  if (!response.ok) {
    throw new Error("Failed to fetch weather data")
  }

  const data = await response.json()

  const tempF = Math.round(data.main.temp)
  const tempC = Math.round((tempF - 32) * (5 / 9))

  return {
    temperature: tempF,
    temperatureCelsius: tempC,
    condition: mapCondition(data.weather[0].id),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    icon: data.weather[0].icon,
    location: data.name,
    timestamp: Date.now(),
  }
}

/**
 * Fetch weather by city name
 */
export async function fetchWeatherByCity(
  city: string,
  apiKey: string
): Promise<WeatherData> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${apiKey}`,
    { next: { revalidate: 1800 } }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch weather data")
  }

  const data = await response.json()

  const tempF = Math.round(data.main.temp)
  const tempC = Math.round((tempF - 32) * (5 / 9))

  return {
    temperature: tempF,
    temperatureCelsius: tempC,
    condition: mapCondition(data.weather[0].id),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    icon: data.weather[0].icon,
    location: data.name,
    timestamp: Date.now(),
  }
}

// Simple in-memory cache for client-side
let cachedWeather: WeatherData | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

export function getCachedWeather(): WeatherData | null {
  if (cachedWeather && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedWeather
  }
  return null
}

export function setCachedWeather(weather: WeatherData): void {
  cachedWeather = weather
  cacheTimestamp = Date.now()
}
