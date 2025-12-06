import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { replicate } from '@/lib/replicate/client'

export async function GET(
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

    // Check if outfit has a prediction ID
    if (!outfit.replicate_prediction_id) {
      return NextResponse.json(
        { error: 'No visualization in progress' },
        { status: 400 }
      )
    }

    // Get prediction status from Replicate
    const prediction = await replicate.predictions.get(
      outfit.replicate_prediction_id
    )

    // Handle different prediction statuses
    if (prediction.status === 'succeeded') {
      const imageUrl = Array.isArray(prediction.output)
        ? prediction.output[0]
        : prediction.output

      if (!imageUrl) {
        throw new Error('No image URL in prediction output')
      }

      // Download image from Replicate
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error('Failed to download image from Replicate')
      }

      const buffer = Buffer.from(await response.arrayBuffer())

      // Upload to Supabase Storage
      const fileName = `visualizations/${user.id}/${outfitId}-${Date.now()}.png`
      const { error: uploadError } = await supabase.storage
        .from('wardrobe')
        .upload(fileName, buffer, {
          contentType: 'image/png',
          upsert: false,
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        // Fallback to Replicate URL if upload fails
        await supabase
          .from('outfit_suggestions')
          .update({
            visualization_url: imageUrl,
            visualization_status: 'completed',
          })
          .eq('id', outfitId)

        return NextResponse.json({
          status: 'completed',
          visualization_url: imageUrl,
        })
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('wardrobe').getPublicUrl(fileName)

      // Update database with final URL
      await supabase
        .from('outfit_suggestions')
        .update({
          visualization_url: publicUrl,
          visualization_status: 'completed',
        })
        .eq('id', outfitId)

      // Update usage tracking for free tier
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

        await supabase.from('feature_usage').upsert({
          user_id: user.id,
          week_start: weekStart.toISOString().split('T')[0],
          visualizations_generated: (usage?.visualizations_generated || 0) + 1,
        })
      }

      return NextResponse.json({
        status: 'completed',
        visualization_url: publicUrl,
      })
    } else if (prediction.status === 'failed') {
      // Update status to failed
      await supabase
        .from('outfit_suggestions')
        .update({
          visualization_status: 'failed',
        })
        .eq('id', outfitId)

      return NextResponse.json({
        status: 'failed',
        error: prediction.error || 'Prediction failed',
      })
    } else if (prediction.status === 'canceled') {
      // Update status to failed
      await supabase
        .from('outfit_suggestions')
        .update({
          visualization_status: 'failed',
        })
        .eq('id', outfitId)

      return NextResponse.json({
        status: 'failed',
        error: 'Prediction was canceled',
      })
    } else {
      // Still processing
      return NextResponse.json({
        status: prediction.status,
        message: 'Visualization is still being generated',
      })
    }
  } catch (error: any) {
    console.error('Visualization status check error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check visualization status' },
      { status: 500 }
    )
  }
}
