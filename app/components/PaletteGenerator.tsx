'use client'

import chroma from 'chroma-js'
import type {CSSProperties} from 'react'
import {useState} from 'react'

import {CurvePreview} from '@/app/components/CurvePreview'
import {
  DEFAULT_SETTINGS,
  FEATURED_GREYS,
  OKLCH_MAX_CHROMA,
  generatePalette,
  getSelectedPalette,
  getAdjustmentOutput,
} from '@/app/lib/palette'

const CURATED_DISPLAY_ROW_ONE = [99, 95, 88, 80, 70, 60, 50, 40, 30, 20, 10, 7, 5, 3, 1]

/** Neutral steps on a 0–1000 axis (maps to palette grey = token / 10). */
const CURATED_DISPLAY_ROW_TWO = [
  975, 950, 925, 900, 800, 700, 600, 500, 400, 300, 200, 100, 75, 50, 25,
]

/** Fixed design-system neutrals (--color-neutral-*), not tied to the generator sliders. */
const DESIGN_SYSTEM_NEUTRAL_REFERENCE = [
  {step: 10, css: 'oklch(0.995 0.001 260)', usage: 'Near White'},
  {step: 25, css: 'oklch(0.99 0.002 260)', usage: 'Light Well / Canvas'},
  {step: 50, css: 'oklch(0.98 0.004 260)', usage: 'Light Base'},
  {step: 75, css: 'oklch(0.96 0.006 260)', usage: 'Light Subtle Border'},
  {step: 100, css: 'oklch(0.94 0.01 260)', usage: 'Light Surface Raised'},
  {step: 200, css: 'oklch(0.88 0.01 260)', usage: 'Light Divider'},
  {step: 300, css: 'oklch(0.82 0.01 260)', usage: 'Mid-tone'},
  {step: 400, css: 'oklch(0.70 0.01 260)', usage: 'Secondary Text (Light)'},
  {step: 500, css: 'oklch(0.55 0.01 260)', usage: 'Contrast baseline 3:1'},
  {step: 600, css: 'oklch(0.44 0.01 260)', usage: 'Contrast baseline 4.5:1'},
  {step: 700, css: 'oklch(0.35 0.01 260)', usage: 'Secondary Text (Dark)'},
  {step: 800, css: 'oklch(0.28 0.01 260)', usage: 'Dark Surface Raised'},
  {step: 900, css: 'oklch(0.21 0.01 260)', usage: 'Dark Surface Subtle'},
  {step: 925, css: 'oklch(0.17 0.01 260)', usage: 'Tweener: Subtle Dark Surface'},
  {step: 950, css: 'oklch(0.14 0.01 260)', usage: 'Dark Base Page'},
  {step: 975, css: 'oklch(0.08 0.008 260)', usage: 'Tweener: Deep Dark Well'},
] as const

interface SliderFieldProps {
  label: string
  helper: string
  value: number
  min: number
  max: number
  step: number
  displayValue: string
  track: string
  onChange: (value: number) => void
}

function SliderField({
  label,
  helper,
  value,
  min,
  max,
  step,
  displayValue,
  track,
  onChange,
}: SliderFieldProps) {
  return (
    <label className="space-y-3 rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-white/50">
            {label}
          </p>
          <p className="mt-1 text-sm leading-6 text-white/58">{helper}</p>
        </div>
        <span className="font-mono text-sm text-white/88">{displayValue}</span>
      </div>
      <input
        className="range-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{'--range-track': track} as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

interface SwatchCardProps {
  swatch: (ReturnType<typeof generatePalette>)[number]
}

function SwatchCard({swatch}: SwatchCardProps) {
  return (
    <article
      className="rounded-[22px] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
      style={{backgroundColor: swatch.css, color: swatch.textColor}}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] opacity-70">
          grey-{swatch.grey}
        </p>
      </div>
      <div className="mt-8 space-y-2 font-mono text-xs leading-5">
        <div className="flex items-start justify-between gap-3">
          <span className="opacity-70">hsl</span>
          <span className="max-w-[70%] text-right">{swatch.hsl}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="opacity-70">oklch</span>
          <span className="max-w-[70%] text-right">{swatch.oklch}</span>
        </div>
      </div>
    </article>
  )
}

function FeaturedSwatch({swatch}: SwatchCardProps) {
  return (
    <div
      className="palette-featured-cell"
      title={`grey-${swatch.grey} | ${swatch.oklch}`}
      style={{backgroundColor: swatch.css, color: swatch.textColor}}
    >
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] opacity-72 sm:text-[0.68rem]">
        {swatch.grey}
      </span>
    </div>
  )
}

function DisplayValueRow({
  values,
  swatches,
}: {
  values: number[]
  swatches: Array<(ReturnType<typeof generatePalette>)[number]>
}) {
  return (
    <div className="palette-strip palette-display-row">
      {values.map((value, index) => {
        const swatch = swatches[index]

        return (
          <div
            key={value}
            className="palette-display-cell"
            style={
              swatch
                ? {backgroundColor: swatch.css, color: swatch.textColor}
                : undefined
            }
            title={swatch ? `${value} | ${swatch.oklch}` : `${value}`}
          >
            <span
              className="font-mono text-[0.58rem] tracking-[0.12em] sm:text-[0.68rem]"
              style={{opacity: 0.72}}
            >
              {value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function DesignSystemNeutralRow() {
  return (
    <div className="palette-strip palette-display-row">
      {DESIGN_SYSTEM_NEUTRAL_REFERENCE.map(({step, css, usage}) => {
        const textColor = chroma.contrast('white', css) < 2.9 ? '#171717' : '#ffffff'
        return (
          <div
            key={step}
            className="palette-display-cell"
            style={{backgroundColor: css, color: textColor}}
            title={`neutral-${step} · ${usage} · ${css}`}
          >
            <span
              className="font-mono text-[0.58rem] tracking-[0.12em] sm:text-[0.68rem]"
              style={{opacity: 0.72}}
            >
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function PaletteGenerator() {
  const [hue, setHue] = useState(DEFAULT_SETTINGS.hue)
  const [saturation, setSaturation] = useState(DEFAULT_SETTINGS.saturation)
  const [adjustment, setAdjustment] = useState(DEFAULT_SETTINGS.adjustment)

  const palette = generatePalette({hue, saturation, adjustment})
  const featuredPalette = getSelectedPalette({
    hue,
    saturation,
    adjustment,
    values: FEATURED_GREYS,
  })
  const displayRowOnePalette = getSelectedPalette({
    hue,
    saturation,
    adjustment,
    values: CURATED_DISPLAY_ROW_ONE,
  })
  const displayRowTwoPalette = getSelectedPalette({
    hue,
    saturation,
    adjustment,
    values: CURATED_DISPLAY_ROW_TWO.map((value) => value / 10),
  })

  const hueTrack =
    'linear-gradient(90deg, oklch(72% 0.14 0deg), oklch(72% 0.14 60deg), oklch(72% 0.14 120deg), oklch(72% 0.14 180deg), oklch(72% 0.14 240deg), oklch(72% 0.14 300deg), oklch(72% 0.14 360deg))'
  const saturationTrack = `linear-gradient(90deg, oklch(56% 0 ${Math.round(hue)}), oklch(56% ${OKLCH_MAX_CHROMA} ${Math.round(hue)}))`
  const adjustmentTrack =
    'linear-gradient(90deg, oklch(72% 0.04 230), oklch(76% 0.14 38), oklch(64% 0.23 28))'

  return (
    <div className="space-y-6">
      <section className="glass-panel sticky top-6 z-20 p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <SliderField
            label="Hue"
            helper="Shifts the overall temperature of the neutral family."
            value={hue}
            min={0}
            max={360}
            step={1}
            displayValue={`${Math.round(hue)}deg`}
            track={hueTrack}
            onChange={setHue}
          />
          <SliderField
            label="Saturation"
            helper="Controls how much color leaks into the grey scale."
            value={saturation}
            min={0}
            max={1}
            step={0.01}
            displayValue={`${Math.round(saturation * 100)}%`}
            track={saturationTrack}
            onChange={setSaturation}
          />
          <SliderField
            label="Curve"
            helper="Controls the symmetric parabola applied around step 50 on the OKLCH L axis."
            value={adjustment}
            min={25}
            max={2500}
            step={1}
            displayValue={getAdjustmentOutput(adjustment)}
            track={adjustmentTrack}
            onChange={setAdjustment}
          />
          <div className="lg:col-span-3 xl:col-span-1">
            <CurvePreview adjustment={adjustment} />
          </div>
        </div>
      </section>

      <section className="glass-panel p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Continuous preview</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Full neutral ribbon
            </h2>
          </div>
          <p className="font-mono text-sm text-white/55">{palette.length} swatches generated</p>
        </div>
        <div className="palette-strip palette-mini mt-5">
          {palette.map((swatch) => (
            <div
              key={`mini-${swatch.grey}`}
              title={`grey-${swatch.grey} | ${swatch.oklch}`}
              style={{backgroundColor: swatch.css}}
            />
          ))}
        </div>
      </section>

      <section className="glass-panel p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Key steps</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Curated swatch set
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-white/58">
            These are the same handier stops surfaced by the original experiment for quicker token
            selection.
          </p>
        </div>
        <div className="mt-5 space-y-2.5">
          <div className="palette-strip palette-featured">
            {featuredPalette.map((swatch) => (
              <FeaturedSwatch key={`featured-${swatch.grey}`} swatch={swatch} />
            ))}
          </div>
          <DisplayValueRow values={CURATED_DISPLAY_ROW_ONE} swatches={displayRowOnePalette} />
          <DisplayValueRow values={CURATED_DISPLAY_ROW_TWO} swatches={displayRowTwoPalette} />
          <DesignSystemNeutralRow />
        </div>
      </section>

      <section className="glass-panel p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Full scale</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Detailed palette output
            </h2>
          </div>
          <p className="text-sm leading-6 text-white/58">
            Every generated stop is listed below with both HSL and OKLCH output.
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {palette.map((swatch) => (
            <SwatchCard key={`full-${swatch.grey}`} swatch={swatch} />
          ))}
        </div>
      </section>
    </div>
  )
}
