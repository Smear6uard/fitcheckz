/**
 * Device detection utilities for adaptive UI
 */

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  // Check user agent for mobile indicators
  const userAgent = window.navigator.userAgent.toLowerCase()
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']

  return mobileKeywords.some(keyword => userAgent.includes(keyword))
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false

  // Check if app is running in standalone mode (installed PWA)
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  )
}

export function hasCamera(): boolean {
  if (typeof navigator === 'undefined') return false

  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  const width = window.innerWidth

  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = window.navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent)
}

export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = window.navigator.userAgent.toLowerCase()
  return /android/.test(userAgent)
}

/**
 * Check if device supports native camera capture
 * Mobile devices with camera can use capture="environment" attribute
 */
export function supportsNativeCapture(): boolean {
  return isMobileDevice() && hasCamera()
}
