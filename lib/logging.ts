/**
 * Centralized logging utility with Sentry integration
 * Use this instead of console.error for production-grade error tracking
 */

import * as Sentry from "@sentry/nextjs"

type LogLevel = "error" | "warn" | "info" | "debug"

interface LogContext {
  userId?: string
  action?: string
  metadata?: Record<string, unknown>
}

/**
 * Log an error with context to Sentry and console
 */
export function logError(
  error: unknown,
  context?: LogContext
): void {
  const errorMessage = error instanceof Error ? error.message : String(error)

  // Set user context if available
  if (context?.userId) {
    Sentry.setUser({ id: context.userId })
  }

  // Add context tags
  if (context?.action) {
    Sentry.setTag("action", context.action)
  }

  // Capture the error with extra context
  if (error instanceof Error) {
    Sentry.captureException(error, {
      extra: {
        ...context?.metadata,
        action: context?.action,
      },
    })
  } else {
    Sentry.captureMessage(errorMessage, {
      level: "error",
      extra: {
        ...context?.metadata,
        action: context?.action,
        originalError: error,
      },
    })
  }

  // Also log to console for development
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${context?.action || "ERROR"}]`, error, context?.metadata)
  }
}

/**
 * Log a warning message
 */
export function logWarn(
  message: string,
  context?: LogContext
): void {
  Sentry.captureMessage(message, {
    level: "warning",
    extra: {
      ...context?.metadata,
      action: context?.action,
    },
  })

  if (process.env.NODE_ENV !== "production") {
    console.warn(`[${context?.action || "WARN"}]`, message, context?.metadata)
  }
}

/**
 * Log an informational message (only in development or when explicitly needed)
 */
export function logInfo(
  message: string,
  context?: LogContext
): void {
  // Only log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.info(`[${context?.action || "INFO"}]`, message, context?.metadata)
  }
}

/**
 * Add breadcrumb for tracing user actions leading up to errors
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>
): void {
  Sentry.addBreadcrumb({
    category,
    message,
    level: "info",
    data,
  })
}

/**
 * Start a performance transaction for tracking slow operations
 */
export function startTransaction(
  name: string,
  op: string
): ReturnType<typeof Sentry.startSpan> {
  return Sentry.startSpan({ name, op }, () => {})
}
