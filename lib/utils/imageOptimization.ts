import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  quality?: number
}

/**
 * Compresses an image file using browser-image-compression library
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const defaultOptions: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: 0.85,
    ...options,
  }

  try {
    const compressedFile = await imageCompression(file, defaultOptions)
    return compressedFile
  } catch (error) {
    console.error('Image compression failed:', error)
    throw new Error('Failed to compress image')
  }
}

/**
 * Generates multiple sizes of an image for progressive loading
 * @param file - The original image file
 * @returns Object with thumbnail, medium, and full size files
 */
export async function generateImageSizes(file: File): Promise<{
  thumbnail: File
  medium: File
  full: File
}> {
  const [thumbnail, medium, full] = await Promise.all([
    compressImage(file, { maxWidthOrHeight: 200, maxSizeMB: 0.1, quality: 0.7 }),
    compressImage(file, { maxWidthOrHeight: 800, maxSizeMB: 0.5, quality: 0.8 }),
    compressImage(file, { maxWidthOrHeight: 1920, maxSizeMB: 1, quality: 0.85 }),
  ])

  return { thumbnail, medium, full }
}

/**
 * Generates a blur placeholder data URL for an image
 * @param file - The image file
 * @returns Base64 data URL of a tiny blurred version
 */
export async function generateBlurPlaceholder(file: File): Promise<string> {
  const tinyFile = await compressImage(file, {
    maxWidthOrHeight: 20,
    maxSizeMB: 0.01,
    quality: 0.3,
  })

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(tinyFile)
  })
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

