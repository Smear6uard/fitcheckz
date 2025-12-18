/**
 * Achievement definitions and logic for the gamification system
 */

export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  icon: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  category: "wardrobe" | "outfits" | "streak" | "social" | "style"
  requirement: {
    type: "count" | "score" | "streak" | "action"
    target: number
    metric: string
  }
  reward?: {
    type: "badge" | "credits" | "unlock"
    value: string | number
  }
}

export const ACHIEVEMENTS: Achievement[] = [
  // Wardrobe Achievements
  {
    id: "closet_starter",
    name: "Closet Starter",
    description: "Add your first wardrobe item",
    emoji: "👕",
    icon: "Shirt",
    rarity: "common",
    category: "wardrobe",
    requirement: {
      type: "count",
      target: 1,
      metric: "wardrobe_items",
    },
  },
  {
    id: "building_collection",
    name: "Building the Collection",
    description: "Add 10 items to your wardrobe",
    emoji: "🛍️",
    icon: "ShoppingBag",
    rarity: "uncommon",
    category: "wardrobe",
    requirement: {
      type: "count",
      target: 10,
      metric: "wardrobe_items",
    },
  },
  {
    id: "wardrobe_curator",
    name: "Wardrobe Curator",
    description: "Build a collection of 25 items",
    emoji: "👗",
    icon: "Palette",
    rarity: "rare",
    category: "wardrobe",
    requirement: {
      type: "count",
      target: 25,
      metric: "wardrobe_items",
    },
  },
  {
    id: "fashion_hoarder",
    name: "Fashion Hoarder",
    description: "Amass 50 wardrobe items",
    emoji: "🏠",
    icon: "Home",
    rarity: "epic",
    category: "wardrobe",
    requirement: {
      type: "count",
      target: 50,
      metric: "wardrobe_items",
    },
  },
  {
    id: "closet_king",
    name: "Closet Royalty",
    description: "Own 100 wardrobe items",
    emoji: "👑",
    icon: "Crown",
    rarity: "legendary",
    category: "wardrobe",
    requirement: {
      type: "count",
      target: 100,
      metric: "wardrobe_items",
    },
  },

  // Outfit Achievements
  {
    id: "first_fit",
    name: "Fit Check!",
    description: "Generate your first outfit",
    emoji: "✨",
    icon: "Sparkles",
    rarity: "common",
    category: "outfits",
    requirement: {
      type: "count",
      target: 1,
      metric: "outfits_generated",
    },
  },
  {
    id: "outfit_explorer",
    name: "Outfit Explorer",
    description: "Generate 10 different outfits",
    emoji: "🔍",
    icon: "Search",
    rarity: "uncommon",
    category: "outfits",
    requirement: {
      type: "count",
      target: 10,
      metric: "outfits_generated",
    },
  },
  {
    id: "style_experimenter",
    name: "Style Experimenter",
    description: "Generate 50 outfits",
    emoji: "🧪",
    icon: "FlaskConical",
    rarity: "rare",
    category: "outfits",
    requirement: {
      type: "count",
      target: 50,
      metric: "outfits_generated",
    },
  },
  {
    id: "outfit_machine",
    name: "Outfit Machine",
    description: "Generate 100 outfits",
    emoji: "🤖",
    icon: "Bot",
    rarity: "epic",
    category: "outfits",
    requirement: {
      type: "count",
      target: 100,
      metric: "outfits_generated",
    },
  },
  {
    id: "first_worn",
    name: "Wore It!",
    description: "Mark your first outfit as worn",
    emoji: "🎯",
    icon: "Target",
    rarity: "common",
    category: "outfits",
    requirement: {
      type: "count",
      target: 1,
      metric: "outfits_worn",
    },
  },
  {
    id: "regular_wearer",
    name: "Regular Wearer",
    description: "Wear 10 suggested outfits",
    emoji: "👔",
    icon: "Shirt",
    rarity: "uncommon",
    category: "outfits",
    requirement: {
      type: "count",
      target: 10,
      metric: "outfits_worn",
    },
  },

  // Streak Achievements
  {
    id: "streak_3",
    name: "Getting Started",
    description: "Maintain a 3-day streak",
    emoji: "🔥",
    icon: "Flame",
    rarity: "common",
    category: "streak",
    requirement: {
      type: "streak",
      target: 3,
      metric: "current_streak",
    },
  },
  {
    id: "streak_7",
    name: "Style Streak",
    description: "Maintain a 7-day streak",
    emoji: "🔥",
    icon: "Flame",
    rarity: "uncommon",
    category: "streak",
    requirement: {
      type: "streak",
      target: 7,
      metric: "current_streak",
    },
  },
  {
    id: "streak_14",
    name: "Fashion Dedicated",
    description: "Maintain a 14-day streak",
    emoji: "💪",
    icon: "Dumbbell",
    rarity: "rare",
    category: "streak",
    requirement: {
      type: "streak",
      target: 14,
      metric: "current_streak",
    },
  },
  {
    id: "streak_30",
    name: "Fashion Devotee",
    description: "Maintain a 30-day streak",
    emoji: "⭐",
    icon: "Star",
    rarity: "epic",
    category: "streak",
    requirement: {
      type: "streak",
      target: 30,
      metric: "current_streak",
    },
  },
  {
    id: "streak_100",
    name: "Fashion Legend",
    description: "Maintain a 100-day streak!",
    emoji: "🏆",
    icon: "Trophy",
    rarity: "legendary",
    category: "streak",
    requirement: {
      type: "streak",
      target: 100,
      metric: "current_streak",
    },
  },

  // Style Score Achievements
  {
    id: "style_score_40",
    name: "Style Seedling",
    description: "Reach a Style Score of 40",
    emoji: "🌱",
    icon: "Sprout",
    rarity: "common",
    category: "style",
    requirement: {
      type: "score",
      target: 40,
      metric: "style_score",
    },
  },
  {
    id: "style_score_60",
    name: "Style Enthusiast",
    description: "Reach a Style Score of 60",
    emoji: "💫",
    icon: "Sparkle",
    rarity: "uncommon",
    category: "style",
    requirement: {
      type: "score",
      target: 60,
      metric: "style_score",
    },
  },
  {
    id: "style_score_80",
    name: "Style Icon",
    description: "Reach a Style Score of 80",
    emoji: "💎",
    icon: "Diamond",
    rarity: "rare",
    category: "style",
    requirement: {
      type: "score",
      target: 80,
      metric: "style_score",
    },
  },
  {
    id: "style_score_95",
    name: "Style Master",
    description: "Reach a Style Score of 95",
    emoji: "🌟",
    icon: "Sparkles",
    rarity: "legendary",
    category: "style",
    requirement: {
      type: "score",
      target: 95,
      metric: "style_score",
    },
  },

  // Social Achievements
  {
    id: "first_share",
    name: "Influencer Mode",
    description: "Share your first outfit",
    emoji: "📤",
    icon: "Share2",
    rarity: "common",
    category: "social",
    requirement: {
      type: "count",
      target: 1,
      metric: "outfits_shared",
    },
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Share 10 outfits",
    emoji: "🦋",
    icon: "Butterfly",
    rarity: "uncommon",
    category: "social",
    requirement: {
      type: "count",
      target: 10,
      metric: "outfits_shared",
    },
  },
]

/**
 * Get rarity color configuration
 */
export function getRarityConfig(rarity: Achievement["rarity"]) {
  switch (rarity) {
    case "common":
      return {
        gradient: "from-gray-400 to-gray-500",
        glow: "shadow-gray-400/30",
        bgColor: "bg-[#1A1A1A] border border-[#2A2A2A]",
        textColor: "text-gray-400",
        label: "Common",
      }
    case "uncommon":
      return {
        gradient: "from-green-400 to-green-500",
        glow: "shadow-green-400/30",
        bgColor: "bg-[#1A1A1A] border border-green-500/30",
        textColor: "text-green-400",
        label: "Uncommon",
      }
    case "rare":
      return {
        gradient: "from-blue-400 to-blue-500",
        glow: "shadow-blue-400/30",
        bgColor: "bg-[#1A1A1A] border border-blue-500/30",
        textColor: "text-blue-400",
        label: "Rare",
      }
    case "epic":
      return {
        gradient: "from-purple-400 to-purple-500",
        glow: "shadow-purple-400/30",
        bgColor: "bg-[#1A1A1A] border border-purple-500/30",
        textColor: "text-purple-400",
        label: "Epic",
      }
    case "legendary":
      return {
        gradient: "from-amber-400 to-orange-500",
        glow: "shadow-amber-400/30",
        bgColor: "bg-[#1A1A1A] border border-amber-500/30",
        textColor: "text-amber-400",
        label: "Legendary",
      }
  }
}

/**
 * Check if a specific achievement is unlocked based on user stats
 */
export function checkAchievementProgress(
  achievement: Achievement,
  stats: Record<string, number>
): { unlocked: boolean; progress: number; target: number } {
  const currentValue = stats[achievement.requirement.metric] || 0
  const target = achievement.requirement.target

  return {
    unlocked: currentValue >= target,
    progress: Math.min(currentValue, target),
    target,
  }
}

/**
 * Get all achievements with their progress for a user
 */
export function getAchievementsWithProgress(stats: Record<string, number>) {
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    ...checkAchievementProgress(achievement, stats),
  }))
}

/**
 * Get newly unlocked achievements by comparing before/after stats
 */
export function getNewlyUnlockedAchievements(
  oldStats: Record<string, number>,
  newStats: Record<string, number>
): Achievement[] {
  const newlyUnlocked: Achievement[] = []

  for (const achievement of ACHIEVEMENTS) {
    const oldProgress = checkAchievementProgress(achievement, oldStats)
    const newProgress = checkAchievementProgress(achievement, newStats)

    if (!oldProgress.unlocked && newProgress.unlocked) {
      newlyUnlocked.push(achievement)
    }
  }

  return newlyUnlocked
}
