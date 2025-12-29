import OpenAI from 'openai'

function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set. Please add it to your .env.local file.')
  }

  if (apiKey.length < 20) {
    throw new Error('OPENROUTER_API_KEY appears to be invalid (too short). Please check your API key.')
  }

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    timeout: 60000, // 60 second timeout
    maxRetries: 0, // We handle retries in our own fetchWithRetry
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Styleum',
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
// Using Claude 3.5 Sonnet - the correct OpenRouter model ID
export const MODELS = {
  VISION: 'openai/gpt-4o-mini',
  CREATIVE: 'anthropic/claude-3.5-sonnet:beta',
} as const
