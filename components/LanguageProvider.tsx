'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { DEFAULT_LANG, getLanguage, isFullLang, translate } from '@/lib/i18n'

type Ctx = {
  lang: string
  setLang: (code: string) => void
  t: (key: string, vars?: Record<string, string | number>) => string
  isRTL: boolean
  isFull: boolean
}

const LanguageContext = createContext<Ctx | null>(null)

const STORAGE_KEY = 'docbel.lang'

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<string>(DEFAULT_LANG)

  // Load persisted language on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && getLanguage(saved)) setLangState(saved)
    } catch {}
  }, [])

  // Apply lang + dir to <html>
  useEffect(() => {
    const l = getLanguage(lang)
    if (!l) return
    document.documentElement.setAttribute('lang', l.code)
    document.documentElement.setAttribute('dir', l.rtl ? 'rtl' : 'ltr')
  }, [lang])

  const setLang = useCallback((code: string) => {
    if (!getLanguage(code)) return
    setLangState(code)
    try { localStorage.setItem(STORAGE_KEY, code) } catch {}
  }, [])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang]
  )
  const isRTL = !!getLanguage(lang)?.rtl
  const isFull = isFullLang(lang)

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL, isFull }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
