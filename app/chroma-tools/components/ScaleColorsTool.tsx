'use client'

import chroma from 'chroma-js'
import {useMemo, useState} from 'react'

import {ColorField} from '@/app/chroma-tools/components/ColorField'
import {GammaControl} from '@/app/chroma-tools/components/GammaControl'
import {SwatchOutputs} from '@/app/chroma-tools/components/SwatchOutputs'
import {ToolCard} from '@/app/chroma-tools/components/ToolCard'
import {DEFAULT_GAMMA, domainSamples, parseColorInput} from '@/app/lib/chromaTools'

const DEFAULT_FIRST = '#f8fafc'
const DEFAULT_LAST = '#020617'

export function ScaleColorsTool() {
  const [firstText, setFirstText] = useState(DEFAULT_FIRST)
  const [lastText, setLastText] = useState(DEFAULT_LAST)
  const [n, setN] = useState(9)
  const [gamma, setGamma] = useState(DEFAULT_GAMMA)

  const first = useMemo(() => parseColorInput(firstText), [firstText])
  const last = useMemo(() => parseColorInput(lastText), [lastText])

  const colors = useMemo(() => {
    if (!first || !last || n < 1) return []
    const s = chroma.scale([first.hex(), last.hex()]).mode('oklch').gamma(gamma)
    return domainSamples(n).map((t) => chroma(s(t)))
  }, [first, last, n, gamma])

  const canRun = Boolean(first && last && n >= 1)

  return (
    <ToolCard title="OKLCH linear scale" apiRef="chroma.scale(colors).mode('oklch').gamma(γ).domain([0,1]) → sample t ∈ [0,1]">
      <div className="grid gap-6 lg:grid-cols-2">
        <ColorField
          label="First color"
          valueText={firstText}
          color={first}
          onTextChange={setFirstText}
          onColorPicked={(hex) => setFirstText(hex)}
        />
        <ColorField
          label="Last color"
          valueText={lastText}
          color={last}
          onTextChange={setLastText}
          onColorPicked={(hex) => setLastText(hex)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="scale-colors-n" className="text-sm font-medium text-white/80">
            Output count <span className="font-mono text-white/55">n</span>
          </label>
          <input
            id="scale-colors-n"
            type="number"
            min={1}
            max={64}
            value={n}
            onChange={(e) => setN(Math.max(1, Math.min(64, Number(e.target.value) || 1)))}
            className="w-full rounded-xl border border-white/12 bg-black/25 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <GammaControl id="scale-colors-gamma" value={gamma} onChange={setGamma} />
      </div>

      {!canRun ? (
        <p className="text-sm text-amber-200/90">Enter two valid colors to preview the scale.</p>
      ) : (
        <SwatchOutputs colors={colors} />
      )}
    </ToolCard>
  )
}
