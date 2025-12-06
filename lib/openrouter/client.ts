import OpenAI from 'openai'

function getOpenRouterClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set')
  }

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'FitCheckz',
    },
  })
}

// Lazy initialization - only creates client when accessed
let _openrouter: OpenAI | null = null
export const openrouter = new Proxy({} as OpenAI, {
  get(_target, prop) {
    if (!_openrouter) {
      _openrouter = getOpenRouterClient()
    }
    return (_openrouter as any)[prop]
  },
})

// Model constants for easy switching
export const MODELS = {
  VISION: 'openai/gpt-4o-mini',
  CREATIVE: 'anthropic/claude-sonnet-4.5',
} as const
