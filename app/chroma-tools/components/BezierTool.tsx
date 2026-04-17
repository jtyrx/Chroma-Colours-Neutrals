'use client'

import chroma from 'chroma-js'
import {useMemo, useState} from 'react'

import {ColorField} from '@/app/chroma-tools/components/ColorField'
import {GammaControl} from '@/app/chroma-tools/components/GammaControl'
import {SwatchOutputs} from '@/app/chroma-tools/components/SwatchOutputs'
import {ToolCard} from '@/app/chroma-tools/components/ToolCard'
import {DEFAULT_GAMMA, domainSamples, parseColorInput} from '@/app/lib/chromaTools'

const DEFAULT_A = '#e2e8f0'
const DEFAULT_B = '#64748b'
const DEFAULT_C = '#0f172a'

export function BezierTool() {
  const [aText, setAText] = useState(DEFAULT_A)
  const [bText, setBText] = useState(DEFAULT_B)
  const [cText, setCText] = useState(DEFAULT_C)
  const [n, setN] = useState(9)
  const [gamma, setGamma] = useState(DEFAULT_GAMMA)

  const a = useMemo(() => parseColorInput(aText), [aText])
  const b = useMemo(() => parseColorInput(bText), [bText])
  const c = useMemo(() => parseColorInput(cText), [cText])

  const colors = useMemo(() => {
    if (!a || !b || !c || n < 1) return []
    const spline = chroma.bezier([a.hex(), b.hex(), c.hex()])
    const s = spline.scale().gamma(gamma)
    return domainSamples(n).map((t) => chroma(s(t)))
  }, [a, b, c, n, gamma])

  const canRun = Boolean(a && b && c && n >= 1)

  return (
    <ToolCard
      title="Bezier spline scale"
      apiRef="chroma.bezier([c₀,c₁,c₂]).scale().gamma(γ) — spline in LAB; OKLCH shown for inspection"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <ColorField
          label="Color 1 (t=0)"
          valueText={aText}
          color={a}
          onTextChange={setAText}
          onColorPicked={(hex) => setAText(hex)}
        />
        <ColorField
          label="Color 2 (t=0.5)"
          valueText={bText}
          color={b}
          onTextChange={setBText}
          onColorPicked={(hex) => setBText(hex)}
        />
        <ColorField
          label="Color 3 (t=1)"
          valueText={cText}
          color={c}
          onTextChange={setCText}
          onColorPicked={(hex) => setCText(hex)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="bezier-n" className="text-sm font-medium text-white/80">
            Output count <span className="font-mono text-white/55">n</span>
          </label>
          <input
            id="bezier-n"
            type="number"
            min={1}
            max={64}
            value={n}
            onChange={(e) => setN(Math.max(1, Math.min(64, Number(e.target.value) || 1)))}
            className="w-full rounded-xl border border-white/12 bg-black/25 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <GammaControl id="bezier-gamma" value={gamma} onChange={setGamma} />
      </div>

      {!canRun ? (
        <p className="text-sm text-amber-200/90">Enter three valid colors to preview the bezier scale.</p>
      ) : (
        <SwatchOutputs
          colors={colors}
          footnote="Chroma computes the spline in CIELAB, then outputs OKLCH here via css('oklch') for token-style debugging."
        />
      )}
    </ToolCard>
  )
}
