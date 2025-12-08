import { NextResponse } from "next/server"
import { fetchWeatherData, fetchWeatherByCity } from "@/lib/services/weather"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const city = searchParams.get("city")

  const apiKey = process.env.OPENWEATHERMAP_API_KEY

  // If no API key, return mock data for development
  if (!apiKey) {
    return NextResponse.json({
      temperature: 72,
      temperatureCelsius: 22,
      condition: "clear",
      description: "clear sky",
      humidity: 45,
      windSpeed: 8,
      icon: "01d",
      location: "Demo Location",
      timestamp: Date.now(),
      isMock: true,
    })
  }

  try {
    let weatherData

    if (city) {
      weatherData = await fetchWeatherByCity(city, apiKey)
    } else if (lat && lon) {
      weatherData = await fetchWeatherData(
        {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        },
        apiKey
      )
    } else {
      return NextResponse.json(
        { error: "Location required. Provide lat/lon or city." },
        { status: 400 }
      )
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    )
  }
}
