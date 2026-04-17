import chroma from 'chroma-js'
import type {Color} from 'chroma-js'

export const DEFAULT_GAMMA = 1

export function parseColorInput(raw: string): Color | null {
  const s = raw.trim()
  if (!s) return null
  try {
    if (chroma.valid(s)) return chroma(s)
  } catch {
    /* ignore */
  }
  return null
}

/** Linear samples in [0, 1] for a scale with `n` output swatches. */
export function domainSamples(n: number): number[] {
  if (n < 1) return []
  if (n === 1) return [0.5]
  return Array.from({length: n}, (_, i) => i / (n - 1))
}

export function colorToHexForPicker(c: Color): string {
  return c.hex()
}

export function oklchCssString(c: Color): string {
  return c.css('oklch')
}

export function hslCssString(c: Color): string {
  return c.css('hsl')
}

/** Parse comma- or whitespace-separated class breaks; must be finite, length ≥ 2, strictly ascending. */
export function parseClassBreaks(input: string): {ok: true; breaks: number[]} | {ok: false; error: string} {
  const parts = input
    .replace(/[[\]]/g, ' ')
    .split(/[,;\s]+/)
    .map((p) => p.trim())
    .filter(Boolean)
  const nums = parts.map((p) => Number(p))
  if (nums.some((n) => !Number.isFinite(n))) {
    return {ok: false, error: 'All breaks must be valid numbers.'}
  }
  if (nums.length < 2) {
    return {ok: false, error: 'Provide at least two class breaks.'}
  }
  for (let i = 1; i < nums.length; i++) {
    if (nums[i]! <= nums[i - 1]!) {
      return {ok: false, error: 'Class breaks must be strictly increasing.'}
    }
  }
  return {ok: true, breaks: nums}
}

export const DEFAULT_CLASS_BREAKS = [0, 0.3, 0.55, 0.85, 1] as const
