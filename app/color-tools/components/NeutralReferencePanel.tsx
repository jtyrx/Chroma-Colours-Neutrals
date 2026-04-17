'use client'

/**
 * @theme neutral reference — side-by-side comparison with tool outputs.
 */

type NeutralStop = {
  token: string
  css: string
  /** Short label from theme comments (tooltip only). */
  hint: string
}

type NeutralGroup = {
  title: string
  range: string
  stops: readonly NeutralStop[]
}

const NEUTRAL_GROUPS: readonly NeutralGroup[] = [
  {
    title: 'Light end emphasis',
    range: 'L > 85%',
    stops: [
      {token: '000', css: 'oklch(98.5% 0 none)', hint: 'Pure Base'},
      {token: '025', css: 'oklch(96.5% 0.0001 6.0)', hint: 'Tweener: Light Hover'},
      {token: '050', css: 'oklch(94.644% 0.0002 11.433)', hint: 'Light Sunken'},
      {token: '100', css: 'oklch(90.788% 0.0004 22.866)', hint: 'Light Surface'},
      {token: '150', css: 'oklch(88.5% 0.0005 28.0)', hint: 'Tweener: Subtle Border'},
      {token: '200', css: 'oklch(86.932% 0.0006 34.299)', hint: 'Light Divider'},
      {token: '300', css: 'oklch(79.22% 0.001 57.165)', hint: 'Mid-light'},
    ],
  },
  {
    title: 'Transition middle',
    range: 'L 75% – 35%',
    stops: [
      {token: '400', css: 'oklch(71.508% 0.0014 80.03)', hint: 'Disabled Text'},
      {token: '500', css: 'oklch(56.084% 0.0022 125.76)', hint: 'Baseline 3:1 Contrast'},
      {token: '600', css: 'oklch(40.66% 0.003 171.49)', hint: 'Baseline 4.5:1 Contrast'},
    ],
  },
  {
    title: 'Dark end emphasis',
    range: 'L < 25%',
    stops: [
      {token: '700', css: 'oklch(25.236% 0.0038 217.23)', hint: 'Dark Surface Overlay'},
      {token: '800', css: 'oklch(21.38% 0.004 228.66)', hint: 'Dark Surface Raised'},
      {token: '850', css: 'oklch(19.0% 0.0041 235.0)', hint: 'Tweener: Dark Border'},
      {token: '900', css: 'oklch(17.524% 0.0042 240.09)', hint: 'Dark Surface Subtle'},
      {token: '925', css: 'oklch(13.668% 0.0044 251.52)', hint: 'Tweener: Dark Hover'},
      {token: '950', css: 'oklch(9.812% 0.0046 262.96)', hint: 'Dark Surface Default'},
      {token: '975', css: 'oklch(5.956% 0.0048 274.39)', hint: 'Dark Sunken Well'},
      {token: '1000', css: 'oklch(2.1% 0.005 285.82)', hint: 'Deep Base'},
    ],
  },
] as const

export function NeutralReferencePanel() {
  return (
    <aside
      className="pointer-events-auto fixed bottom-4 left-4 right-4 z-30 max-h-[min(70vh,36rem)] md:left-auto md:right-4 md:top-24 md:bottom-8 md:max-h-[calc(100vh-8rem)] md:w-[min(100vw-2rem,17.5rem)]"
      aria-label="Preferred neutral scale reference"
    >
      <div className="flex max-h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-[oklch(14%_0.02_285_/0.92)] shadow-[0_24px_80px_-32px_oklch(0%_0_0_/0.85)] backdrop-blur-xl">
        <div className="shrink-0 border-b border-white/10 px-3 py-2.5">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/50">Reference</p>
          <p className="mt-0.5 text-sm font-semibold tracking-[-0.02em] text-white">Neutral scale</p>
          <p className="mt-1 text-[0.65rem] leading-snug text-white/45">@theme — OKLCH stops</p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2">
          {NEUTRAL_GROUPS.map((group) => (
            <section key={group.title} className="mb-3 last:mb-0" aria-label={`${group.title} (${group.range})`}>
              <header className="sticky top-0 z-[1] -mx-0.5 mb-1.5 bg-[oklch(14%_0.02_285_/0.97)] px-1.5 py-1 backdrop-blur-sm">
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/42">{group.title}</p>
                <p className="mt-0.5 font-mono text-[0.58rem] text-white/38">{group.range}</p>
              </header>
              <ul className="space-y-0">
                {group.stops.map(({token, css, hint}) => (
                  <li key={`neutral-${token}`} className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-white/5">
                    <span className="w-9 shrink-0 font-mono text-[0.62rem] tabular-nums leading-none text-white/55">
                      {token}
                    </span>
                    <span
                      className="h-7 min-w-0 flex-1 rounded-md border border-white/10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
                      style={{backgroundColor: css}}
                      title={`--color-neutral-${token}: ${css} — ${hint}`}
                    >
                      <span className="sr-only">
                        neutral-{token}, {hint}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </aside>
  )
}
