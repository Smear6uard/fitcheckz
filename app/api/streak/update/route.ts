import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getErrorMessage } from '@/lib/utils/error-handling'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Call the database function to update streak
    const { error } = await supabase.rpc('update_user_streak', {
      user_uuid: user.id,
    })

    if (error) throw error

    // Get updated streak data
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, total_days_active, last_active_date')
      .eq('user_id', user.id)
      .single()

    if (fetchError) throw fetchError

    return NextResponse.json({
      currentStreak: profile.current_streak || 0,
      longestStreak: profile.longest_streak || 0,
      totalDaysActive: profile.total_days_active || 0,
      lastActiveDate: profile.last_active_date,
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, total_days_active, last_active_date')
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return NextResponse.json({
      currentStreak: profile.current_streak || 0,
      longestStreak: profile.longest_streak || 0,
      totalDaysActive: profile.total_days_active || 0,
      lastActiveDate: profile.last_active_date,
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

