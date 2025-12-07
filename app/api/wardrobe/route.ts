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
    return NextResponse.json({ error: error.message }, { status: 500 })
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
    const {
      item_name,
      photo_url,
      category,
      primary_color,
      secondary_colors,
      fabric_type,
      brand,
      size,
      cost,
      purchase_date,
      seasons,
      occasions,
      condition,
      custom_tags,
    } = body

    const { data, error } = await supabase
      .from('wardrobe_items')
      .insert({
        user_id: user.id,
        item_name,
        photo_url,
        category,
        primary_color,
        secondary_colors,
        fabric_type,
        brand,
        size,
        cost,
        purchase_date,
        seasons,
        occasions,
        condition,
        custom_tags,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

