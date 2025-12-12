import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { openrouter, MODELS } from '@/lib/openrouter/client'
import { SYSTEM_PROMPT, createUserPrompt } from '@/lib/openai/prompts'
import { scoreOutfit } from '@/lib/ai/outfit-scorer'
import { getErrorMessage } from '@/lib/utils/error-handling'
import { outfitGenerationParamsSchema } from '@/lib/validations/schemas'

/**
 * Extract JSON object from a string that may contain extra text after the JSON.
 * Finds the first { and its matching } using brace counting.
 */
function extractJsonObject(text: string): string | null {
  const startIndex = text.indexOf('{')
  if (startIndex === -1) return null

  let braceCount = 0
  let inString = false
  let escapeNext = false

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i]

    if (escapeNext) {
      escapeNext = false
      continue
    }

    if (char === '\\' && inString) {
      escapeNext = true
      continue
    }

    if (char === '"' && !escapeNext) {
      inString = !inString
      continue
    }

    if (!inString) {
      if (char === '{') braceCount++
      else if (char === '}') {
        braceCount--
        if (braceCount === 0) {
          return text.slice(startIndex, i + 1)
        }
      }
    }
  }

  return null
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body with Zod
    const validation = outfitGenerationParamsSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json(
        { error: firstError.message || 'Invalid request parameters' },
        { status: 400 }
      )
    }

    const { occasion, season, mood, timeOfDay, weather } = validation.data

    // Check usage limits for free tier
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .single()

    const tier = subscription?.tier || 'free'

    if (tier === 'free') {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)

      const { data: usage } = await supabase
        .from('feature_usage')
        .select('outfit_suggestions_count')
        .eq('user_id', user.id)
        .eq('week_start', weekStart.toISOString().split('T')[0])
        .single()

      if (usage && usage.outfit_suggestions_count >= 5) {
        return NextResponse.json(
          { error: 'Weekly limit reached. Upgrade to Pro for unlimited suggestions.' },
          { status: 403 }
        )
      }
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Get wardrobe items
    const { data: wardrobeItems, error: wardrobeError } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', user.id)

    if (wardrobeError) throw wardrobeError

    if (!wardrobeItems || wardrobeItems.length < 2) {
      return NextResponse.json(
        { error: 'Please add at least 2 items to your wardrobe first' },
        { status: 400 }
      )
    }

    // Generate outfits with Claude via OpenRouter
    const userPrompt = createUserPrompt(profile, wardrobeItems, {
      occasion,
      season,
      mood,
      timeOfDay,
      weather,
    })

    let completion
    try {
      console.log('Calling OpenRouter API with model:', MODELS.CREATIVE)
      completion = await openrouter.chat.completions.create({
        model: MODELS.CREATIVE,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 2000,
      })
      console.log('OpenRouter API response received successfully')
    } catch (error: unknown) {
      // Log detailed error information for debugging
      console.error('OpenRouter API error details:', {
        error,
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        model: MODELS.CREATIVE,
      })

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Check for specific error types
      if (errorMessage.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid OpenRouter API key. Please check your configuration.' },
          { status: 500 }
        )
      }

      if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
        return NextResponse.json(
          { error: 'The AI service is taking too long to respond. Please try again.' },
          { status: 504 }
        )
      }

      return NextResponse.json(
        { error: `Failed to generate outfits: ${errorMessage}` },
        { status: 500 }
      )
    }

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      console.error('OpenRouter returned empty response:', completion)
      return NextResponse.json(
        { error: 'AI model returned an empty response. Please try again.' },
        { status: 500 }
      )
    }

    let outfits
    try {
      // First, try to extract just the JSON object (AI sometimes adds text after JSON)
      const extractedJson = extractJsonObject(responseContent)
      const jsonToParse = extractedJson || responseContent

      const parsed = JSON.parse(jsonToParse)
      outfits = parsed.outfits || parsed
      if (!Array.isArray(outfits)) {
        outfits = [outfits]
      }
    } catch (error) {
      // Fallback: try to extract JSON from markdown code blocks
      const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) ||
                       responseContent.match(/```\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1])
          outfits = parsed.outfits || parsed
          if (!Array.isArray(outfits)) {
            outfits = [outfits]
          }
        } catch (parseError) {
          console.error('Failed to parse JSON from code block:', parseError)
        }
      }

      // If still no outfits, try one more extraction attempt
      if (!outfits) {
        const extracted = extractJsonObject(responseContent)
        if (extracted) {
          try {
            const parsed = JSON.parse(extracted)
            outfits = parsed.outfits || parsed
            if (!Array.isArray(outfits)) {
              outfits = [outfits]
            }
          } catch (parseError) {
            console.error('Failed to parse extracted JSON:', {
              extracted,
              error: parseError,
            })
          }
        }
      }

      // Final fallback - if we still couldn't parse
      if (!outfits) {
        console.error('Failed to parse OpenRouter response:', {
          responseContent: responseContent.substring(0, 500),
          error,
        })
        return NextResponse.json(
          { error: 'Failed to parse AI response. The model may have returned invalid JSON. Please try again.' },
          { status: 500 }
        )
      }
    }

    // Save outfit suggestions to database with scoring
    const savedOutfits = []
    for (const outfit of outfits) {
      // Find item IDs from item names
      const itemIds = outfit.items
        .map((itemName: string) => {
          const item = wardrobeItems.find(
            (wi) => wi.item_name.toLowerCase() === itemName.toLowerCase()
          )
          return item?.id
        })
        .filter(Boolean)

      if (itemIds.length === 0) {
        continue
      }

      // Get full items for scoring
      const outfitItems = itemIds
        .map((id: string) => wardrobeItems.find((wi) => wi.id === id))
        .filter(Boolean)

      // Calculate outfit score
      let scoredOutfit
      try {
        scoredOutfit = scoreOutfit(outfitItems, (occasion as any) || 'casual', (season as any) || 'all-season')
      } catch (error) {
        console.error('Outfit scoring error:', error)
        // Continue without scoring rather than failing completely
        console.warn(`Skipping scoring for outfit with items: ${itemIds.join(', ')}`)
      }

      const { data: savedOutfit, error: saveError } = await supabase
        .from('outfit_suggestions')
        .insert({
          user_id: user.id,
          wardrobe_item_ids: itemIds,
          occasion,
          season,
          mood,
          ai_explanation: outfit.explanation,
          risk_level: outfit.boldness_level,
          scores: scoredOutfit?.scores ?? null,
          overall_score: scoredOutfit?.overallScore ?? null,
        })
        .select()
        .single()

      if (!saveError && savedOutfit) {
        savedOutfits.push({
          ...savedOutfit,
          items: outfitItems,
          scoredOutfit,
        })
      }
    }

    // Update usage tracking
    if (tier === 'free') {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)

      const { data: currentUsage } = await supabase
        .from('feature_usage')
        .select('outfit_suggestions_count')
        .eq('user_id', user.id)
        .eq('week_start', weekStart.toISOString().split('T')[0])
        .single()

      await supabase.from('feature_usage').upsert({
        user_id: user.id,
        week_start: weekStart.toISOString().split('T')[0],
        outfit_suggestions_count: (currentUsage?.outfit_suggestions_count || 0) + 1,
      })
    }

    // Error if no outfits were matched
    if (savedOutfits.length === 0) {
      return NextResponse.json(
        { error: 'Could not match AI suggestions with your wardrobe items. Please try generating again.' },
        { status: 400 }
      )
    }

    if (savedOutfits.length === 0) {
      console.error('No outfits were successfully saved:', {
        generatedOutfits: outfits.length,
        wardrobeItems: wardrobeItems.length,
      })
      return NextResponse.json(
        { error: 'Could not match AI suggestions with your wardrobe items. Please try generating again or add more items to your wardrobe.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ outfits: savedOutfits })
  } catch (error: unknown) {
    console.error('Outfit generation error:', error)
    const errorMessage = getErrorMessage(error) || 'Failed to generate outfits'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

