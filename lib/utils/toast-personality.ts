/**
 * Gen-Z personality wrapper for toast notifications
 * Adds fun, relatable messaging while keeping accessibility in mind
 */

import { toast as sonnerToast, ExternalToast } from "sonner"

const successPrefixes = [
  "Slay! ",
  "Yass! ",
  "Period. ",
  "No cap, ",
  "W moment: ",
  "Love that for you! ",
  "It's giving success! ",
]

const errorPrefixes = [
  "Oof, ",
  "Bestie, ",
  "Not the vibe: ",
  "This ain't it: ",
  "L moment: ",
  "Lowkey bad news: ",
]

const infoPrefixes = [
  "FYI: ",
  "Quick update: ",
  "Heads up! ",
  "Just so you know: ",
]

const loadingMessages = [
  "Cooking something good...",
  "One sec, slay loading...",
  "Working on it bestie...",
  "Almost there...",
  "Magic happening...",
]

function getRandomPrefix(prefixes: string[]): string {
  return prefixes[Math.floor(Math.random() * prefixes.length)]
}

export const toast = {
  /**
   * Success toast with Gen-Z flair
   */
  success: (message: string, options?: ExternalToast) => {
    const prefix = getRandomPrefix(successPrefixes)
    return sonnerToast.success(`${prefix}${message}`, {
      className: "toast-success-custom",
      ...options,
    })
  },

  /**
   * Error toast with empathetic Gen-Z messaging
   */
  error: (message: string, options?: ExternalToast) => {
    const prefix = getRandomPrefix(errorPrefixes)
    return sonnerToast.error(`${prefix}${message}`, {
      className: "toast-error-custom",
      ...options,
    })
  },

  /**
   * Info toast with casual Gen-Z style
   */
  info: (message: string, options?: ExternalToast) => {
    const prefix = getRandomPrefix(infoPrefixes)
    return sonnerToast.info(`${prefix}${message}`, options)
  },

  /**
   * Loading toast with personality
   */
  loading: (message?: string, options?: ExternalToast) => {
    const loadingMsg = message || getRandomPrefix(loadingMessages)
    return sonnerToast.loading(loadingMsg, options)
  },

  /**
   * Promise toast with Gen-Z messaging for each state
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading?: string
      success?: string | ((data: T) => string)
      error?: string | ((error: unknown) => string)
    },
    options?: ExternalToast
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading || getRandomPrefix(loadingMessages),
      success: (data) => {
        const msg = typeof messages.success === "function"
          ? messages.success(data)
          : messages.success || "Done!"
        return `${getRandomPrefix(successPrefixes)}${msg}`
      },
      error: (error) => {
        const msg = typeof messages.error === "function"
          ? messages.error(error)
          : messages.error || "Something went wrong"
        return `${getRandomPrefix(errorPrefixes)}${msg}`
      },
      ...options,
    })
  },

  /**
   * Standard sonner toast for formal contexts (no personality added)
   * Use this for important system messages, errors with specific codes, etc.
   */
  standard: sonnerToast,

  /**
   * Dismiss a toast by ID
   */
  dismiss: sonnerToast.dismiss,

  /**
   * Custom toast with full control
   */
  custom: sonnerToast.custom,
}

/**
 * Outfit-specific success messages
 */
export const outfitToast = {
  generated: () => toast.success("Your new fit is ready!"),
  saved: () => toast.success("Outfit saved to favorites"),
  removed: () => toast.info("Outfit removed from favorites"),
  worn: () => toast.success("Marked as worn - you're killing it!"),
  feedback: () => toast.success("Thanks for the feedback!"),
}

/**
 * Wardrobe-specific messages
 */
export const wardrobeToast = {
  itemAdded: (itemName?: string) =>
    toast.success(itemName ? `${itemName} added to your closet` : "Item added to your closet"),
  itemRemoved: () => toast.info("Item removed from wardrobe"),
  itemUpdated: () => toast.success("Item updated"),
  uploadError: () => toast.error("Upload failed, try again?"),
}

/**
 * Auth-specific messages
 */
export const authToast = {
  loginSuccess: () => toast.success("Welcome back!"),
  signupSuccess: () => toast.success("Account created! Let's build your wardrobe"),
  logoutSuccess: () => toast.info("See you next time!"),
  passwordReset: () => toast.success("Check your email for reset link"),
}
