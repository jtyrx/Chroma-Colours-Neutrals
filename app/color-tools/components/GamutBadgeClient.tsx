'use client'

import type Color from 'colorjs.io'
import {createElement, useEffect, useState} from 'react'

type GamutBadgeClientProps = {
  color: Color
  className?: string
}

let gamutBadgeLoaded = false
let gamutBadgeLoadPromise: Promise<boolean> | null = null

function loadGamutBadge(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (gamutBadgeLoaded) return Promise.resolve(true)
  if (!gamutBadgeLoadPromise) {
    gamutBadgeLoadPromise = import('color-elements/gamut-badge')
      .then(() => {
        gamutBadgeLoaded = true
        return true
      })
      .catch(() => {
        gamutBadgeLoadPromise = null
        return false
      })
  }
  return gamutBadgeLoadPromise
}

/**
 * Wraps Color Elements `<gamut-badge>` (client-only). Loads the custom element once per session.
 */
export function GamutBadgeClient({color, className}: GamutBadgeClientProps) {
  const [ready, setReady] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadGamutBadge().then((ok) => {
      if (cancelled) return
      if (ok) setReady(true)
      else setLoadFailed(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const serialized = color.toString({format: 'css'})

  if (loadFailed) {
    return (
      <span
        className={`inline-block rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[0.6rem] text-amber-100/90 ${className ?? ''}`}
        title="Could not load color-elements (gamut-badge). Check network / dev server."
      >
        gamut?
      </span>
    )
  }

  if (!ready) {
    return (
      <span
        className={`inline-block min-h-[1.25rem] min-w-[2rem] rounded border border-white/10 bg-white/5 text-[0.65rem] leading-none text-white/35 ${className ?? ''}`}
        aria-hidden
      >
        …
      </span>
    )
  }

  return createElement('gamut-badge', {
    className,
    color: serialized,
  })
}
