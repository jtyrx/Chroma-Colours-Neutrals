'use client'

import type {ReactNode} from 'react'

type ToolCardProps = {
  title: string
  apiRef: string
  children: ReactNode
}

export function ToolCard({title, apiRef, children}: ToolCardProps) {
  return (
    <article className="glass-panel overflow-hidden rounded-[24px] p-5 sm:p-6">
      <header className="border-b border-white/8 pb-4">
        <p className="eyebrow">color.js</p>
        <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">{title}</h2>
        <p className="mt-2 font-mono text-sm text-white/55">{apiRef}</p>
      </header>
      <div className="mt-6 space-y-6">{children}</div>
    </article>
  )
}
