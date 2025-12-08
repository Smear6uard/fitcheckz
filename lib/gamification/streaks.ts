/**
 * Streak management utilities
 */

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  streakStartDate: string | null
  totalActiveDays: number
  isActiveToday: boolean
  willExpireToday: boolean
}

/**
 * Parse streak data from database
 */
export function parseStreakData(dbData: {
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  streak_start_date: string | null
  total_active_days: number
} | null): StreakData {
  if (!dbData) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      streakStartDate: null,
      totalActiveDays: 0,
      isActiveToday: false,
      willExpireToday: false,
    }
  }

  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

  const isActiveToday = dbData.last_activity_date === today
  const willExpireToday = dbData.last_activity_date === yesterday

  return {
    currentStreak: dbData.current_streak,
    longestStreak: dbData.longest_streak,
    lastActivityDate: dbData.last_activity_date,
    streakStartDate: dbData.streak_start_date,
    totalActiveDays: dbData.total_active_days,
    isActiveToday,
    willExpireToday,
  }
}

/**
 * Get streak status message
 */
export function getStreakStatusMessage(streak: StreakData): {
  message: string
  subtext: string
  emoji: string
  urgency: "none" | "reminder" | "urgent"
} {
  if (streak.currentStreak === 0) {
    return {
      message: "Start your streak!",
      subtext: "Add an item or generate an outfit to begin",
      emoji: "🌱",
      urgency: "none",
    }
  }

  if (streak.isActiveToday) {
    return {
      message: `${streak.currentStreak} day streak!`,
      subtext: "Keep it up tomorrow!",
      emoji: streak.currentStreak >= 7 ? "🔥" : "✨",
      urgency: "none",
    }
  }

  if (streak.willExpireToday) {
    return {
      message: `${streak.currentStreak} day streak`,
      subtext: "Don't lose it – stay active today!",
      emoji: "⚠️",
      urgency: "urgent",
    }
  }

  // Streak already broken
  return {
    message: "Streak lost",
    subtext: "Start fresh with a new streak!",
    emoji: "💔",
    urgency: "reminder",
  }
}

/**
 * Get streak milestone info
 */
export function getStreakMilestone(currentStreak: number): {
  current: number
  next: number
  progress: number
  rewardEmoji: string
} | null {
  const milestones = [3, 7, 14, 30, 60, 100, 365]

  const nextMilestone = milestones.find((m) => m > currentStreak)
  if (!nextMilestone) {
    return null // Already at max milestone
  }

  const previousMilestone = milestones
    .filter((m) => m <= currentStreak)
    .pop() || 0

  const progress =
    ((currentStreak - previousMilestone) / (nextMilestone - previousMilestone)) *
    100

  const rewardEmojis: Record<number, string> = {
    3: "🌱",
    7: "🔥",
    14: "💪",
    30: "⭐",
    60: "🏆",
    100: "👑",
    365: "🌟",
  }

  return {
    current: currentStreak,
    next: nextMilestone,
    progress,
    rewardEmoji: rewardEmojis[nextMilestone] || "✨",
  }
}

/**
 * Format streak count for display
 */
export function formatStreakCount(count: number): string {
  if (count >= 365) return "🔥 " + count
  if (count >= 100) return "👑 " + count
  if (count >= 30) return "⭐ " + count
  if (count >= 7) return "🔥 " + count
  return String(count)
}

/**
 * Get streak fire intensity level (1-5)
 */
export function getStreakIntensity(currentStreak: number): number {
  if (currentStreak >= 100) return 5
  if (currentStreak >= 30) return 4
  if (currentStreak >= 14) return 3
  if (currentStreak >= 7) return 2
  return 1
}

/**
 * Calculate days until streak milestone
 */
export function getDaysToMilestone(currentStreak: number): number | null {
  const milestones = [3, 7, 14, 30, 60, 100, 365]
  const nextMilestone = milestones.find((m) => m > currentStreak)

  if (!nextMilestone) return null
  return nextMilestone - currentStreak
}
