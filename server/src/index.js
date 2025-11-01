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
  const { prompt, size } = req.body ?? {}

  if (!apiKey) {
    return res.status(500).json({ error: 'Server is not configured with an OpenAI API key.' })
  }

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' })
  }

  if (!size || !/^\d+x\d+$/.test(size)) {
    return res.status(400).json({ error: 'A valid size value is required (e.g. 1024x1024).' })
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

    res.json({ imageUrl })
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
