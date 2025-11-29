import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai/client'
import { SYSTEM_PROMPT, createUserPrompt } from '@/lib/openai/prompts'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const body = await request.json()
    const { occasion, season, mood, timeOfDay } = body

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

    // Generate outfits with OpenAI
    const userPrompt = createUserPrompt(profile, wardrobeItems, {
      occasion,
      season,
      mood,
      timeOfDay,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 2000,
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    let outfits
    try {
      const parsed = JSON.parse(responseContent)
      outfits = parsed.outfits || parsed
      if (!Array.isArray(outfits)) {
        outfits = [outfits]
      }
    } catch (error) {
      // Fallback: try to extract JSON from markdown code blocks
      const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || 
                       responseContent.match(/```\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1])
        outfits = parsed.outfits || parsed
        if (!Array.isArray(outfits)) {
          outfits = [outfits]
        }
      } else {
        // Last resort: try to parse as array directly
        try {
          outfits = JSON.parse(responseContent)
          if (!Array.isArray(outfits)) {
            outfits = [outfits]
          }
        } catch {
          throw new Error('Failed to parse OpenAI response')
        }
      }
    }

    // Save outfit suggestions to database
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

      if (itemIds.length === 0) continue

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
        })
        .select()
        .single()

      if (!saveError && savedOutfit) {
        savedOutfits.push({
          ...savedOutfit,
          items: itemIds.map((id: string) =>
            wardrobeItems.find((wi) => wi.id === id)
          ),
        })
      }
    }

    // Update usage tracking
    if (tier === 'free') {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)

      await supabase.from('feature_usage').upsert({
        user_id: user.id,
        week_start: weekStart.toISOString().split('T')[0],
        outfit_suggestions_count: (usage?.outfit_suggestions_count || 0) + 1,
      })
    }

    return NextResponse.json({ outfits: savedOutfits })
  } catch (error: any) {
    console.error('Outfit generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate outfits' },
      { status: 500 }
    )
  }
}

