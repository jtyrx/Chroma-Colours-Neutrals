'use client'

type ProgressionControlProps = {
  id: string
  /** Exponent applied as `p => p ** gamma` on the interpolation parameter (maps to Color.range `progression`). */
  gamma: number
  onChange: (gamma: number) => void
}

const PRESETS = [0.5, 1, 1.5, 2] as const

export function ProgressionControl({id, gamma, onChange}: ProgressionControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-white/80">
          Progression exponent <span className="font-mono text-white/55">p ↦ p^γ</span>
        </label>
        <span className="font-mono text-sm text-white/70">{gamma}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0.25}
        max={3}
        step={0.05}
        value={gamma}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input w-full"
      />
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            className={`rounded-full border px-3 py-1 text-xs font-mono transition ${
              Math.abs(gamma - g) < 0.01
                ? 'border-white/30 bg-white/15 text-white'
                : 'border-white/12 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/45">
        γ = 1 is linear in <span className="font-mono">t</span>. Maps to{' '}
        <span className="font-mono">range(…, {'{ progression: (p) => p ** γ }'})</span>.
      </p>
    </div>
  )
}
