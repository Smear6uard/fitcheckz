import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
      console.error('Upload error:', uploadError)
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
        console.error('Background removal failed:', error)
        // Continue with original image if removal fails
      }
    }

    return NextResponse.json({ url: processedUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

