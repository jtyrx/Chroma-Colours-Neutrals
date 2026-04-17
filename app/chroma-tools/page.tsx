import Link from 'next/link'

import {BezierTool} from '@/app/chroma-tools/components/BezierTool'
import {ScaleClassesTool} from '@/app/chroma-tools/components/ScaleClassesTool'
import {ScaleColorsTool} from '@/app/chroma-tools/components/ScaleColorsTool'

export default function ChromaToolsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden py-6 sm:py-8 lg:py-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_58%)]" />
      <section className="shell space-y-8">
        <header className="space-y-4">
          <p className="eyebrow">Debug / tooling</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Chroma.js OKLCH lab
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
            Self-contained modules for building and inspecting color scales. Each card owns its state;
            gamma is applied per <span className="font-mono text-white/80">scale.gamma()</span> where
            supported. Add more tools by dropping new components into this route.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10"
            >
              ← Home
            </Link>
            <Link
              href="/color-tools"
              className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10"
            >
              Color.js tools
            </Link>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          <ScaleColorsTool />
          <ScaleClassesTool />
          <BezierTool />
        </div>
      </section>
    </main>
  )
}
