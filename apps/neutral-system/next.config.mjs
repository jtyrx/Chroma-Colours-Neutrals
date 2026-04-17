import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(__dirname, '../..')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo dev: point Turbopack at repo root. Omit on Vercel so it matches outputFileTracingRoot.
  ...(process.env.VERCEL
    ? {}
    : {
        turbopack: {
          root: repoRoot,
        },
      }),
}

export default nextConfig
