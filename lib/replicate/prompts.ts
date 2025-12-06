import type { WardrobeItem } from '@/types/wardrobe'

export const VISUALIZATION_SYSTEM_PROMPT = `You are an expert fashion photographer. Create detailed, photorealistic text-to-image prompts for Flux Schnell that describe complete outfit visualizations.`

export function createVisualizationPrompt(
  items: WardrobeItem[],
  occasion?: string,
  season?: string,
  mood?: string
): string {
  const itemDescriptions = items.map(item =>
    `${item.item_name}${item.primary_color ? ` in ${item.primary_color}` : ''}`
  ).join(', ')

  return `Create a fashion photography prompt for: ${itemDescriptions}${occasion ? ` for ${occasion}` : ''}. Include styling, lighting, and composition details for a professional outfit photo.`
}
