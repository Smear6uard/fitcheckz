import { NextRequest, NextResponse } from 'next/server'
import { openrouter, MODELS } from '@/lib/openrouter/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { image } = await request.json()

    // Validate inputs
    if (!image) {
      return NextResponse.json(
        { error: 'Missing image data' },
        { status: 400 }
      )
    }

    // Analyze image with GPT-4o-mini (vision model)
    const completion = await openrouter.chat.completions.create({
      model: MODELS.VISION,
      messages: [
        {
          role: 'system',
          content: `You are a wardrobe item analyzer specialized in identifying clothing items from photos.
Extract detailed information about the clothing item and return structured JSON data.
Be specific and accurate in your analysis.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this clothing item and return JSON with these exact fields:
- type: (e.g., "shirt", "pants", "dress", "jacket", "shoes")
- color: (primary color, e.g., "blue", "black", "white")
- pattern: (e.g., "solid", "striped", "floral", "checkered")
- style: (e.g., "casual", "formal", "sporty", "business")
- occasion: (e.g., "everyday", "work", "formal events", "athletic")
- season: (e.g., "all-season", "summer", "winter", "spring/fall")
- material: (if visible, e.g., "cotton", "denim", "wool", "synthetic")`
            },
            {
              type: 'image_url',
              image_url: { url: image }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for more consistent analysis
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from OpenRouter')
    }

    const analysis = JSON.parse(responseContent)

    return NextResponse.json({ success: true, analysis })
  } catch (error: any) {
    console.error('Wardrobe analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze wardrobe item' },
      { status: 500 }
    )
  }
}
