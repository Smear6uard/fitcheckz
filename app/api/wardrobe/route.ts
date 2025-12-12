import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getErrorMessage } from '@/lib/utils/error-handling'
import { createWardrobeItemSchema } from '@/lib/validations/schemas'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')

    // Build query
    let query = supabase
      .from('wardrobe_items')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Apply category filter if provided
    if (category) {
      query = query.eq('category', category)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    // Return paginated response
    return NextResponse.json({
      items: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
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

    // Check subscription tier and limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .single()

    const tier = subscription?.tier || 'free'

    // Check wardrobe limit for free tier
    if (tier === 'free') {
      const { count: currentCount } = await supabase
        .from('wardrobe_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if ((currentCount || 0) >= 50) {
        return NextResponse.json(
          { error: 'Wardrobe limit reached. Upgrade to Pro for unlimited items.' },
          { status: 403 }
        )
      }
    }

    // Validate request body with Zod
    const validation = createWardrobeItemSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json(
        { error: firstError.message || 'Invalid wardrobe item data' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('wardrobe_items')
      .insert({
        user_id: user.id,
        ...validation.data,
      })
      .select()
      .single()

    if (error) throw error

    // Get total wardrobe count for milestone detection
    const { count } = await supabase
      .from('wardrobe_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    return NextResponse.json({ 
      ...data, 
      totalCount: count || 0 
    }, { status: 201 })
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

