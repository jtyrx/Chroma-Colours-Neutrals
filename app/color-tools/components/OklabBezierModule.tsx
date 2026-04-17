'use client'

import {useMemo, useState} from 'react'

import {ColorSwatchOutputs} from '@/app/color-tools/components/ColorSwatchOutputs'
import {OklchColorField} from '@/app/color-tools/components/OklchColorField'
import {ProgressionControl} from '@/app/color-tools/components/ProgressionControl'
import {ToolCard} from '@/app/color-tools/components/ToolCard'
import {oklabQuadraticBezierColorsRemapped, parseColorCss} from '@/app/lib/colorJsTools'

const DEFAULT_A = 'oklch(0.95 0.02 260)'
const DEFAULT_B = 'oklch(0.55 0.12 40)'
const DEFAULT_C = 'oklch(0.15 0.05 260)'

/**
 * Quadratic Bézier in Cartesian Oklab (not a Color.js built-in). `progression` applies to t before
 * evaluating the spline (same role as chroma’s gamma on a 0–1 parameter).
 */
export function OklabBezierModule() {
  const [aText, setAText] = useState(DEFAULT_A)
  const [bText, setBText] = useState(DEFAULT_B)
  const [cText, setCText] = useState(DEFAULT_C)
  const [n, setN] = useState(11)
  const [gamma, setGamma] = useState(1)

  const a = useMemo(() => parseColorCss(aText), [aText])
  const b = useMemo(() => parseColorCss(bText), [bText])
  const c = useMemo(() => parseColorCss(cText), [cText])

  const colors = useMemo(() => {
    if (!a || !b || !c || n < 1) return []
    const tRemap = gamma === 1 ? (t: number) => t : (t: number) => t ** gamma
    return oklabQuadraticBezierColorsRemapped(a, b, c, n, tRemap)
  }, [a, b, c, n, gamma])

  const canRun = Boolean(a && b && c)

  return (
    <ToolCard
      title="Oklab quadratic spline"
      apiRef="Manual B(t) in Oklab — (1−t)²P₀ + 2(1−t)tP₁ + t²P₂ → sRGB; optional t ↦ t^γ"
    >
      <p className="text-sm leading-relaxed text-white/60">
        Color.js does not ship <span className="font-mono">chroma.bezier</span>-style splines. This
        matches the usual approach: Bézier in a Cartesian space (Oklab), then convert to sRGB for
        display and OKLCH for tokens.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        <OklchColorField
          label="Control P₀ (t = 0)"
          valueText={aText}
          parsed={a}
          onTextChange={setAText}
          onPickSrgbHex={(hex) => setAText(hex)}
        />
        <OklchColorField
          label="Control P₁ (t = 0.5)"
          valueText={bText}
          parsed={b}
          onTextChange={setBText}
          onPickSrgbHex={(hex) => setBText(hex)}
        />
        <OklchColorField
          label="Control P₂ (t = 1)"
          valueText={cText}
          parsed={c}
          onTextChange={setCText}
          onPickSrgbHex={(hex) => setCText(hex)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="bz-n" className="text-sm font-medium text-white/80">
            Samples <span className="font-mono text-white/55">n</span>
          </label>
          <input
            id="bz-n"
            type="number"
            min={1}
            max={64}
            value={n}
            onChange={(e) => setN(Math.max(1, Math.min(64, Number(e.target.value) || 1)))}
            className="w-full rounded-xl border border-white/12 bg-black/25 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <ProgressionControl id="bz-gamma" gamma={gamma} onChange={setGamma} />
      </div>

      {!canRun ? (
        <p className="text-sm text-amber-200/90">Enter three valid CSS colors.</p>
      ) : (
        <ColorSwatchOutputs
          colors={colors}
          footnote={
            gamma === 1
              ? 'Evenly spaced t ∈ [0,1] along the Oklab spline.'
              : 'Exponent remaps sample indices before lookup along the spline (quick emphasis on ends or middle).'
          }
        />
      )}
    </ToolCard>
  )
}
