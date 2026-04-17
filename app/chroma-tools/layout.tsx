import type {Metadata} from 'next'
import type {ReactNode} from 'react'

export const metadata: Metadata = {
  title: 'Chroma tools',
  description:
    'Interactive chroma.js helpers for OKLCH scales, class breaks, and bezier splines for design-system work.',
}

export default function ChromaToolsLayout({children}: Readonly<{children: ReactNode}>) {
  return children
}
