import OpenAI from 'openai'

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// Lazy initialization - only creates client when accessed
let _openai: OpenAI | null = null
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    if (!_openai) {
      _openai = getOpenAIClient()
    }
    return (_openai as any)[prop]
  },
})

