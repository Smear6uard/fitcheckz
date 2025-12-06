import Replicate from 'replicate'

function getReplicateClient() {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN is not set')
  }

  return new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  })
}

// Lazy initialization - only creates client when accessed
let _replicate: Replicate | null = null
export const replicate = new Proxy({} as Replicate, {
  get(_target, prop) {
    if (!_replicate) {
      _replicate = getReplicateClient()
    }
    return (_replicate as any)[prop]
  },
})

export const FLUX_SCHNELL_MODEL = 'black-forest-labs/flux-schnell'

export const DEFAULT_FLUX_PARAMS = {
  num_outputs: 1,
  aspect_ratio: '3:4',
  output_format: 'png',
  output_quality: 85,
  go_fast: true,
}
