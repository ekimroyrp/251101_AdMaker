import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const app = express()

const port = process.env.PORT || 5000
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.warn('Warning: OPENAI_API_KEY is not set. Image generation requests will fail.')
}

const openai = new OpenAI({
  apiKey,
})

const deriveSizeFromRatio = (rawWidth, rawHeight) => {
  const width = Number(rawWidth)
  const height = Number(rawHeight)

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null
  }

  if (Math.abs(width - height) < 0.01) {
    return '1024x1024'
  }

  return width > height ? '1536x1024' : '1024x1536'
}

app.use(
  cors({
    origin: clientOrigin,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/generate-image', async (req, res) => {
  const { prompt, width, height, label } = req.body ?? {}

  if (!apiKey) {
    return res.status(500).json({ error: 'Server is not configured with an OpenAI API key.' })
  }

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' })
  }

  const size = deriveSizeFromRatio(width, height)

  if (!size) {
    return res.status(400).json({ error: 'A valid aspect ratio is required for generation.' })
  }

  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: prompt.trim(),
      size,
    })

    const image = response.data?.[0]
    const base64 = image?.b64_json

    if (!base64) {
      throw new Error('The OpenAI response did not include image data.')
    }

    const imageUrl = `data:image/png;base64,${base64}`

    res.json({ imageUrl, size, label })
  } catch (error) {
    console.error('Image generation failed:', error)

    const message =
      error.response?.data?.error?.message ?? error.message ?? 'Failed to generate image.'
    res.status(500).json({ error: message })
  }
})

app.listen(port, () => {
  console.log(`Image generation server listening on http://localhost:${port}`)
})
