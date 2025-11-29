export const SYSTEM_PROMPT = `You are an expert personal stylist with deep knowledge of color theory, proportions, occasion appropriateness, and fashion trends. You help users create creative, personalized outfit combinations from their existing wardrobe. 

Your approach:
- Embrace diversity and celebrate individuality
- Never suggest boring recommendations
- Consider color harmony, proportions, and occasion fit
- Provide creative but wearable combinations
- Include both safe and bold options
- Explain your styling choices clearly

Always be encouraging and never judgmental. Fashion is about self-expression and confidence.`

export function createUserPrompt(
  profile: any,
  wardrobeItems: any[],
  params: {
    occasion?: string
    season?: string
    mood?: string
    timeOfDay?: string
  }
): string {
  const profileInfo = profile
    ? `
User Profile:
- Body type: ${profile.body_type || 'not specified'}
- Budget: ${profile.budget_range || 'not specified'}
- Style preference: ${profile.aesthetic_preference || 'not specified'}
- Skin tone: ${profile.skin_tone || 'not specified'}
`
    : ''

  const wardrobeInfo = wardrobeItems
    .map(
      (item) =>
        `- ${item.item_name} (${item.category}): ${item.primary_color || 'color not specified'}, ${item.brand || 'brand not specified'}, ${item.fabric_type || 'fabric not specified'}`
    )
    .join('\n')

  return `${profileInfo}

Available Wardrobe Items:
${wardrobeInfo}

Generate 3-5 outfit combinations for:
- Occasion: ${params.occasion || 'casual'}
- Season: ${params.season || 'all-season'}
- Mood: ${params.mood || 'comfortable'}
- Time of day: ${params.timeOfDay || 'day'}

For each outfit:
1. List the specific items to wear (use exact item names from the wardrobe)
2. Explain why this combination works (color harmony, proportions, occasion fit)
3. Suggest layering or accessories if applicable
4. Rate boldness/risk level (1-5, where 1 is very safe and 5 is very bold)
5. Provide 2 alternative tweaks or substitutions

Include at least 1 "safe" outfit (boldness 1-2) and 1 "bold" outfit (boldness 4-5).

Return your response as a JSON object with an "outfits" array containing this structure:
{
  "outfits": [
    {
      "items": ["item_name_1", "item_name_2", ...],
      "explanation": "Why this works...",
      "boldness_level": 3,
      "alternatives": ["alternative_1", "alternative_2"]
    },
    ...
  ]
}`
}

