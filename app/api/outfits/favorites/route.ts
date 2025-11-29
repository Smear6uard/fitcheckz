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
      .from('outfit_suggestions')
      .select('*')
      .eq('user_id', user.id)
      .eq('liked', true)
      .order('created_at', { ascending: false })

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

    return NextResponse.json(outfitsWithItems)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

