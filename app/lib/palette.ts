import chroma from 'chroma-js'

/**
 * Swatches are built with `chroma.oklch()`. Chroma.js ≥3 uses the **W3C CSS Color 4**
 * Oklab/OKLCH pipeline: OKLCH → Oklab → **CIE XYZ (D65)** → linear sRGB (see chroma `oklab2rgb`,
 * matrices from https://www.w3.org/TR/css-color-4/#color-conversion-code).
 * CSS strings come from `color.css('oklch' | 'hsl')` so serialization matches browser `oklch()` / `hsl()`.
 */

export interface PaletteSettings {
  hue: number
  saturation: number
  adjustment: number
  min?: number
  max?: number
  distance?: number
}

export interface PaletteSwatch {
  grey: number
  css: string
  hsl: string
  oklch: string
  textColor: string
}

export interface CurvePoint {
  /** 0–100 scale position; maps to OKLCH L as `lightness / 100` when building swatches. */
  lightness: number
  modifier: number
  x: number
  y: number
}

/**
 * Upper bound for OKLCH chroma (C) when the saturation slider is at 100% and the curve modifier is 1.
 * The effective chroma is `saturation * modifier * OKLCH_MAX_CHROMA`.
 */
export const OKLCH_MAX_CHROMA = 0.2

export const DEFAULT_SETTINGS = {
  hue: 200,
  saturation: 0.2,
  adjustment: 70,
}

export const FEATURED_GREYS = [
  100, 99, 97, 95, 92, 90, 85, 80, 75, 70, 65, 60, 50, 45, 40, 35, 30, 25, 20, 15, 10, 7, 5, 0,
]

/** Inner arguments of `oklch(...)` / `hsl(...)` from chroma’s W3C-style serializers. */
function cssColorFunctionArguments(color: chroma.Color, mode: 'oklch' | 'hsl') {
  const serialized = color.css(mode)
  const open = serialized.indexOf('(')
  return serialized.slice(open + 1, -1)
}

function clampCurveModifier(value: number) {
  return Math.max(0, Math.min(value, 1))
}

/** Curve multiplier for OKLCH chroma (same formula as the original HSL saturation bend). */
export function getSaturationModifier(lightnessIndex: number, adjustment: number) {
  const origin = 50
  return (
    1 +
    ((Math.pow(lightnessIndex - origin, 2) / adjustment - Math.pow(origin, 2) / adjustment) /
      100)
  )
}

export function getCurvePoints(adjustment: number, samples = 101): CurvePoint[] {
  const safeSamples = Math.max(2, samples)

  return Array.from({length: safeSamples}, (_, index) => {
    const lightness = (index / (safeSamples - 1)) * 100
    const modifier = clampCurveModifier(getSaturationModifier(lightness, adjustment))

    return {
      lightness,
      modifier,
      x: lightness / 100,
      y: modifier,
    }
  })
}

export function getCurveCenterModifier(adjustment: number) {
  return clampCurveModifier(getSaturationModifier(50, adjustment))
}

function createSwatch({
  grey,
  hue,
  saturation,
  adjustment,
}: {
  grey: number
  hue: number
  saturation: number
  adjustment: number
}): PaletteSwatch {
  const L = Math.max(0, Math.min(grey / 100, 1))
  const modifier = getSaturationModifier(grey, adjustment)
  const chromaAmount = saturation * modifier * OKLCH_MAX_CHROMA
  const color = chroma.oklch(L, chromaAmount, hue)
  const css = color.css('oklch')

  return {
    grey,
    css,
    hsl: cssColorFunctionArguments(color, 'hsl'),
    oklch: cssColorFunctionArguments(color, 'oklch'),
    textColor: chroma.contrast('white', color) < 2.9 ? '#171717' : '#ffffff',
  }
}

export function getAdjustmentOutput(adjustment: number) {
  return `p = ${Math.round(adjustment)}`
}

export function generatePalette({
  hue = DEFAULT_SETTINGS.hue,
  saturation = DEFAULT_SETTINGS.saturation,
  adjustment = DEFAULT_SETTINGS.adjustment,
  min = 0.03,
  max = 1.01,
  distance = 0.01,
}: PaletteSettings): PaletteSwatch[] {
  const swatches: PaletteSwatch[] = []
  let value = min
  let step = 0

  while (value < max) {
    const lightnessIndex = Math.round(value * 100)
    swatches.push(
      createSwatch({
        grey: lightnessIndex,
        hue,
        saturation,
        adjustment,
      })
    )

    step += 1
    value = step * distance + min
  }

  return swatches.reverse().map((swatch, index) => ({
    ...swatch,
    grey: 100 - index,
  }))
}

export function getSelectedPalette({
  hue = DEFAULT_SETTINGS.hue,
  saturation = DEFAULT_SETTINGS.saturation,
  adjustment = DEFAULT_SETTINGS.adjustment,
  values = FEATURED_GREYS,
}: PaletteSettings & {values?: number[]}): PaletteSwatch[] {
  return values.map((grey) =>
    createSwatch({
      grey,
      hue,
      saturation,
      adjustment,
    })
  )
}
