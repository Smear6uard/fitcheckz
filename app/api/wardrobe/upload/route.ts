import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getErrorMessage } from '@/lib/utils/error-handling'
import { logError } from '@/lib/logging'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const removeBg = formData.get('removeBg') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    // Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('wardrobe')
      .upload(fileName, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      logError(uploadError, { action: 'wardrobe-upload', userId: user.id })
      throw uploadError
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('wardrobe').getPublicUrl(fileName)

    let processedUrl = publicUrl

    // Remove background if requested
    if (removeBg && process.env.REMOVE_BG_API_KEY) {
      try {
        const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': process.env.REMOVE_BG_API_KEY,
          },
          body: formData,
        })

        if (removeBgResponse.ok) {
          const blob = await removeBgResponse.blob()
          const processedFileName = `${user.id}/${Date.now()}_processed.png`

          const { error: processedError } = await supabase.storage
            .from('wardrobe')
            .upload(processedFileName, blob, {
              cacheControl: '3600',
              upsert: false,
            })

          if (!processedError) {
            const {
              data: { publicUrl: processedPublicUrl },
            } = supabase.storage.from('wardrobe').getPublicUrl(processedFileName)
            processedUrl = processedPublicUrl
          }
        }
      } catch (error) {
        logError(error, { action: 'remove-bg', userId: user.id })
        // Continue with original image if removal fails
      }
    }

    return NextResponse.json({ url: processedUrl })
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

