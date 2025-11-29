import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if email already exists
    const { data: existing } = await supabase
      .from('email_signups')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Email already exists', message: 'You\'re already on the list!' },
        { status: 409 }
      )
    }

    // Insert new email
    const { data, error } = await supabase
      .from('email_signups')
      .insert({
        email: email.toLowerCase().trim(),
        source: 'landing_page',
      })
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Email already exists', message: 'You\'re already on the list!' },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    console.error('Waitlist signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add email to waitlist' },
      { status: 500 }
    )
  }
}

