import Replicate from 'replicate'

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('REPLICATE_API_TOKEN is not set')
}

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export const FLUX_SCHNELL_MODEL = 'black-forest-labs/flux-schnell'

export const DEFAULT_FLUX_PARAMS = {
  num_outputs: 1,
  aspect_ratio: '3:4',
  output_format: 'png',
  output_quality: 85,
  go_fast: true,
}
