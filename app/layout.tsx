import './globals.css'

import type {Metadata} from 'next'
import {IBM_Plex_Mono, Inter} from 'next/font/google'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Chroma Colours Neutrals',
    template: '%s | Chroma Colours Neutrals',
  },
  description:
    'Interactive neutral palette generator rebuilt as a Next.js App Router starter with Tailwind CSS v4.',
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
