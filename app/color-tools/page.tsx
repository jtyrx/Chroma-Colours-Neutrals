import Link from 'next/link'

import {DiscreteStepsModule} from '@/app/color-tools/components/DiscreteStepsModule'
import {InterpolationRangeModule} from '@/app/color-tools/components/InterpolationRangeModule'
import {NeutralRampModule} from '@/app/color-tools/components/NeutralRampModule'
import {NeutralReferencePanel} from '@/app/color-tools/components/NeutralReferencePanel'
import {OklabBezierModule} from '@/app/color-tools/components/OklabBezierModule'

export default function ColorToolsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden py-6 pb-40 sm:py-8 sm:pb-40 md:pb-8 lg:py-10 lg:pb-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_58%)]" />
      <NeutralReferencePanel />
      <section className="shell space-y-8 md:pr-[19rem]">
        <header className="space-y-4">
          <p className="eyebrow">Debug / tooling</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Color.js lab
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
            Modular tools using{' '}
            <a
              href="https://colorjs.io/"
              target="_blank"
              rel="noreferrer"
              className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-white/50"
            >
              colorjs.io
            </a>{' '}
            (<span className="font-mono">colorjs.io</span> on npm). OKLCH-first inputs with native
            sRGB swatches; <span className="font-mono">color-elements</span>{' '}
            <span className="font-mono">&lt;gamut-badge&gt;</span> loads client-side only.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10"
            >
              ← Home
            </Link>
            <Link
              href="/chroma-tools"
              className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10"
            >
              Chroma tools
            </Link>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          <NeutralRampModule />
          <InterpolationRangeModule />
          <DiscreteStepsModule />
          <OklabBezierModule />
        </div>
      </section>
    </main>
  )
}
