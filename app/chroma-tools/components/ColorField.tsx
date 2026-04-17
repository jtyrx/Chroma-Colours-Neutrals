'use client'

import type {Color} from 'chroma-js'
import {useId} from 'react'

import {colorToHexForPicker} from '@/app/lib/chromaTools'

type ColorFieldProps = {
  label: string
  valueText: string
  color: Color | null
  onTextChange: (text: string) => void
  onColorPicked: (hex: string) => void
  hint?: string
}

export function ColorField({label, valueText, color, onTextChange, onColorPicked, hint}: ColorFieldProps) {
  const id = useId()
  const pickerId = `${id}-picker`
  const valid = color !== null
  const hex = color ? colorToHexForPicker(color) : '#000000'

  return (
    <div className="space-y-2">
      <label htmlFor={pickerId} className="text-sm font-medium text-white/80">
        {label}
      </label>
      <div className="flex flex-wrap items-stretch gap-2">
        <input
          id={pickerId}
          type="color"
          value={hex}
          onChange={(e) => onColorPicked(e.target.value)}
          className="h-11 w-14 cursor-pointer rounded-xl border border-white/12 bg-black/30 p-1"
          aria-label={`${label} color picker`}
        />
        <input
          type="text"
          value={valueText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="#hex or oklch(...)"
          spellCheck={false}
          className={`min-w-[12rem] flex-1 rounded-xl border bg-black/25 px-3 py-2 font-mono text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20 ${
            valid ? 'border-white/12' : 'border-amber-500/50'
          }`}
        />
      </div>
      {hint ? <p className="text-xs text-white/45">{hint}</p> : null}
    </div>
  )
}
