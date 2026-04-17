'use client'

import chroma from 'chroma-js'
import type {Color} from 'chroma-js'
import {useMemo, useState} from 'react'

import {ColorField} from '@/app/chroma-tools/components/ColorField'
import {GammaControl} from '@/app/chroma-tools/components/GammaControl'
import {SwatchOutputs} from '@/app/chroma-tools/components/SwatchOutputs'
import {ToolCard} from '@/app/chroma-tools/components/ToolCard'
import {
  DEFAULT_CLASS_BREAKS,
  DEFAULT_GAMMA,
  parseClassBreaks,
  parseColorInput,
} from '@/app/lib/chromaTools'

const DEFAULT_FIRST = '#ffffff'
const DEFAULT_LAST = '#000000'

function breaksToString(b: readonly number[]) {
  return b.join(', ')
}

export function ScaleClassesTool() {
  const [firstText, setFirstText] = useState(DEFAULT_FIRST)
  const [lastText, setLastText] = useState(DEFAULT_LAST)
  const [breaksText, setBreaksText] = useState(() => breaksToString(DEFAULT_CLASS_BREAKS))
  const [gamma, setGamma] = useState(DEFAULT_GAMMA)

  const first = useMemo(() => parseColorInput(firstText), [firstText])
  const last = useMemo(() => parseColorInput(lastText), [lastText])
  const parsedBreaks = useMemo(() => parseClassBreaks(breaksText), [breaksText])

  const {colors, error} = useMemo(() => {
    if (!first || !last || !parsedBreaks.ok) {
      return {colors: [] as Color[], error: parsedBreaks.ok ? null : parsedBreaks.error}
    }
    try {
      const s = chroma
        .scale([first.hex(), last.hex()])
        .mode('oklch')
        .gamma(gamma)
        .classes(parsedBreaks.breaks)
      const raw = s.colors(0) as unknown
      const list = Array.isArray(raw) ? raw : []
      const asColors = list.map((item: string | Color) =>
        typeof item === 'string' ? chroma(item) : item,
      )
      return {colors: asColors, error: null as string | null}
    } catch (e) {
      return {
        colors: [] as Color[],
        error: e instanceof Error ? e.message : 'Could not build class scale.',
      }
    }
  }, [first, last, parsedBreaks, gamma])

  const canRun = Boolean(first && last && parsedBreaks.ok)
  const breakError = !parsedBreaks.ok ? parsedBreaks.error : null

  return (
    <ToolCard
      title="Class breaks (quantized)"
      apiRef="chroma.scale(colors).mode('oklch').gamma(γ).classes(breaks) → scale.colors(0)"
    >
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

      <div className="space-y-2">
        <label htmlFor="class-breaks" className="text-sm font-medium text-white/80">
          Class breaks <span className="font-mono text-white/55">[t₀ … tₙ]</span> (domain 0–1)
        </label>
        <textarea
          id="class-breaks"
          rows={2}
          value={breaksText}
          onChange={(e) => setBreaksText(e.target.value)}
          spellCheck={false}
          className="w-full resize-y rounded-xl border border-white/12 bg-black/25 px-3 py-2 font-mono text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="0, 0.3, 0.55, 0.85, 1"
        />
        {breakError ? <p className="text-sm text-amber-200/90">{breakError}</p> : null}
        <p className="text-xs text-white/45">
          One swatch per segment (midpoint sampling), matching chroma’s <span className="font-mono">scale.colors(0)</span>{' '}
          with <span className="font-mono">classes</span> set.
        </p>
      </div>

      <GammaControl id="scale-classes-gamma" value={gamma} onChange={setGamma} />

      {error ? <p className="text-sm text-amber-200/90">{error}</p> : null}

      {!canRun ? (
        <p className="text-sm text-amber-200/90">Enter two valid colors and valid breaks to preview.</p>
      ) : (
        <SwatchOutputs
          colors={colors}
          footnote={`${colors.length} discrete class color(s) for ${parsedBreaks.ok ? parsedBreaks.breaks.length : 0} breaks.`}
        />
      )}
    </ToolCard>
  )
}
