import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getErrorMessage } from '@/lib/utils/error-handling'
import { waitlistEmailSchema } from '@/lib/validations/schemas'
import { logError } from '@/lib/logging'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body with Zod
    const validation = waitlistEmailSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json(
        { error: firstError.message || 'Valid email address required' },
        { status: 400 }
      )
    }

    const { email } = validation.data
    const supabase = await createClient()

    // Check if email already exists
    const { data: existing } = await supabase
      .from('email_signups')
      .select('email')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Email already exists', message: 'You\'re already on the list!' },
        { status: 409 }
      )
    }

    // Insert new email (already validated and transformed by Zod)
    const { data, error } = await supabase
      .from('email_signups')
      .insert({
        email,
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
  } catch (error: unknown) {
    logError(error, { action: 'waitlist-signup' })
    return NextResponse.json(
      { error: getErrorMessage(error) || 'Failed to add email to waitlist' },
      { status: 500 }
    )
  }
}

