import Link from 'next/link'

import {PaletteGenerator} from '@/app/components/PaletteGenerator'
import {OKLCH_MAX_CHROMA} from '@/app/lib/palette'

const starterDetails = [
  {label: 'Framework', value: 'Next.js 16.2.3'},
  {label: 'Styling', value: 'Tailwind CSS v4'},
  {label: 'Origin', value: 'CodePen to App Router'},
]

const generationSteps = [
  {
    title: '1. Sample the OKLCH L range',
    body: 'The script walks from roughly 3% to 100% OKLCH lightness in 1% steps. Each stop becomes a candidate neutral, which is why the scale feels evenly spaced from white down to near-black.',
  },
  {
    title: '2. Run each stop through a curve',
    body: 'It does not keep chroma flat. Instead, it uses a quadratic curve centered at step 50 on the L axis, which reduces color in the middle of the scale and lets the brighter and darker ends hold a bit more tint.',
  },
  {
    title: '3. Build and label the swatch',
    body: 'For every step, the app builds the color in OKLCH (L, C, hue), formats OKLCH and derived HSL for reference, and chooses dark or light text based on contrast so the values stay readable.',
  },
]

const mathTerms = [
  {term: 'l', meaning: 'the current step on a 0-100 scale, mapped to OKLCH L as l / 100'},
  {term: 'p', meaning: 'the Adjustment slider value controlling curve strength'},
  {
    term: 'modifier',
    meaning: `the multiplier applied to the saturation slider before scaling by max chroma (${OKLCH_MAX_CHROMA})`,
  },
]

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden py-6 sm:py-8 lg:py-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_58%)]" />
      <section className="shell">
        <div className="glass-panel overflow-hidden">
          <div className="border-b border-white/10 px-6 py-4 sm:px-8">
            <p className="eyebrow">A starter template for</p>
          </div>
          <div className="hero-grid px-6 py-8 sm:px-8 sm:py-10 lg:py-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                  Chroma Colours Neutrals
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                  The original palette experiment now runs as a standalone Next.js project with a
                  CSS-first Tailwind v4 setup, matching the same App Router direction as your
                  portfolio starter.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="https://codepen.io/jtyrx/pen/PwGxzqe"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Original CodePen
                </Link>
                <Link
                  href="https://github.com/jtyrx/Chroma-Colours-Neutrals"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Source Repository
                </Link>
                <Link
                  href="/chroma-tools"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Chroma tools
                </Link>
                <Link
                  href="/color-tools"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Color.js tools
                </Link>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="space-y-5">
                <div>
                  <p className="eyebrow">Starter details</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Slimmed down from the larger portfolio codebase but kept on the same modern
                    baseline: TypeScript, App Router, strict linting, and Tailwind v4 tokens in
                    `app/globals.css`.
                  </p>
                </div>
                <dl className="grid gap-3">
                  {starterDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                    >
                      <dt className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">
                        {detail.label}
                      </dt>
                      <dd className="text-sm font-medium text-white/85">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <PaletteGenerator />
        </div>

        <div className="mt-8 glass-panel p-4 sm:p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-5">
              <div>
                <p className="eyebrow">How the values are generated</p>
                <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                  A neutral scale shaped by a parabola
                </h2>
              </div>
              <p className="max-w-3xl text-base leading-7 text-white/68 sm:text-lg">
                Yes, the generator uses math. The core idea is a quadratic curve that bends chroma
                across the OKLCH L axis, so the middle of the palette stays calmer while the top and
                bottom retain more hue.
              </p>
              <div className="grid gap-3">
                {generationSteps.map((step) => (
                  <article
                    key={step.title}
                    className="rounded-[22px] border border-white/8 bg-white/4 p-4"
                  >
                    <h3 className="text-sm font-semibold tracking-[-0.02em] text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/62">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[24px] border border-white/10 bg-black/24 p-5 sm:p-6">
              <div>
                <p className="eyebrow">The actual curve</p>
                <div className="mt-3 rounded-[20px] border border-white/8 bg-black/30 p-4 font-mono text-sm leading-7 text-white/88 sm:text-base">
                  <p>modifier = 1 + ((((l - 50)^2 / p) - (50^2 / p)) / 100)</p>
                  <p className="mt-3">
                    L = l / 100; C = saturation × modifier × {OKLCH_MAX_CHROMA}; color = oklch(L, C, hue)
                  </p>
                </div>
              </div>
              <p className="text-sm leading-6 text-white/62">
                The curve is symmetrical around <span className="font-mono text-white/86">50</span>.
                That means the chroma modifier reaches its minimum around the middle greys, then rises
                again toward both ends of the scale.
              </p>
              <dl className="grid gap-3">
                {mathTerms.map((item) => (
                  <div
                    key={item.term}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                  >
                    <dt className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">
                      {item.term}
                    </dt>
                    <dd className="max-w-[22rem] text-right text-sm leading-6 text-white/72">
                      {item.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-sm leading-6 text-white/62">
                Lower <span className="font-mono text-white/86">p</span> values make the bend
                stronger. Higher values flatten the curve and keep the scale closer to a simple,
                even chroma ramp.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
