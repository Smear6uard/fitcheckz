"use client"

import { useEffect, useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { cn } from "@/lib/utils"
import { MapPin, Thermometer, Droplets, Wind, RefreshCw } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  type WeatherData,
  type WeatherCondition,
  getWeatherEmoji,
  getSuggestedSeason,
  getWeatherRecommendation,
  getCachedWeather,
  setCachedWeather,
} from "@/lib/services/weather"

interface WeatherBadgeProps {
  className?: string
  variant?: "compact" | "full" | "minimal"
  onWeatherUpdate?: (weather: WeatherData) => void
}

export function WeatherBadge({
  className,
  variant = "compact",
  onWeatherUpdate,
}: WeatherBadgeProps) {
  const [weather, setWeather] = useState<WeatherData | null>(getCachedWeather())
  const [loading, setLoading] = useState(!weather)
  const [error, setError] = useState<string | null>(null)
  const [locationDenied, setLocationDenied] = useState(false)

  // Animation
  const fadeSpring = useSpring({
    opacity: loading ? 0.5 : 1,
    config: config.gentle,
  })

  const fetchWeather = async (position: GeolocationPosition) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
      )

      if (!res.ok) throw new Error("Failed to fetch weather")

      const data = await res.json()
      setWeather(data)
      setCachedWeather(data)
      onWeatherUpdate?.(data)
    } catch (err) {
      console.error("Weather fetch error:", err)
      setError("Couldn't get weather")
    } finally {
      setLoading(false)
    }
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported")
      return
    }

    navigator.geolocation.getCurrentPosition(
      fetchWeather,
      (err) => {
        console.error("Geolocation error:", err)
        if (err.code === err.PERMISSION_DENIED) {
          setLocationDenied(true)
        }
        setError("Location access needed")
        setLoading(false)
      },
      { timeout: 10000, maximumAge: 300000 } // 5 min cache
    )
  }

  useEffect(() => {
    if (!weather) {
      requestLocation()
    }
  }, [])

  const handleRefresh = () => {
    requestLocation()
  }

  // Minimal variant - just temp and emoji
  if (variant === "minimal") {
    if (!weather || loading) {
      return (
        <div className={cn("flex items-center gap-1 text-sm", className)}>
          <span className="animate-pulse">🌡️</span>
          <span className="text-muted-foreground">--°</span>
        </div>
      )
    }

    return (
      <div className={cn("flex items-center gap-1 text-sm", className)}>
        <span>{getWeatherEmoji(weather.condition)}</span>
        <span className="font-medium">{weather.temperature}°F</span>
      </div>
    )
  }

  // Compact variant - badge style
  if (variant === "compact") {
    if (locationDenied) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={requestLocation}
                className={cn("gap-1.5 text-muted-foreground", className)}
              >
                <MapPin className="h-4 w-4" />
                <span className="text-xs">Enable location</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Allow location access for weather-based outfit suggestions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    if (loading || !weather) {
      return (
        <div
          className={cn(
            "flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 animate-pulse",
            className
          )}
        >
          <div className="h-4 w-4 rounded-full bg-muted-foreground/20" />
          <div className="h-3 w-12 rounded bg-muted-foreground/20" />
        </div>
      )
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <animated.button
              style={fadeSpring}
              onClick={handleRefresh}
              className={cn(
                "flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-3 py-1.5",
                "border border-blue-500/20 transition-all hover:border-blue-500/40",
                className
              )}
            >
              <span className="text-lg">{getWeatherEmoji(weather.condition)}</span>
              <span className="font-semibold">{weather.temperature}°</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {weather.location}
              </span>
            </animated.button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span className="font-medium">{weather.location}</span>
              </div>
              <p className="text-sm capitalize">{weather.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" /> {weather.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-3 w-3" /> {weather.windSpeed}mph
                </span>
              </div>
              <p className="text-xs text-brand-lime font-medium pt-1 border-t border-border">
                💡 {getWeatherRecommendation(weather)}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Full variant - card style
  return (
    <animated.div
      style={fadeSpring}
      className={cn(
        "rounded-xl border bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-4",
        className
      )}
    >
      {loading ? (
        <div className="flex items-center gap-4 animate-pulse">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
        </div>
      ) : weather ? (
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
            <span className="text-3xl">{getWeatherEmoji(weather.condition)}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{weather.temperature}°F</span>
              <span className="text-sm text-muted-foreground">
                / {weather.temperatureCelsius}°C
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{weather.location}</span>
              <span className="capitalize">• {weather.description}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="h-8 w-8"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      ) : error ? (
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{error}</p>
            <p className="text-sm text-muted-foreground">
              Enable location for weather suggestions
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={requestLocation}>
            Enable
          </Button>
        </div>
      ) : null}

      {weather && (
        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Wind className="h-4 w-4 text-cyan-500" />
            <span>{weather.windSpeed}mph</span>
          </div>
          <div className="flex-1 text-right">
            <span className="text-xs text-muted-foreground">
              Suggested: <span className="font-medium capitalize">{getSuggestedSeason(weather.temperature)}</span>
            </span>
          </div>
        </div>
      )}
    </animated.div>
  )
}

/**
 * Hook to get current weather
 */
export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(getCachedWeather())
  const [loading, setLoading] = useState(!weather)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setWeather(data)
      setCachedWeather(data)
    } catch {
      setError("Failed to get weather")
    } finally {
      setLoading(false)
    }
  }

  const requestWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => setError("Location denied")
      )
    }
  }

  return { weather, loading, error, requestWeather }
}
