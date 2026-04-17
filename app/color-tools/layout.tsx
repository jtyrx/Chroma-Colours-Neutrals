import type {Metadata} from 'next'
import type {ReactNode} from 'react'

export const metadata: Metadata = {
  title: 'Color.js tools',
  description:
    'OKLCH-first color tooling with colorjs.io: interpolation ranges, discrete steps, and Oklab splines.',
}

export default function ColorToolsLayout({children}: Readonly<{children: ReactNode}>) {
  return children
}
