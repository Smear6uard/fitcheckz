import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
    const { type } = body

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const { data: existing } = await supabase
      .from('feature_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStart.toISOString().split('T')[0])
      .single()

    const updateData: any = {
      user_id: user.id,
      week_start: weekStart.toISOString().split('T')[0],
    }

    if (type === 'outfit') {
      updateData.outfit_suggestions_count =
        (existing?.outfit_suggestions_count || 0) + 1
    } else if (type === 'wardrobe') {
      updateData.wardrobe_items_count = (existing?.wardrobe_items_count || 0) + 1
    } else if (type === 'save') {
      updateData.outfits_saved = (existing?.outfits_saved || 0) + 1
    }

    await supabase.from('feature_usage').upsert(updateData)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

