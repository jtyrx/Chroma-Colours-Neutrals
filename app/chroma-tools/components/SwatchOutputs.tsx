'use client'

import chroma from 'chroma-js'
import type {Color} from 'chroma-js'
import {useState} from 'react'

import {hslCssString, oklchCssString} from '@/app/lib/chromaTools'

type SwatchOutputsProps = {
  colors: Color[]
  /** Show index label on each swatch */
  showIndex?: boolean
  /** Optional footer note under the strip */
  footnote?: string
}

function textOnBackground(bg: Color) {
  return chroma.contrast('white', bg) < 2.9 ? '#171717' : '#ffffff'
}

export function SwatchOutputs({colors, showIndex = true, footnote}: SwatchOutputsProps) {
  const [copied, setCopied] = useState(false)
  const oklchList = colors.map((c) => oklchCssString(c))

  async function copyOklchJson() {
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
            onClick={copyOklchJson}
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
              className="flex flex-col items-center justify-end px-1 pb-3 pt-6"
              style={{backgroundColor: oklchCssString(c), color: textOnBackground(c)}}
              title={oklchCssString(c)}
            >
              {showIndex ? (
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] opacity-80">
                  {i}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/8 bg-black/25">
        <table className="w-full min-w-[32rem] border-collapse text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">oklch</th>
              <th className="px-3 py-2 font-medium">hsl</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((c, i) => (
              <tr key={`row-${i}`} className="border-b border-white/6 text-white/85 last:border-0">
                <td className="px-3 py-2 text-white/55">{i}</td>
                <td className="max-w-[1px] whitespace-normal break-all px-3 py-2">{oklchCssString(c)}</td>
                <td className="max-w-[1px] whitespace-normal break-all px-3 py-2">{hslCssString(c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote ? <p className="text-xs leading-relaxed text-white/45">{footnote}</p> : null}
    </div>
  )
}
