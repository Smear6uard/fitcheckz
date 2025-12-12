import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/error-handling'

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

    // Fetch wardrobe items
    const { data: items, error: itemsError } = await supabase
      .from('wardrobe_items')
      .select('id, item_name, category, primary_color, cost, photo_url, last_worn')
      .eq('user_id', user.id)

    if (itemsError) throw itemsError

    // Fetch outfit statistics
    const { data: outfits, error: outfitsError } = await supabase
      .from('outfit_suggestions')
      .select('id, worn, risk_level')
      .eq('user_id', user.id)

    if (outfitsError) throw outfitsError

    // Fetch outfit feedback for worn counts
    const { data: feedback, error: feedbackError } = await supabase
      .from('outfit_feedback')
      .select('outfit_id, actually_worn, rating')
      .eq('user_id', user.id)

    if (feedbackError) throw feedbackError

    // Calculate worn counts per item
    const wornOutfitIds = new Set(
      feedback?.filter(f => f.actually_worn).map(f => f.outfit_id) || []
    )

    // Get wardrobe item IDs from worn outfits
    const wornOutfits = outfits?.filter(o => o.worn || wornOutfitIds.has(o.id)) || []

    // Count how many times each item appears in worn outfits
    const itemWornCounts: Record<string, number> = {}
    // Note: This would need outfit_suggestions to include wardrobe_item_ids
    // For now, use last_worn date as a proxy

    // Calculate most worn items based on last_worn dates
    const itemsWithWornCount = items.map(item => ({
      ...item,
      worn_count: item.last_worn ? 1 : 0, // Simplified - would need more data for accurate counts
    }))

    const mostWornItems = itemsWithWornCount
      .filter(item => item.last_worn)
      .sort((a, b) => new Date(b.last_worn!).getTime() - new Date(a.last_worn!).getTime())
      .slice(0, 8)
      .map(item => ({
        id: item.id,
        name: item.item_name,
        category: item.category,
        image_url: item.photo_url,
        worn_count: item.worn_count,
      }))

    // Calculate outfit stats
    const outfitsGenerated = outfits?.length || 0
    const outfitsWorn = wornOutfits.length
    const avgOutfitScore = feedback?.length
      ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length * 20 // Convert 1-5 to 0-100
      : undefined

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
      mostWornItems,
      outfitsGenerated,
      outfitsWorn,
      avgOutfitScore,
    }

    return NextResponse.json(stats)
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

