import { useEffect, useState } from 'react'

const STORAGE_KEY = 'dashboard-variant'
const DEFAULT_VARIANT = 'v2-cinematic'

function readUrlVariant(): string | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash
  const queryStart = hash.indexOf('?')
  if (queryStart === -1) return null
  const params = new URLSearchParams(hash.slice(queryStart + 1))
  return params.get('v')
}

function readStoredVariant(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStoredVariant(value: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // ignore
  }
}

export function useVariantState(validIds: string[]): [string, (id: string) => void] {
  const [activeVariant, setActiveVariant] = useState<string>(() => {
    const fromUrl = readUrlVariant()
    if (fromUrl && validIds.includes(fromUrl)) return fromUrl
    const stored = readStoredVariant()
    if (stored && validIds.includes(stored)) return stored
    return DEFAULT_VARIANT
  })

  useEffect(() => {
    const onHashChange = () => {
      const fromUrl = readUrlVariant()
      if (fromUrl && validIds.includes(fromUrl) && fromUrl !== activeVariant) {
        setActiveVariant(fromUrl)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [activeVariant, validIds])

  const update = (id: string) => {
    if (!validIds.includes(id)) return
    setActiveVariant(id)
    writeStoredVariant(id)
  }

  return [activeVariant, update]
}
