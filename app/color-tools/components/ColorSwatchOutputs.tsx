'use client'

import type Color from 'colorjs.io'
import {useState} from 'react'

import {GamutBadgeClient} from '@/app/color-tools/components/GamutBadgeClient'
import {colorToOklchCss, colorToSrgbCss, labelTextOnColor} from '@/app/lib/colorJsTools'

type ColorSwatchOutputsProps = {
  colors: Color[]
  footnote?: string
}

export function ColorSwatchOutputs({colors, footnote}: ColorSwatchOutputsProps) {
  const [copied, setCopied] = useState(false)
  const oklchList = colors.map((c) => colorToOklchCss(c))

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
              key={i}
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
        <table className="w-full min-w-[40rem] border-collapse text-left font-mono text-[0.7rem] sm:text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-2 py-2 font-medium sm:px-3">#</th>
              <th className="px-2 py-2 font-medium sm:px-3">gamut</th>
              <th className="px-2 py-2 font-medium sm:px-3">oklch</th>
              <th className="px-2 py-2 font-medium sm:px-3">css (srgb)</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((c, i) => (
              <tr key={`row-${i}`} className="border-b border-white/6 text-white/85 last:border-0">
                <td className="px-2 py-2 align-middle text-white/55 sm:px-3">{i}</td>
                <td className="px-2 py-2 align-middle sm:px-3">
                  <GamutBadgeClient color={c} className="align-middle" />
                </td>
                <td className="max-w-[1px] whitespace-normal break-all px-2 py-2 sm:px-3">
                  {colorToOklchCss(c)}
                </td>
                <td className="max-w-[1px] whitespace-normal break-all px-2 py-2 sm:px-3">
                  {colorToSrgbCss(c)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote ? <p className="text-xs leading-relaxed text-white/45">{footnote}</p> : null}
    </div>
  )
}
