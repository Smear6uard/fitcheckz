import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

