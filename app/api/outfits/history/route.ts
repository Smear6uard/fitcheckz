import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/error-handling'

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
    const limit = parseInt(searchParams.get('limit') || '10')

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('outfit_suggestions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    // Fetch wardrobe items for each outfit
    const outfitsWithItems = await Promise.all(
      (data || []).map(async (outfit) => {
        const { data: items } = await supabase
          .from('wardrobe_items')
          .select('*')
          .in('id', outfit.wardrobe_item_ids)
          .eq('user_id', user.id)

        return {
          ...outfit,
          items: items || [],
        }
      })
    )

    // Return paginated response
    return NextResponse.json({
      outfits: outfitsWithItems,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

