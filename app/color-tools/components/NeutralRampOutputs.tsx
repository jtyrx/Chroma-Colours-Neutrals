'use client'

import type Color from 'colorjs.io'
import {useMemo, useState} from 'react'

import {GamutBadgeClient} from '@/app/color-tools/components/GamutBadgeClient'
import {
  colorToOklchCss,
  colorToSrgbCss,
  deltaEOKToNext,
  getOklchTuple,
  labelTextOnColor,
  oklchLToPercent,
} from '@/app/lib/colorJsTools'

type NeutralRampOutputsProps = {
  colors: Color[]
  footnote?: string
}

function fmtHue(h: number | null): string {
  if (h === null || Number.isNaN(h)) return 'none'
  return `${h.toFixed(1)}°`
}

export function NeutralRampOutputs({colors, footnote}: NeutralRampOutputsProps) {
  const [copied, setCopied] = useState(false)
  const oklchList = colors.map((c) => colorToOklchCss(c))
  const deltas = useMemo(() => deltaEOKToNext(colors), [colors])

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(oklchList, null, 2))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-4">
      {colors.length > 0 ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={copyJson}
            className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 font-mono text-xs text-white/85 transition hover:bg-white/12"
          >
            {copied ? 'Copied' : 'Copy OKLCH (JSON)'}
          </button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div
          className="grid min-h-[5.5rem] w-full"
          style={{gridTemplateColumns: `repeat(${Math.max(1, colors.length)}, minmax(0, 1fr))`}}
        >
          {colors.map((c, i) => (
            <div
              key={`strip-${i}`}
              className="flex flex-col items-center justify-end px-0.5 pb-2 pt-6"
              style={{backgroundColor: colorToSrgbCss(c), color: labelTextOnColor(c)}}
              title={colorToOklchCss(c)}
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] opacity-80">
                {i}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/8 bg-black/25">
        <table className="w-full min-w-[52rem] border-collapse text-left font-mono text-[0.65rem] sm:text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-2 py-2 font-medium sm:px-3">#</th>
              <th className="px-2 py-2 font-medium sm:px-3">gamut</th>
              <th className="px-2 py-2 font-medium sm:px-3">L</th>
              <th className="px-2 py-2 font-medium sm:px-3">C</th>
              <th className="px-2 py-2 font-medium sm:px-3">h</th>
              <th className="px-2 py-2 font-medium sm:px-3">ΔE_OK →</th>
              <th className="px-2 py-2 font-medium sm:px-3">oklch</th>
              <th className="px-2 py-2 font-medium sm:px-3">css (srgb)</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((c, i) => {
              const {L, C, h} = getOklchTuple(c)
              const dNext = deltas[i]
              return (
                <tr key={`row-${i}`} className="border-b border-white/6 text-white/85 last:border-0">
                  <td className="px-2 py-2 align-middle text-white/55 sm:px-3">{i}</td>
                  <td className="px-2 py-2 align-middle sm:px-3">
                    <GamutBadgeClient color={c} className="align-middle" />
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 sm:px-3">{oklchLToPercent(L).toFixed(2)}%</td>
                  <td className="whitespace-nowrap px-2 py-2 sm:px-3">{C.toFixed(5)}</td>
                  <td className="whitespace-nowrap px-2 py-2 sm:px-3">{fmtHue(h)}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-white/70 sm:px-3">
                    {dNext === null ? '—' : dNext.toFixed(4)}
                  </td>
                  <td className="max-w-[1px] whitespace-normal break-all px-2 py-2 sm:px-3">
                    {colorToOklchCss(c)}
                  </td>
                  <td className="max-w-[1px] whitespace-normal break-all px-2 py-2 sm:px-3">
                    {colorToSrgbCss(c)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {footnote ? <p className="text-xs leading-relaxed text-white/45">{footnote}</p> : null}
    </div>
  )
}
