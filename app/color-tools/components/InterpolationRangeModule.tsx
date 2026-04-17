'use client'

import {useMemo, useState} from 'react'

import {ColorSwatchOutputs} from '@/app/color-tools/components/ColorSwatchOutputs'
import {OklchColorField} from '@/app/color-tools/components/OklchColorField'
import {ProgressionControl} from '@/app/color-tools/components/ProgressionControl'
import {ToolCard} from '@/app/color-tools/components/ToolCard'
import {
  INTERPOLATION_SPACES,
  type HueMode,
  parseColorCss,
  sampleColorRange,
} from '@/app/lib/colorJsTools'

const HUE_OPTIONS: {id: HueMode; label: string}[] = [
  {id: 'shorter', label: 'shorter (default)'},
  {id: 'longer', label: 'longer'},
  {id: 'increasing', label: 'increasing'},
  {id: 'decreasing', label: 'decreasing'},
  {id: 'raw', label: 'raw'},
]

const HUE_SPACES = new Set(['oklch', 'lch', 'hsl', 'hwb'])

const DEFAULT_START = 'oklch(0.96 0.02 260)'
const DEFAULT_END = 'oklch(0.18 0.04 260)'

export function InterpolationRangeModule() {
  const [startText, setStartText] = useState(DEFAULT_START)
  const [endText, setEndText] = useState(DEFAULT_END)
  const [n, setN] = useState(9)
  const [space, setSpace] = useState<(typeof INTERPOLATION_SPACES)[number]['id']>('oklch')
  const [hue, setHue] = useState<HueMode>('shorter')
  const [gamma, setGamma] = useState(1)

  const start = useMemo(() => parseColorCss(startText), [startText])
  const end = useMemo(() => parseColorCss(endText), [endText])

  const colors = useMemo(() => {
    if (!start || !end || n < 1) return []
    const progression = gamma === 1 ? undefined : (p: number) => p ** gamma
    return sampleColorRange(start, end, n, {
      space,
      outputSpace: 'srgb',
      ...(HUE_SPACES.has(space) ? {hue} : {}),
      ...(progression ? {progression} : {}),
    })
  }, [start, end, n, space, hue, gamma])

  const canRun = Boolean(start && end)

  return (
    <ToolCard
      title="Interpolation range"
      apiRef="color.range(end, { space, outputSpace: 'srgb', hue?, progression? }) · sample t ∈ [0,1]"
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
          <label htmlFor="ir-n" className="text-sm font-medium text-white/80">
            Swatches <span className="font-mono text-white/55">n</span>
          </label>
          <input
            id="ir-n"
            type="number"
            min={1}
            max={64}
            value={n}
            onChange={(e) => setN(Math.max(1, Math.min(64, Number(e.target.value) || 1)))}
            className="w-full rounded-xl border border-white/12 bg-black/25 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="ir-space" className="text-sm font-medium text-white/80">
            Interpolation space
          </label>
          <select
            id="ir-space"
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
            <label htmlFor="ir-hue" className="text-sm font-medium text-white/80">
              Hue interpolation
            </label>
            <select
              id="ir-hue"
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

      <ProgressionControl id="ir-gamma" gamma={gamma} onChange={setGamma} />

      {!canRun ? (
        <p className="text-sm text-amber-200/90">Enter two valid CSS colors.</p>
      ) : (
        <ColorSwatchOutputs
          colors={colors}
          footnote={`${colors.length} sample(s) in ${space}${HUE_SPACES.has(space) ? `, hue: ${hue}` : ''}.`}
        />
      )}
    </ToolCard>
  )
}
