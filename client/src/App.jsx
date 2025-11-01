import { useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const RATIO_OPTIONS = [
  { id: '1.56-1', label: '1.56 : 1', width: 1.56, height: 1 },
  { id: '3.23-1', label: '3.23 : 1', width: 3.23, height: 1 },
  { id: '1.84-1', label: '1.84 : 1', width: 1.84, height: 1 },
  { id: '1-2.73', label: '1 : 2.73', width: 1, height: 2.73 },
  { id: '3.44-1', label: '3.44 : 1', width: 3.44, height: 1 },
  { id: '2.85-1', label: '2.85 : 1', width: 2.85, height: 1 },
  { id: '4.84-1', label: '4.84 : 1', width: 4.84, height: 1 },
  { id: '2.19-1', label: '2.19 : 1', width: 2.19, height: 1 },
  { id: '1-1.55', label: '1 : 1.55', width: 1, height: 1.55 },
  { id: '1-1', label: '1 : 1', width: 1, height: 1 },
]

const DEFAULT_PROMPT_HINT = 'Describe the ad you want to generate...'

function App() {
  const [selectedRatioId, setSelectedRatioId] = useState(RATIO_OPTIONS[0].id)
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedRatio = useMemo(
    () => RATIO_OPTIONS.find((ratio) => ratio.id === selectedRatioId) ?? RATIO_OPTIONS[0],
    [selectedRatioId],
  )

  const aspectPadding = useMemo(() => {
    const ratio = selectedRatio.height / selectedRatio.width
    return `${ratio * 100}%`
  }, [selectedRatio])

  const ratioDescriptor =
    selectedRatio.width > selectedRatio.height
      ? 'Landscape orientation'
      : selectedRatio.width < selectedRatio.height
        ? 'Portrait orientation'
        : 'Perfect square'

  const handleGenerate = async (event) => {
    event.preventDefault()

    if (!prompt.trim()) {
      setError('Please add a few descriptive words for the scene you want to generate.')
      return
    }

    setIsLoading(true)
    setError('')
    setImageUrl('')

    try {
      const response = await axios.post('/api/generate-image', {
        prompt: prompt.trim(),
        width: selectedRatio.width,
        height: selectedRatio.height,
        label: selectedRatio.label,
      })

      const url = response.data?.imageUrl
      if (!url) {
        throw new Error('The response did not include an image.')
      }

      setImageUrl(url)
    } catch (err) {
      const message =
        err.response?.data?.error ??
        err.message ??
        'Something unexpected happened while generating the image.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setPrompt('')
    setImageUrl('')
    setError('')
  }

  return (
    <div className="app-shell">
      <div className="glass-panel">
        <header className="panel-header">
          <h1>WIAMI AD AGENCY</h1>
        </header>

        <section className="preview-section">
          <div className="ratio-preview" style={{ paddingTop: aspectPadding }}>
            <div className="ratio-preview__inner">
              {isLoading ? (
                <div className="spinner" aria-live="polite" aria-label="Generating image" />
              ) : imageUrl ? (
                <img src={imageUrl} alt={`Generated concept for ${selectedRatio.label}`} />
              ) : (
                <span className="ratio-preview__label">{selectedRatio.label}</span>
              )}
            </div>
          </div>
        </section>

        <form className="control-panel" onSubmit={handleGenerate}>
          <div className="selector-section">
            <label className="selector-label" htmlFor="aspectRatioSelect">
              Ad Aspect
            </label>
            <div className="selector-shell">
              <select
                id="aspectRatioSelect"
                value={selectedRatioId}
                onChange={(event) => setSelectedRatioId(event.target.value)}
                disabled={isLoading}
              >
                {RATIO_OPTIONS.map((ratio) => (
                  <option key={ratio.id} value={ratio.id}>
                    {ratio.label}
                  </option>
                ))}
              </select>
              <div className="selector-glow" aria-hidden="true" />
            </div>
            <p className="selector-footnote">{ratioDescriptor}</p>
          </div>

          <div className="prompt-section">
            <label className="selector-label" htmlFor="promptInput">
              Ad Prompt
            </label>
            <div className="prompt-shell">
              <textarea
                id="promptInput"
                placeholder={DEFAULT_PROMPT_HINT}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={4}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="actions">
            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? 'Generating…' : 'Generate Image'}
            </button>
            <button type="button" className="secondary-button" onClick={handleReset} disabled={isLoading}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
