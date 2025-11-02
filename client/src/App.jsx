import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import './App.css'

const RATIO_OPTIONS = [
  { id: '1-1', label: '1 : 1', width: 1, height: 1 },
  { id: '1.55-1', label: '1.55 : 1', width: 1.55, height: 1 },
  { id: '1.56-1', label: '1.56 : 1', width: 1.56, height: 1 },
  { id: '1.84-1', label: '1.84 : 1', width: 1.84, height: 1 },
  { id: '2.19-1', label: '2.19 : 1', width: 2.19, height: 1 },
  { id: '2.73-1', label: '2.73 : 1', width: 2.73, height: 1 },
  { id: '2.85-1', label: '2.85 : 1', width: 2.85, height: 1 },
  { id: '3.23-1', label: '3.23 : 1', width: 3.23, height: 1 },
  { id: '3.44-1', label: '3.44 : 1', width: 3.44, height: 1 },
  { id: '4.84-1', label: '4.84 : 1', width: 4.84, height: 1 },
]

const DEFAULT_PROMPT_HINT = 'Describe the ad you want to generate...'

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'generated-ad'

const ORIENTATION_OPTIONS = [
  { id: 'landscape', label: 'Landscape' },
  { id: 'portrait', label: 'Portrait' },
]

const formatDimension = (value) => {
  if (Number.isInteger(value)) {
    return value.toString()
  }
  return Number(value.toFixed(2)).toString()
}

function App() {
  const [selectedRatioId, setSelectedRatioId] = useState(RATIO_OPTIONS[0].id)
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [orientation, setOrientation] = useState('landscape')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lastPrompt, setLastPrompt] = useState('')

  const selectedRatio = useMemo(
    () => RATIO_OPTIONS.find((ratio) => ratio.id === selectedRatioId) ?? RATIO_OPTIONS[0],
    [selectedRatioId],
  )

  const orientedDimensions = useMemo(() => {
    const baseWidth = selectedRatio.width
    const baseHeight = selectedRatio.height
    if (orientation === 'portrait') {
      return {
        width: baseHeight,
        height: baseWidth,
      }
    }
    return {
      width: baseWidth,
      height: baseHeight,
    }
  }, [selectedRatio, orientation])

  const orientedLabel = useMemo(
    () => formatDimension(orientedDimensions.width) + ' : ' + formatDimension(orientedDimensions.height),
    [orientedDimensions],
  )

  const aspectPadding = useMemo(() => {
    const ratio = orientedDimensions.height / orientedDimensions.width
    return `${ratio * 100}%`
  }, [orientedDimensions])

  const handleGenerate = async (event) => {
    event.preventDefault()

    const requestPrompt = prompt.trim()

    if (!requestPrompt) {
      setError('Please add a few descriptive words for the scene you want to generate.')
      return
    }

    setIsLoading(true)
    setError('')
    setImageUrl('')

    try {
      const response = await axios.post('/api/generate-image', {
        prompt: requestPrompt,
        width: orientedDimensions.width,
        height: orientedDimensions.height,
        label: orientedLabel,
      })

      const url = response.data?.imageUrl
      if (!url) {
        throw new Error('The response did not include an image.')
      }

      setImageUrl(url)
      setLastPrompt(requestPrompt)
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
    setLastPrompt('')
  }

  const effectivePrompt = lastPrompt || prompt.trim()
  const downloadFileName = `${slugify(effectivePrompt)}.png`

  const dropdownRef = useRef(null)

  useEffect(() => {
    if (isLoading) {
      setIsMenuOpen(false)
    }
  }, [isLoading])

  useEffect(() => {
    const handleClickAway = (event) => {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickAway)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickAway)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  const handleDownload = () => {
    if (!imageUrl) {
      return
    }

    const link = document.createElement('a')
    link.href = imageUrl
    link.download = downloadFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
                <img src={imageUrl} alt={`Generated concept for ${orientedLabel}`} />
              ) : (
                <span className="ratio-preview__label">{orientedLabel}</span>
              )}
            </div>
          </div>
        </section>

        <form className="control-panel" onSubmit={handleGenerate}>
          <div className="selector-section">
            <label className="selector-label" htmlFor="aspectRatioSelect">
              Ad Aspect
            </label>
            <div className={`selector-shell ${isMenuOpen ? 'is-open' : ''}`} ref={dropdownRef}>
              <button
                type="button"
                id="aspectRatioSelect"
                className="selector-trigger"
                onClick={() => {
                  if (!isLoading) {
                    setIsMenuOpen((open) => !open)
                  }
                }}
                disabled={isLoading}
                aria-haspopup="listbox"
                aria-expanded={isMenuOpen}
                aria-controls="aspectRatioListbox"
              >
                <span>{orientedLabel}</span>
                <svg
                  className="selector-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M7 10l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="selector-glow" aria-hidden="true" />
              <ul
                id="aspectRatioListbox"
                className={`selector-menu ${isMenuOpen ? 'is-open' : ''}`}
                role="listbox"
                aria-activedescendant={`aspect-option-${selectedRatioId}`}
                aria-hidden={!isMenuOpen}
              >
                {RATIO_OPTIONS.map((ratio) => (
                  <li key={ratio.id} className="selector-option">
                    <button
                      type="button"
                      id={`aspect-option-${ratio.id}`}
                      role="option"
                      aria-selected={ratio.id === selectedRatioId}
                      onClick={() => {
                        setSelectedRatioId(ratio.id)
                        setIsMenuOpen(false)
                      }}
                    >
                      {ratio.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="orientation-toggle" role="radiogroup" aria-label="Orientation">
              {ORIENTATION_OPTIONS.map((option) => {
                const isActive = orientation === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    className={`orientation-option ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      if (!isLoading) {
                        setOrientation(option.id)
                      }
                    }}
                    disabled={isLoading}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
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
              {isLoading ? 'Generating...' : 'Generate Ad'}
            </button>
            <button type="button" className="secondary-button" onClick={handleReset} disabled={isLoading}>
              Reset
            </button>
            {imageUrl && !isLoading && (
              <button type="button" className="download-button" onClick={handleDownload}>
                <span>Download</span>
              </button>
            )}
            {imageUrl && !isLoading && (
              <button type="button" className="mint-button">
                <span>Mint</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default App




