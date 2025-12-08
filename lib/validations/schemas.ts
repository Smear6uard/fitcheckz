/**
 * Centralized Zod validation schemas for API request/response validation
 * Ensures type-safe and validated inputs across all API routes
 */

import { z } from 'zod'

// ============================================================================
// WARDROBE SCHEMAS
// ============================================================================

export const wardrobeItemCategorySchema = z.enum([
  'top',
  'bottom',
  'dress',
  'jacket',
  'shoes',
  'accessories',
  'outerwear',
])

export const wardrobeItemConditionSchema = z.enum([
  'new',
  'excellent',
  'good',
  'worn',
])

export const createWardrobeItemSchema = z.object({
  item_name: z.string().min(1, 'Item name is required').max(100),
  photo_url: z.string().url('Invalid photo URL'),
  category: wardrobeItemCategorySchema,
  primary_color: z.string().max(50).optional().nullable(),
  secondary_colors: z.array(z.string().max(50)).max(5).optional().nullable(),
  fabric_type: z.string().max(50).optional().nullable(),
  brand: z.string().max(100).optional().nullable(),
  size: z.string().max(20).optional().nullable(),
  cost: z.number().min(0).optional().nullable(),
  purchase_date: z.string().optional().nullable(),
  seasons: z.array(z.string().max(20)).max(4).optional().nullable(),
  occasions: z.array(z.string().max(50)).max(10).optional().nullable(),
  condition: wardrobeItemConditionSchema.optional().nullable(),
  custom_tags: z.array(z.string().max(50)).max(20).optional().nullable(),
})

export const updateWardrobeItemSchema = createWardrobeItemSchema.partial()

export const analyzeWardrobeRequestSchema = z.object({
  image: z.string().url('Image must be a valid URL'),
})

export const analyzeWardrobeResponseSchema = z.object({
  success: z.boolean(),
  analysis: z.object({
    type: z.string().min(1, 'Type is required'),
    color: z.string().min(1, 'Color is required'),
    pattern: z.string().min(1, 'Pattern is required'),
    style: z.string().min(1, 'Style is required'),
    occasion: z.string().min(1, 'Occasion is required'),
    season: z.string().min(1, 'Season is required'),
    material: z.string().optional(),
  }),
})

export const uploadWardrobeRequestSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'File cannot be empty',
  }).refine(
    (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
    { message: 'File must be a valid image (JPEG, PNG, WebP)' }
  ),
  removeBg: z.boolean().optional().default(false),
})

// ============================================================================
// OUTFIT SCHEMAS
// ============================================================================

export const weatherDataSchema = z.object({
  temperature: z.number(),
  temperatureCelsius: z.number().optional(),
  condition: z.string(),
  description: z.string().optional(),
  humidity: z.number().optional(),
  windSpeed: z.number().optional(),
  location: z.string().optional(),
})

export const outfitGenerationParamsSchema = z.object({
  occasion: z.string().max(100).optional(),
  season: z.string().max(50).optional(),
  mood: z.string().max(100).optional(),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening']).optional(),
  weather: weatherDataSchema.optional(),
})

export const outfitFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  feedback_text: z.string().max(1000).optional(),
  actually_worn: z.boolean().default(false),
  compliments: z.number().int().min(0).default(0),
  comfort_level: z.number().int().min(1).max(5).optional(),
})

// ============================================================================
// PROFILE SCHEMAS
// ============================================================================

export const bodyTypeSchema = z.enum(['petite', 'standard', 'tall', 'plus-size'])
export const budgetRangeSchema = z.enum(['budget', 'mid', 'luxury'])
export const skinToneSchema = z.enum(['fair', 'light', 'medium', 'deep'])
export const aestheticPreferenceSchema = z.enum(['minimalist', 'trendy', 'classic', 'edgy'])

export const profileUpdateSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).optional(),
  profile_photo_url: z.string().url().optional().nullable(),
  body_type: bodyTypeSchema.optional().nullable(),
  height_cm: z.number().int().min(100).max(250).optional().nullable(),
  budget_range: budgetRangeSchema.optional().nullable(),
  skin_tone: skinToneSchema.optional().nullable(),
  aesthetic_preference: aestheticPreferenceSchema.optional().nullable(),
  style_vibes: z.array(z.string().max(50)).max(10).optional().nullable(),
  typical_occasions: z.array(z.string().max(50)).max(10).optional().nullable(),
  age_range: z.string().max(20).optional().nullable(),
  gender: z.string().max(50).optional().nullable(),
  favorite_colors: z.array(z.string().max(30)).max(10).optional().nullable(),
  fashion_goals: z.array(z.string().max(100)).max(10).optional().nullable(),
})

// ============================================================================
// WAITLIST SCHEMAS
// ============================================================================

export const waitlistEmailSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
})

// ============================================================================
// STRIPE SCHEMAS
// ============================================================================

export const createCheckoutSessionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
})

// ============================================================================
// GENERIC API RESPONSE SCHEMAS
// ============================================================================

export const apiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.unknown().optional(),
})

export const apiErrorSchema = z.object({
  error: z.string().min(1),
  message: z.string().optional(),
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validates request body against a schema and returns parsed data or error response
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(data)
    return { success: true, data: parsed }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return {
        success: false,
        error: firstError.message || 'Validation failed',
      }
    }
    return { success: false, error: 'Invalid request data' }
  }
}

/**
 * Validates request body and returns NextResponse error if validation fails
 */
export function validateRequestOrFail<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data) // Throws ZodError if validation fails
}
