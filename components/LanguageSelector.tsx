'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { LANGUAGES, FULL_TRANSLATIONS } from '@/lib/i18n'
import { useLang } from './LanguageProvider'

type Variant = 'navbar' | 'footer'

export default function LanguageSelector({ variant = 'navbar' }: { variant?: Variant }) {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref  = useRef<HTMLDivElement>(null)
  const inRef = useRef<HTMLInputElement>(null)

  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0]

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Autofocus search
  useEffect(() => { if (open) setTimeout(() => inRef.current?.focus(), 40) }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return LANGUAGES
    return LANGUAGES.filter(l =>
      l.code.toLowerCase().includes(q) ||
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div ref={ref} className={`lang-select lang-${variant}`}>
      <button
        className="lang-trigger"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('lang.select')}: ${current.nativeName}`}
        title={current.nativeName}
      >
        <span className="lang-flag">{current.flag}</span>
        {variant === 'footer' && <span className="lang-code">{current.code.toUpperCase()}</span>}
        <span className="lang-caret" aria-hidden>▾</span>
      </button>

      {open && (
        <div className={`lang-panel lang-panel-${variant}`} role="listbox">
          <div className="lang-search-wrap">
            <input
              ref={inRef}
              type="text"
              className="lang-search"
              placeholder={t('lang.search')}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <div className="lang-list">
            {filtered.length === 0 ? (
              <div className="lang-empty">{t('lang.none')}</div>
            ) : filtered.map(l => {
              const isFull = (FULL_TRANSLATIONS as readonly string[]).includes(l.code)
              const active = l.code === lang
              return (
                <button
                  key={l.code}
                  className={`lang-item${active ? ' active' : ''}`}
                  onClick={() => { setLang(l.code); setOpen(false); setQuery('') }}
                  role="option"
                  aria-selected={active}
                >
                  <span className="lang-item-flag">{l.flag}</span>
                  <span className="lang-item-text">
                    <span className="lang-item-native">{l.nativeName}</span>
                    <span className="lang-item-name">{l.name}</span>
                  </span>
                  {!isFull && <span className="lang-item-ai" title={t('lang.ai.notice')}>IA</span>}
                  {active && <span className="lang-item-check" aria-hidden>✓</span>}
                </button>
              )
            })}
          </div>

          <div className="lang-footer-note">💡 {t('lang.ai.notice')}</div>
        </div>
      )}
    </div>
  )
}
