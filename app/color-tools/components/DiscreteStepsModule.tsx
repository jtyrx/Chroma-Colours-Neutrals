'use client'

import {useMemo, useState} from 'react'

import {ColorSwatchOutputs} from '@/app/color-tools/components/ColorSwatchOutputs'
import {OklchColorField} from '@/app/color-tools/components/OklchColorField'
import {ToolCard} from '@/app/color-tools/components/ToolCard'
import {
  INTERPOLATION_SPACES,
  type HueMode,
  parseColorCss,
  sampleColorSteps,
} from '@/app/lib/colorJsTools'

const HUE_OPTIONS: {id: HueMode; label: string}[] = [
  {id: 'shorter', label: 'shorter (default)'},
  {id: 'longer', label: 'longer'},
  {id: 'increasing', label: 'increasing'},
  {id: 'decreasing', label: 'decreasing'},
  {id: 'raw', label: 'raw'},
]

const HUE_SPACES = new Set(['oklch', 'lch', 'hsl', 'hwb'])

const DEFAULT_START = 'oklch(0.99 0.01 260)'
const DEFAULT_END = 'oklch(0.12 0.02 260)'

export function DiscreteStepsModule() {
  const [startText, setStartText] = useState(DEFAULT_START)
  const [endText, setEndText] = useState(DEFAULT_END)
  const [minSteps, setMinSteps] = useState(8)
  const [space, setSpace] = useState<(typeof INTERPOLATION_SPACES)[number]['id']>('oklch')
  const [hue, setHue] = useState<HueMode>('shorter')
  const [maxDeltaE, setMaxDeltaE] = useState('3')
  const [useDeltaE, setUseDeltaE] = useState(false)

  const start = useMemo(() => parseColorCss(startText), [startText])
  const end = useMemo(() => parseColorCss(endText), [endText])

  const colors = useMemo(() => {
    if (!start || !end) return []
    const deltaParsed = Number(maxDeltaE)
    const delta =
      useDeltaE && Number.isFinite(deltaParsed) && deltaParsed > 0 ? deltaParsed : undefined
    return sampleColorSteps(start, end, {
      space,
      outputSpace: 'srgb',
      steps: minSteps,
      ...(delta != null ? {maxDeltaE: delta} : {}),
      ...(HUE_SPACES.has(space) ? {hue} : {}),
    })
  }, [start, end, minSteps, space, hue, maxDeltaE, useDeltaE])

  const canRun = Boolean(start && end)

  return (
    <ToolCard
      title="Discrete steps"
      apiRef="color.steps(end, { space, outputSpace: 'srgb', steps, maxDeltaE?, hue? })"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <OklchColorField
          label="Start color"
          valueText={startText}
          parsed={start}
          onTextChange={setStartText}
          onPickSrgbHex={(hex) => setStartText(hex)}
        />
        <OklchColorField
          label="End color"
          valueText={endText}
          parsed={end}
          onTextChange={setEndText}
          onPickSrgbHex={(hex) => setEndText(hex)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="ds-steps" className="text-sm font-medium text-white/80">
            Minimum steps
          </label>
          <input
            id="ds-steps"
            type="number"
            min={2}
            max={256}
            value={minSteps}
            onChange={(e) => setMinSteps(Math.max(2, Math.min(256, Number(e.target.value) || 2)))}
            className="w-full rounded-xl border border-white/12 bg-black/25 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="ds-space" className="text-sm font-medium text-white/80">
            Interpolation space
          </label>
          <select
            id="ds-space"
            value={space}
            onChange={(e) => setSpace(e.target.value as typeof space)}
            className="w-full rounded-xl border border-white/12 bg-black/25 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            {INTERPOLATION_SPACES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {HUE_SPACES.has(space) ? (
          <div className="space-y-2">
            <label htmlFor="ds-hue" className="text-sm font-medium text-white/80">
              Hue interpolation
            </label>
            <select
              id="ds-hue"
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
        ) : null}
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
            Limit ΔE between consecutive steps (adds steps until ΔE is below threshold; see Color.js
            docs)
          </span>
        </label>
        {useDeltaE ? (
          <div className="mt-3">
            <label htmlFor="ds-de" className="text-xs text-white/55">
              max ΔE
            </label>
            <input
              id="ds-de"
              type="number"
              min={0.01}
              step={0.5}
              value={maxDeltaE}
              placeholder="e.g. 3"
              onChange={(e) => setMaxDeltaE(e.target.value)}
              className="mt-1 w-full max-w-xs rounded-xl border border-white/12 bg-black/25 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        ) : null}
      </div>

      {!canRun ? (
        <p className="text-sm text-amber-200/90">Enter two valid CSS colors.</p>
      ) : (
        <ColorSwatchOutputs
          colors={colors}
          footnote={`${colors.length} step(s). ${
            useDeltaE && maxDeltaE
              ? `Adaptive: max ΔE ${maxDeltaE}, minimum ${minSteps} steps.`
              : `Fixed minimum step count: ${minSteps}.`
          }`}
        />
      )}
    </ToolCard>
  )
}
