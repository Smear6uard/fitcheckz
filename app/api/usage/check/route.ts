import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'outfit'

    // Check subscription tier
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .single()

    const tier = subscription?.tier || 'free'

    if (tier === 'pro') {
      return NextResponse.json({ allowed: true, remaining: Infinity })
    }

    // Check usage for free tier
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const { data: usage } = await supabase
      .from('feature_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStart.toISOString().split('T')[0])
      .single()

    let limit = 5
    let current = usage?.outfit_suggestions_count || 0

    if (type === 'wardrobe') {
      limit = 50
      current = usage?.wardrobe_items_count || 0
    }

    return NextResponse.json({
      allowed: current < limit,
      remaining: Math.max(0, limit - current),
      limit,
      current,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

