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

    const { data: items, error } = await supabase
      .from('wardrobe_items')
      .select('category, primary_color, cost')
      .eq('user_id', user.id)

    if (error) throw error

    const stats = {
      totalItems: items.length,
      totalCost: items.reduce((sum, item) => sum + (item.cost || 0), 0),
      categoryBreakdown: items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      colorBreakdown: items.reduce((acc, item) => {
        if (item.primary_color) {
          acc[item.primary_color] = (acc[item.primary_color] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>),
    }

    return NextResponse.json(stats)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

