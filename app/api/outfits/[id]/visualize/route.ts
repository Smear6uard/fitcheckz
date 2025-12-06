import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { openrouter, MODELS } from '@/lib/openrouter/client'
import { replicate, FLUX_SCHNELL_MODEL, DEFAULT_FLUX_PARAMS } from '@/lib/replicate/client'
import { VISUALIZATION_SYSTEM_PROMPT, createVisualizationPrompt } from '@/lib/replicate/prompts'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const outfitId = params.id

    // Get outfit and verify ownership
    const { data: outfit, error: outfitError } = await supabase
      .from('outfit_suggestions')
      .select('*')
      .eq('id', outfitId)
      .eq('user_id', user.id)
      .single()

    if (outfitError || !outfit) {
      return NextResponse.json({ error: 'Outfit not found' }, { status: 404 })
    }

    // Check if visualization already exists
    if (outfit.visualization_url) {
      return NextResponse.json({
        message: 'Visualization already exists',
        visualization_url: outfit.visualization_url,
      })
    }

    // Check if visualization is in progress
    if (outfit.visualization_status === 'processing') {
      return NextResponse.json({
        message: 'Visualization is already being generated',
        prediction_id: outfit.replicate_prediction_id,
      })
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
        .select('visualizations_generated')
        .eq('user_id', user.id)
        .eq('week_start', weekStart.toISOString().split('T')[0])
        .single()

      if (usage && usage.visualizations_generated >= 2) {
        return NextResponse.json(
          {
            error: 'Weekly limit reached. Upgrade to Pro for unlimited visualizations.',
            limit_reached: true,
          },
          { status: 403 }
        )
      }
    }

    // Fetch wardrobe items
    const { data: wardrobeItems, error: itemsError } = await supabase
      .from('wardrobe_items')
      .select('*')
      .in('id', outfit.wardrobe_item_ids)

    if (itemsError || !wardrobeItems || wardrobeItems.length === 0) {
      return NextResponse.json(
        { error: 'Wardrobe items not found' },
        { status: 404 }
      )
    }

    // Generate visualization prompt using Claude
    const userPrompt = createVisualizationPrompt(
      wardrobeItems,
      outfit.occasion || undefined,
      outfit.season || undefined,
      outfit.mood || undefined
    )

    const completion = await openrouter.chat.completions.create({
      model: MODELS.CREATIVE,
      messages: [
        { role: 'system', content: VISUALIZATION_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const visualPrompt = completion.choices[0]?.message?.content?.trim()
    if (!visualPrompt) {
      throw new Error('Failed to generate visualization prompt')
    }

    // Start Replicate prediction
    const prediction = await replicate.predictions.create({
      model: FLUX_SCHNELL_MODEL,
      input: {
        prompt: visualPrompt,
        ...DEFAULT_FLUX_PARAMS,
      },
    })

    // Store prediction ID and status in database
    await supabase
      .from('outfit_suggestions')
      .update({
        visualization_status: 'processing',
        visualization_prompt: visualPrompt,
        replicate_prediction_id: prediction.id,
      })
      .eq('id', outfitId)

    return NextResponse.json({
      success: true,
      prediction_id: prediction.id,
      status: 'processing',
    })
  } catch (error: any) {
    console.error('Visualization generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate visualization' },
      { status: 500 }
    )
  }
}
