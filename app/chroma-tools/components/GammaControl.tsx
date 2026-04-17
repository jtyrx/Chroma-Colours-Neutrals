'use client'

type GammaControlProps = {
  id: string
  value: number
  onChange: (gamma: number) => void
  disabled?: boolean
}

const PRESETS = [0.5, 1, 1.5, 2] as const

export function GammaControl({id, value, onChange, disabled}: GammaControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-white/80">
          Gamma <span className="font-mono text-white/55">scale.gamma()</span>
        </label>
        <span className="font-mono text-sm text-white/70">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0.25}
        max={3}
        step={0.05}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input w-full disabled:opacity-40"
      />
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((g) => (
          <button
            key={g}
            type="button"
            disabled={disabled}
            onClick={() => onChange(g)}
            className={`rounded-full border px-3 py-1 text-xs font-mono transition ${
              Math.abs(value - g) < 0.01
                ? 'border-white/30 bg-white/15 text-white'
                : 'border-white/12 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}
