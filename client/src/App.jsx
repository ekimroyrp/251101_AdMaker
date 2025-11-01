import { useMemo, useState } from 'react'
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

function App() {
  const [selectedRatioId, setSelectedRatioId] = useState(RATIO_OPTIONS[0].id)

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

  return (
    <div className="app-shell">
      <div className="glass-panel">
        <header className="panel-header">
          <h1>Ad Agency</h1>
        </header>

        <section className="preview-section">
          <div className="ratio-preview" style={{ paddingTop: aspectPadding }}>
            <div className="ratio-preview__inner">
              <span className="ratio-preview__label">{selectedRatio.label}</span>
            </div>
          </div>
        </section>

        <section className="selector-section">
          <label className="selector-label" htmlFor="aspectRatioSelect">
            Aspect ratio
          </label>
          <div className="selector-shell">
            <select
              id="aspectRatioSelect"
              value={selectedRatioId}
              onChange={(event) => setSelectedRatioId(event.target.value)}
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
        </section>
      </div>
    </div>
  )
}

export default App
