export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          profile_photo_url: string | null
          body_type: 'petite' | 'standard' | 'tall' | 'plus-size' | null
          height_cm: number | null
          budget_range: 'budget' | 'mid' | 'luxury' | null
          skin_tone: 'fair' | 'light' | 'medium' | 'deep' | null
          aesthetic_preference: 'minimalist' | 'trendy' | 'classic' | 'edgy' | null
          style_vibes: string[] | null
          typical_occasions: string[] | null
          age_range: string | null
          gender: string | null
          favorite_colors: string[] | null
          fashion_goals: string[] | null
          onboarding_completed: boolean
          onboarding_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          profile_photo_url?: string | null
          body_type?: 'petite' | 'standard' | 'tall' | 'plus-size' | null
          height_cm?: number | null
          budget_range?: 'budget' | 'mid' | 'luxury' | null
          skin_tone?: 'fair' | 'light' | 'medium' | 'deep' | null
          aesthetic_preference?: 'minimalist' | 'trendy' | 'classic' | 'edgy' | null
          style_vibes?: string[] | null
          typical_occasions?: string[] | null
          age_range?: string | null
          gender?: string | null
          favorite_colors?: string[] | null
          fashion_goals?: string[] | null
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          profile_photo_url?: string | null
          body_type?: 'petite' | 'standard' | 'tall' | 'plus-size' | null
          height_cm?: number | null
          budget_range?: 'budget' | 'mid' | 'luxury' | null
          skin_tone?: 'fair' | 'light' | 'medium' | 'deep' | null
          aesthetic_preference?: 'minimalist' | 'trendy' | 'classic' | 'edgy' | null
          style_vibes?: string[] | null
          typical_occasions?: string[] | null
          age_range?: string | null
          gender?: string | null
          favorite_colors?: string[] | null
          fashion_goals?: string[] | null
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: 'free' | 'pro'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier?: 'free' | 'pro'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'trialing' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: 'free' | 'pro'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'trialing' | null
          created_at?: string
          updated_at?: string
        }
      }
      wardrobe_items: {
        Row: {
          id: string
          user_id: string
          item_name: string
          photo_url: string
          category: 'top' | 'bottom' | 'dress' | 'jacket' | 'shoes' | 'accessories' | 'outerwear'
          primary_color: string | null
          secondary_colors: string[] | null
          fabric_type: string | null
          brand: string | null
          size: string | null
          cost: number | null
          purchase_date: string | null
          seasons: string[] | null
          occasions: string[] | null
          condition: 'new' | 'excellent' | 'good' | 'worn' | null
          custom_tags: string[] | null
          last_worn: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_name: string
          photo_url: string
          category: 'top' | 'bottom' | 'dress' | 'jacket' | 'shoes' | 'accessories' | 'outerwear'
          primary_color?: string | null
          secondary_colors?: string[] | null
          fabric_type?: string | null
          brand?: string | null
          size?: string | null
          cost?: number | null
          purchase_date?: string | null
          seasons?: string[] | null
          occasions?: string[] | null
          condition?: 'new' | 'excellent' | 'good' | 'worn' | null
          custom_tags?: string[] | null
          last_worn?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_name?: string
          photo_url?: string
          category?: 'top' | 'bottom' | 'dress' | 'jacket' | 'shoes' | 'accessories' | 'outerwear'
          primary_color?: string | null
          secondary_colors?: string[] | null
          fabric_type?: string | null
          brand?: string | null
          size?: string | null
          cost?: number | null
          purchase_date?: string | null
          seasons?: string[] | null
          occasions?: string[] | null
          condition?: 'new' | 'excellent' | 'good' | 'worn' | null
          custom_tags?: string[] | null
          last_worn?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      outfit_suggestions: {
        Row: {
          id: string
          user_id: string
          wardrobe_item_ids: string[]
          occasion: string | null
          season: string | null
          mood: string | null
          ai_explanation: string | null
          risk_level: number | null
          liked: boolean
          worn: boolean
          worn_date: string | null
          visualization_url: string | null
          visualization_status: 'pending' | 'processing' | 'completed' | 'failed' | null
          visualization_prompt: string | null
          replicate_prediction_id: string | null
          created_at: string
          suggested_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wardrobe_item_ids: string[]
          occasion?: string | null
          season?: string | null
          mood?: string | null
          ai_explanation?: string | null
          risk_level?: number | null
          liked?: boolean
          worn?: boolean
          worn_date?: string | null
          visualization_url?: string | null
          visualization_status?: 'pending' | 'processing' | 'completed' | 'failed' | null
          visualization_prompt?: string | null
          replicate_prediction_id?: string | null
          created_at?: string
          suggested_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wardrobe_item_ids?: string[]
          occasion?: string | null
          season?: string | null
          mood?: string | null
          ai_explanation?: string | null
          risk_level?: number | null
          liked?: boolean
          worn?: boolean
          worn_date?: string | null
          visualization_url?: string | null
          visualization_status?: 'pending' | 'processing' | 'completed' | 'failed' | null
          visualization_prompt?: string | null
          replicate_prediction_id?: string | null
          created_at?: string
          suggested_at?: string
        }
      }
      outfit_feedback: {
        Row: {
          id: string
          user_id: string
          outfit_id: string
          rating: number | null
          feedback_text: string | null
          actually_worn: boolean
          compliments: number
          comfort_level: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          outfit_id: string
          rating?: number | null
          feedback_text?: string | null
          actually_worn?: boolean
          compliments?: number
          comfort_level?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          outfit_id?: string
          rating?: number | null
          feedback_text?: string | null
          actually_worn?: boolean
          compliments?: number
          comfort_level?: number | null
          created_at?: string
        }
      }
      subscription_logs: {
        Row: {
          id: string
          user_id: string
          event_type: 'subscription_created' | 'upgraded' | 'downgraded' | 'canceled' | 'payment_failed'
          from_tier: string | null
          to_tier: string | null
          amount: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: 'subscription_created' | 'upgraded' | 'downgraded' | 'canceled' | 'payment_failed'
          from_tier?: string | null
          to_tier?: string | null
          amount?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: 'subscription_created' | 'upgraded' | 'downgraded' | 'canceled' | 'payment_failed'
          from_tier?: string | null
          to_tier?: string | null
          amount?: number | null
          created_at?: string
        }
      }
      feature_usage: {
        Row: {
          id: string
          user_id: string
          week_start: string
          outfit_suggestions_count: number
          wardrobe_items_count: number
          outfits_saved: number
          visualizations_generated: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          outfit_suggestions_count?: number
          wardrobe_items_count?: number
          outfits_saved?: number
          visualizations_generated?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          outfit_suggestions_count?: number
          wardrobe_items_count?: number
          outfits_saved?: number
          visualizations_generated?: number
          created_at?: string
        }
      }
    }
  }
}

