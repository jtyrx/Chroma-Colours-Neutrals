'use client'

import {useMemo, useState} from 'react'

import {NeutralRampOutputs} from '@/app/color-tools/components/NeutralRampOutputs'
import {OklchColorField} from '@/app/color-tools/components/OklchColorField'
import {ToolCard} from '@/app/color-tools/components/ToolCard'
import {type HueMode, parseColorCss, sampleColorSteps} from '@/app/lib/colorJsTools'

const HUE_OPTIONS: {id: HueMode; label: string}[] = [
  {id: 'shorter', label: 'shorter (default)'},
  {id: 'longer', label: 'longer'},
  {id: 'increasing', label: 'increasing'},
  {id: 'decreasing', label: 'decreasing'},
  {id: 'raw', label: 'raw'},
]

const PRESETS = [
  {
    id: 'achromatic',
    label: 'Achromatic',
    start: 'oklch(98.5% 0 none)',
    end: 'oklch(5% 0 none)',
  },
  {
    id: 'warm',
    label: 'Warm bias',
    start: 'oklch(97% 0.012 65)',
    end: 'oklch(10% 0.018 58)',
  },
  {
    id: 'cool',
    label: 'Cool bias',
    start: 'oklch(97% 0.012 260)',
    end: 'oklch(10% 0.018 258)',
  },
] as const

export function NeutralRampModule() {
  const [startText, setStartText] = useState<string>(PRESETS[0].start)
  const [endText, setEndText] = useState<string>(PRESETS[0].end)
  const [minSteps, setMinSteps] = useState(12)
  const [hue, setHue] = useState<HueMode>('shorter')
  const [maxDeltaE, setMaxDeltaE] = useState('3')
  const [useDeltaE, setUseDeltaE] = useState(true)

  const start = useMemo(() => parseColorCss(startText), [startText])
  const end = useMemo(() => parseColorCss(endText), [endText])

  const colors = useMemo(() => {
    if (!start || !end) return []
    const deltaParsed = Number(maxDeltaE)
    const delta =
      useDeltaE && Number.isFinite(deltaParsed) && deltaParsed > 0 ? deltaParsed : undefined
    return sampleColorSteps(start, end, {
      space: 'oklch',
      outputSpace: 'srgb',
      steps: minSteps,
      ...(delta != null ? {maxDeltaE: delta} : {}),
      hue,
    })
  }, [start, end, minSteps, hue, maxDeltaE, useDeltaE])

  const canRun = Boolean(start && end)

  return (
    <ToolCard
      title="Neutral ramp"
      apiRef="color.steps(end, { space: 'oklch', steps, maxDeltaE?, hue? }) · deltaEOK · OKLCH coords"
    >
      <p className="text-sm leading-relaxed text-white/55">
        Build neutral ladders in <span className="font-mono text-white/70">oklch</span> using{' '}
        <span className="font-mono text-white/70">color.steps</span>. Optional{' '}
        <span className="font-mono text-white/70">maxDeltaE</span> asks Color.js to subdivide until
        its internal distance threshold is met (not the same numeric scale as{' '}
        <span className="font-mono text-white/70">deltaEOK</span>). The table lists OKLCH L/C/h and{' '}
        <span className="font-mono text-white/70">deltaEOK</span> between neighbors for auditing
        uneven jumps or chroma drift.
      </p>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setStartText(p.start)
              setEndText(p.end)
            }}
            className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:bg-white/10"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OklchColorField
          label="Light end"
          valueText={startText}
          parsed={start}
          onTextChange={setStartText}
          onPickSrgbHex={(hex) => setStartText(hex)}
          hint="Typically high L, low or zero chroma."
        />
        <OklchColorField
          label="Dark end"
          valueText={endText}
          parsed={end}
          onTextChange={setEndText}
          onPickSrgbHex={(hex) => setEndText(hex)}
          hint="Typically low L; keep hue aligned for tinted neutrals."
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="nr-steps" className="text-sm font-medium text-white/80">
            Minimum steps
          </label>
          <input
            id="nr-steps"
            type="number"
            min={2}
            max={256}
            value={minSteps}
            onChange={(e) => setMinSteps(Math.max(2, Math.min(256, Number(e.target.value) || 2)))}
            className="w-full rounded-xl border border-white/12 bg-black/25 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="nr-hue" className="text-sm font-medium text-white/80">
            Hue interpolation
          </label>
          <select
            id="nr-hue"
            value={hue}
            onChange={(e) => setHue(e.target.value as HueMode)}
            className="w-full rounded-xl border border-white/12 bg-black/25 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            {HUE_OPTIONS.map((h) => (
              <option key={h.id} value={h.id}>
                {h.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-black/20 p-4">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
          <input
            type="checkbox"
            checked={useDeltaE}
            onChange={(e) => setUseDeltaE(e.target.checked)}
            className="size-4 rounded border-white/20"
          />
          <span>
            Pass <span className="font-mono">maxDeltaE</span> into <span className="font-mono">steps</span>{' '}
            so Color.js subdivides the ramp (see Color.js docs for the exact distance metric).
          </span>
        </label>
        {useDeltaE ? (
          <div className="mt-3">
            <label htmlFor="nr-de" className="text-xs text-white/55">
              <span className="font-mono">maxDeltaE</span> (Color.js <span className="font-mono">steps</span>)
            </label>
            <input
              id="nr-de"
              type="number"
              min={0.01}
              step={0.25}
              value={maxDeltaE}
              onChange={(e) => setMaxDeltaE(e.target.value)}
              className="mt-1 w-full max-w-xs rounded-xl border border-white/12 bg-black/25 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        ) : null}
      </div>

      {!canRun ? (
        <p className="text-sm text-amber-200/90">Enter two valid CSS colors.</p>
      ) : (
        <NeutralRampOutputs
          colors={colors}
          footnote={`${colors.length} stop(s). Interpolation space: OKLCH. ${
            useDeltaE && maxDeltaE
              ? `Subdivision: steps({ maxDeltaE: ${maxDeltaE} }), minimum ${minSteps} steps.`
              : `Fixed step count: ${minSteps} (no maxDeltaE).`
          } “ΔE_OK →” uses Color.prototype.deltaEOK between adjacent listed swatches.`}
        />
      )}
    </ToolCard>
  )
}
