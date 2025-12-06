import OpenAI from 'openai'

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not set')
}

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'FitCheckz',
  },
})

// Model constants for easy switching
export const MODELS = {
  VISION: 'openai/gpt-4o-mini',
  CREATIVE: 'anthropic/claude-sonnet-4.5',
} as const
