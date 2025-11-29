import type { Database } from './database'

export type OutfitSuggestion = Database['public']['Tables']['outfit_suggestions']['Row']
export type OutfitFeedback = Database['public']['Tables']['outfit_feedback']['Row']

export interface OutfitGenerationParams {
  occasion?: string
  season?: string
  mood?: string
  timeOfDay?: 'morning' | 'afternoon' | 'evening'
}

export interface OutfitCombination {
  items: string[]
  explanation: string
  boldness_level: number
  alternatives: string[]
}

