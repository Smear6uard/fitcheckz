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

    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')

    if (!idsParam) {
      return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 })
    }

    const ids = idsParam.split(',').filter(Boolean)

    if (ids.length === 0) {
      return NextResponse.json({ outfits: [] })
    }

    // Fetch outfits by IDs
    const { data: outfits, error } = await supabase
      .from('outfit_suggestions')
      .select('*')
      .in('id', ids)
      .eq('user_id', user.id)

    if (error) throw error

    // Fetch wardrobe items for each outfit
    const outfitsWithItems = await Promise.all(
      (outfits || []).map(async (outfit) => {
        const { data: items } = await supabase
          .from('wardrobe_items')
          .select('*')
          .in('id', outfit.wardrobe_item_ids || [])
          .eq('user_id', user.id)

        return {
          ...outfit,
          items: items || [],
        }
      })
    )

    // Preserve order from original ids array
    const orderedOutfits = ids
      .map((id) => outfitsWithItems.find((o) => o.id === id))
      .filter(Boolean)

    return NextResponse.json({ outfits: orderedOutfits })
  } catch (error: unknown) {
    console.error('Error fetching outfits:', error)
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
