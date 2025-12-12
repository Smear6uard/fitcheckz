import { toast } from "sonner"

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface RetryOptions {
  maxRetries?: number
  retryDelay?: number
  retryableStatuses?: number[]
  onRetry?: (attempt: number) => void
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  // Only retry on transient errors, not client errors (4xx)
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  onRetry: () => {},
}

/**
 * Fetches with automatic retry logic for transient failures
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions }
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      // If response is OK, return it
      if (response.ok) {
        return response
      }

      // Don't retry on client errors (4xx) - these are not transient
      if (response.status >= 400 && response.status < 500) {
        return response
      }

      // Only retry on server errors (5xx) or specific retryable statuses
      if (!opts.retryableStatuses.includes(response.status)) {
        return response
      }

      // Store the error for potential retry
      lastError = new ApiError(
        `Request failed with status ${response.status}`,
        response.status
      )

      // If this is the last attempt, throw
      if (attempt === opts.maxRetries) {
        throw lastError
      }

      // Wait before retrying
      opts.onRetry(attempt + 1)
      await new Promise((resolve) => setTimeout(resolve, opts.retryDelay * (attempt + 1)))
    } catch (error) {
      // Network errors, CORS errors, etc.
      if (error instanceof TypeError) {
        lastError = new ApiError(
          navigator.onLine
            ? "Network request failed. Please check your connection."
            : "You appear to be offline. Please check your internet connection.",
          0,
          "NETWORK_ERROR"
        )
      } else {
        lastError = error as Error
      }

      // If this is the last attempt, throw
      if (attempt === opts.maxRetries) {
        throw lastError
      }

      // Wait before retrying
      opts.onRetry(attempt + 1)
      await new Promise((resolve) => setTimeout(resolve, opts.retryDelay * (attempt + 1)))
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError || new Error("Unknown error")
}

/**
 * Handles API errors with user-friendly messages
 */
export function handleApiError(error: unknown, context?: string): void {
  console.error(`API Error${context ? ` (${context})` : ""}:`, error)

  if (error instanceof ApiError) {
    if (error.code === "NETWORK_ERROR") {
      toast.error("Connection issue", {
        description: error.message,
      })
      return
    }

    switch (error.status) {
      case 401:
        toast.error("Authentication required", {
          description: "Please sign in to continue",
        })
        break
      case 403:
        toast.error("Access denied", {
          description: error.message || "You don't have permission to perform this action",
        })
        break
      case 404:
        toast.error("Not found", {
          description: error.message || "The requested resource was not found",
        })
        break
      case 429:
        toast.error("Too many requests", {
          description: "Please slow down and try again in a moment",
        })
        break
      case 500:
      case 502:
      case 503:
      case 504:
        toast.error("Server error", {
          description: "Something went wrong on our end. Please try again.",
        })
        break
      default:
        toast.error("Request failed", {
          description: error.message || "An unexpected error occurred",
        })
    }
  } else if (error instanceof Error) {
    toast.error("Error", {
      description: error.message,
    })
  } else {
    toast.error("Unknown error", {
      description: "An unexpected error occurred. Please try again.",
    })
  }
}

/**
 * Parses error response from API
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  let message = `Request failed with status ${response.status}`
  let code: string | undefined

  try {
    const data = await response.json()
    message = data.error || data.message || message
    code = data.code
  } catch {
    // If response is not JSON, use status text
    message = response.statusText || message
  }

  return new ApiError(message, response.status, code)
}
