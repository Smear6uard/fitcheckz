import { toast } from "sonner"

export interface ShareData {
  title: string
  text: string
  url: string
  image?: string
}

/**
 * Checks if the Web Share API is available
 */
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

/**
 * Shares content using the native Web Share API
 */
export async function shareNative(data: ShareData): Promise<boolean> {
  if (!canShare()) {
    return false
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    })
    return true
  } catch (error) {
    // User cancelled or share failed
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Share failed:', error)
    }
    return false
  }
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const success = document.execCommand('copy')
      document.body.removeChild(textArea)

      if (success) {
        toast.success('Copied to clipboard!')
        return true
      }
      return false
    }
  } catch (error) {
    console.error('Failed to copy:', error)
    toast.error('Failed to copy to clipboard')
    return false
  }
}

/**
 * Generates a share URL for Twitter
 */
export function getTwitterShareUrl(text: string, url: string): string {
  const params = new URLSearchParams({
    text: text,
    url: url,
  })
  return `https://twitter.com/intent/tweet?${params.toString()}`
}

/**
 * Generates a share URL for Facebook
 */
export function getFacebookShareUrl(url: string): string {
  const params = new URLSearchParams({
    u: url,
  })
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`
}

/**
 * Generates a share URL for Pinterest
 */
export function getPinterestShareUrl(url: string, description: string, image?: string): string {
  const params = new URLSearchParams({
    url: url,
    description: description,
  })
  if (image) {
    params.append('media', image)
  }
  return `https://pinterest.com/pin/create/button/?${params.toString()}`
}

/**
 * Generates a share URL for LinkedIn
 */
export function getLinkedInShareUrl(url: string): string {
  const params = new URLSearchParams({
    url: url,
  })
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`
}

/**
 * Generates a WhatsApp share URL
 */
export function getWhatsAppShareUrl(text: string): string {
  const params = new URLSearchParams({
    text: text,
  })
  return `https://wa.me/?${params.toString()}`
}

/**
 * Opens a share popup window
 */
export function openShareWindow(url: string, title: string = 'Share'): void {
  const width = 600
  const height = 600
  const left = window.screen.width / 2 - width / 2
  const top = window.screen.height / 2 - height / 2

  window.open(
    url,
    title,
    `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0,resizable=1`
  )
}

/**
 * Generates outfit share text
 */
export function generateOutfitShareText(
  occasion?: string,
  score?: number,
  brandName: string = 'Styleum'
): string {
  let text = `Check out my ${occasion || 'outfit'} recommendation`

  if (score) {
    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D'
    text += ` (${grade} grade, ${score}/100)`
  }

  text += ` from ${brandName}! 👕✨`

  return text
}

/**
 * Gets the full share URL for an outfit
 */
export function getOutfitShareUrl(outfitId: string): string {
  if (typeof window === 'undefined') return ''

  const baseUrl = window.location.origin
  return `${baseUrl}/outfits/${outfitId}`
}
