import { useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const ASPECT_RATIOS = [
  { id: '1:1', label: 'Square (1:1)', width: 1, height: 1, size: '1024x1024' },
  { id: '16:9', label: 'Landscape (16:9)', width: 16, height: 9, size: '1792x1024' },
  { id: '9:16', label: 'Portrait (9:16)', width: 9, height: 16, size: '1024x1792' },
]

const defaultRatioId = ASPECT_RATIOS[0].id

function App() {
  const [selectedRatioId, setSelectedRatioId] = useState(defaultRatioId)
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedRatio = useMemo(
    () => ASPECT_RATIOS.find((ratio) => ratio.id === selectedRatioId) ?? ASPECT_RATIOS[0],
    [selectedRatioId],
  )

  const aspectPadding = useMemo(() => {
    const { width, height } = selectedRatio
    const ratio = height / width
    return `${ratio * 100}%`
  }, [selectedRatio])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!prompt.trim()) {
      setError('Please describe the image you want to generate.')
      return
    }

    setIsLoading(true)
    setError('')
    setImageUrl('')

    try {
      const response = await axios.post('/api/generate-image', {
        prompt: prompt.trim(),
        size: selectedRatio.size,
      })
      setImageUrl(response.data?.imageUrl ?? '')
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Something went wrong while generating the image.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Ad Maker Image Generator</h1>
        <p className="subtitle">
          Choose an aspect ratio, describe your concept, and preview the generated artwork.
        </p>
      </header>

      <main className="app-main">
        <section className="preview-wrapper">
          <div className="preview" style={{ paddingTop: aspectPadding }}>
            <div className="preview-inner">
              {imageUrl ? (
                <img src={imageUrl} alt="Generated artwork" />
              ) : (
                <span>Generated image will appear here.</span>
              )}
            </div>
          </div>
        </section>

        <section className="controls">
          <form className="control-form" onSubmit={handleSubmit}>
            <label className="control-group" htmlFor="aspect-ratio">
              <span className="label-text">Aspect ratio</span>
              <select
                id="aspect-ratio"
                value={selectedRatioId}
                onChange={(event) => setSelectedRatioId(event.target.value)}
              >
                {ASPECT_RATIOS.map((ratio) => (
                  <option key={ratio.id} value={ratio.id}>
                    {ratio.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="control-group" htmlFor="prompt">
              <span className="label-text">Prompt</span>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe the scene, subject, style, lighting, and mood you want."
                rows={4}
              />
            </label>

            {error && <p className="error-text">{error}</p>}

            <div className="actions">
              <button type="submit" className="primary" disabled={isLoading}>
                {isLoading ? 'Generating…' : 'Generate image'}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setPrompt('')
                  setImageUrl('')
                  setError('')
                }}
                disabled={isLoading}
              >
                Reset
              </button>
            </div>
          </form>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Update the aspect ratio list to match your presets and ensure the backend supports each
          size.
        </p>
      </footer>
    </div>
  )
}

export default App
