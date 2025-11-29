import type { Database } from './database'

export type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Row']
export type WardrobeItemInsert = Database['public']['Tables']['wardrobe_items']['Insert']
export type WardrobeItemUpdate = Database['public']['Tables']['wardrobe_items']['Update']

export type WardrobeCategory = 'top' | 'bottom' | 'dress' | 'jacket' | 'shoes' | 'accessories' | 'outerwear'
export type WardrobeCondition = 'new' | 'excellent' | 'good' | 'worn'

