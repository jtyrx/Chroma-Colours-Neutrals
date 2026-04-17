import Color from 'colorjs.io'

export type HueMode = 'shorter' | 'longer' | 'increasing' | 'decreasing' | 'raw'

export const INTERPOLATION_SPACES = [
  {id: 'oklch', label: 'OKLCH'},
  {id: 'oklab', label: 'Oklab'},
  {id: 'lch', label: 'LCH (CIE)'},
  {id: 'lab', label: 'Lab (CIE)'},
  {id: 'srgb', label: 'sRGB (gamma)'},
  {id: 'srgb-linear', label: 'sRGB linear'},
] as const

export function parseColorCss(raw: string): Color | null {
  const s = raw.trim()
  if (!s) return null
  try {
    return new Color(s)
  } catch {
    return null
  }
}

export function domainTValues(n: number): number[] {
  if (n < 1) return []
  if (n === 1) return [0.5]
  return Array.from({length: n}, (_, i) => i / (n - 1))
}

type RangeOpts = {
  space: string
  outputSpace: string
  hue?: HueMode
  progression?: (p: number) => number
}

export function sampleColorRange(
  start: Color,
  end: Color,
  n: number,
  {space, outputSpace, hue, progression}: RangeOpts,
): Color[] {
  const rangeOptions: Record<string, unknown> = {space, outputSpace}
  if (hue && ['oklch', 'lch', 'hsl', 'hwb'].includes(space)) {
    rangeOptions.hue = hue
  }
  if (progression) {
    rangeOptions.progression = progression
  }
  const r = start.range(end, rangeOptions as Parameters<Color['range']>[1])
  return domainTValues(n).map((t) => r(t) as Color)
}

type StepsOpts = {
  space: string
  outputSpace: string
  steps: number
  maxDeltaE?: number
  hue?: HueMode
}

export function sampleColorSteps(start: Color, end: Color, opts: StepsOpts): Color[] {
  const stepOptions: Record<string, unknown> = {
    space: opts.space,
    outputSpace: opts.outputSpace,
    steps: opts.steps,
  }
  if (opts.maxDeltaE != null && opts.maxDeltaE > 0) {
    stepOptions.maxDeltaE = opts.maxDeltaE
  }
  if (opts.hue && ['oklch', 'lch', 'hsl', 'hwb'].includes(opts.space)) {
    stepOptions.hue = opts.hue
  }
  return start.steps(end, stepOptions as Parameters<Color['steps']>[1])
}

function oklabQuadraticAtT(a: Color, b: Color, c: Color, t: number): Color {
  const p0 = a.to('oklab').coords
  const p1 = b.to('oklab').coords
  const p2 = c.to('oklab').coords
  const coords = [0, 1, 2].map(
    (i) => (1 - t) * (1 - t) * p0[i]! + 2 * (1 - t) * t * p1[i]! + t * t * p2[i]!,
  ) as [number, number, number]
  return new Color('oklab', coords).to('srgb')
}

/** Quadratic Bézier in Cartesian Oklab (same idea as chroma’s LAB spline). */
export function oklabQuadraticBezierColors(a: Color, b: Color, c: Color, n: number): Color[] {
  return domainTValues(n).map((t) => oklabQuadraticAtT(a, b, c, t))
}

/** Same spline with a remapped parameter `tRemap` (e.g. `t => t ** γ`). */
export function oklabQuadraticBezierColorsRemapped(
  a: Color,
  b: Color,
  c: Color,
  n: number,
  tRemap: (t: number) => number,
): Color[] {
  return domainTValues(n).map((t) => oklabQuadraticAtT(a, b, c, tRemap(t)))
}

export function colorToOklchCss(c: Color): string {
  return c.to('oklch').toString({format: 'css'})
}

export function colorToSrgbCss(c: Color): string {
  return c.to('srgb').toString({format: 'css'})
}

const WHITE = new Color('white')

/** Readable label color on top of `c` (WCAG-style vs white). */
export function labelTextOnColor(c: Color): '#ffffff' | '#171717' {
  const w = WHITE.contrastWCAG21(c)
  return w < 4.5 ? '#171717' : '#ffffff'
}

/** OKLCH coordinates as returned by Color.js (`L` is 0–1, `h` may be `null` when C is 0). */
export type OklchTuple = {
  L: number
  C: number
  h: number | null
}

export function getOklchTuple(c: Color): OklchTuple {
  const o = c.to('oklch')
  const [L, C, h] = o.coords
  return {
    L: L ?? 0,
    C: C ?? 0,
    h: h === undefined ? null : h,
  }
}

/** CSS-style L as 0–100 (Color.js stores L in 0–1 for OKLCH). */
export function oklchLToPercent(L: number): number {
  return L <= 1 ? L * 100 : L
}

/** `deltaEOK` to the next color; last index is `null` (Color.js OKLab-based ΔE). */
export function deltaEOKToNext(colors: Color[]): (number | null)[] {
  return colors.map((c, i) =>
    i < colors.length - 1 ? c.deltaEOK(colors[i + 1]!) : null,
  )
}
