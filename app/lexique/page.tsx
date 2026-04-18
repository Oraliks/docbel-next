'use client'

import { useState, useMemo, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

type GlossaryCategory = 'institution' | 'form' | 'concept' | 'union'

const CATS: { key: GlossaryCategory | 'all'; label: string }[] = [
  { key: 'all',         label: 'lex.cat.all'         },
  { key: 'institution', label: 'lex.cat.institution'  },
  { key: 'form',        label: 'lex.cat.form'         },
  { key: 'concept',     label: 'lex.cat.concept'      },
  { key: 'union',       label: 'lex.cat.union'        },
]

const CAT_ICON: Record<GlossaryCategory, string> = {
  institution: '🏛️',
  form:        '📋',
  concept:     '💡',
  union:       '🤝',
}

export default function LexiquePage() {
  const { t, lang, isFull } = useLang()
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState<GlossaryCategory | 'all'>('all')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch glossary from API
  useEffect(() => {
    const fetchGlossary = async () => {
      try {
        const res = await fetch('/api/glossary')
        if (!res.ok) throw new Error(`Failed to load glossary: ${res.status}`)
        const result = await res.json()
        if (result.success && result.data) {
          const transformed = result.data.map((entry: any) => ({
            id: entry.id,
            term: entry.term,
            category: entry.category as GlossaryCategory,
            short: entry[`short${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || entry.shortFr,
            long: entry[`long${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || entry.longFr,
          }))
          setEntries(transformed)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load glossary')
      } finally {
        setLoading(false)
      }
    }
    fetchGlossary()
  }, [lang])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return entries.filter(e => {
      if (cat !== 'all' && e.category !== cat) return false
      if (q && !e.term.toLowerCase().includes(q) && !e.short.toLowerCase().includes(q)) return false
      return true
    })
  }, [entries, cat, search])

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  if (error) {
    return (
      <main className="page-main">
        <section className="hero-section">
          <div className="container">
            <p className="section-eyebrow">{t('lex.eyebrow')}</p>
            <h1 className="hero-title">{t('lex.title')}</h1>
          </div>
        </section>
        <div className="container lex-container">
          <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>⚠️ Erreur lors du chargement du lexique: {error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page-main">
      <section className="hero-section">
        <div className="container">
          <p className="section-eyebrow">{t('lex.eyebrow')}</p>
          <h1 className="hero-title">{t('lex.title')}</h1>
          <p className="hero-sub">{t('lex.sub')}</p>
        </div>
      </section>

      {!isFull && (
        <div className="container">
          <div className="info-banner">🤖 {t('lang.ai.notice')}</div>
        </div>
      )}

      <section className="container lex-container">
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>⏳ Chargement du lexique...</p>
        ) : (
        <>
        <div className="lex-controls">
          <input
            className="lex-search"
            type="search"
            placeholder={t('lex.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label={t('lex.search')}
            disabled={loading}
          />
          <div className="lex-cats" role="group" aria-label="Catégories">
            {CATS.map(c => (
              <button
                key={c.key}
                className={`lex-cat-btn${cat === c.key ? ' active' : ''}`}
                onClick={() => setCat(c.key)}
                disabled={loading}
              >
                {c.key !== 'all' && <span aria-hidden>{CAT_ICON[c.key as GlossaryCategory]} </span>}
                {t(c.label)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="lex-empty">{t('lex.empty')}</p>
        ) : (
          <ul className="lex-list" role="list">
            {filtered.map((entry: any) => {
              const open = expanded.has(entry.id)
              const panelId = `lex-panel-${entry.id}`
              return (
                <li key={entry.id} className={`lex-card${open ? ' open' : ''}`}>
                  <div className="lex-card-head">
                    <span className="lex-cat-icon" aria-hidden>{CAT_ICON[entry.category as GlossaryCategory]}</span>
                    <div className="lex-card-meta">
                      <strong className="lex-term">{entry.term}</strong>
                      <span className="lex-short">{entry.short}</span>
                    </div>
                    <button
                      className="lex-toggle"
                      onClick={() => toggle(entry.id)}
                      aria-expanded={open}
                      aria-controls={panelId}
                    >
                      {open ? t('lex.less') : t('lex.more')}
                      <span aria-hidden>{open ? ' −' : ' +'}</span>
                    </button>
                  </div>
                  <div
                    id={panelId}
                    className="lex-card-body"
                    hidden={!open}
                  >
                    <p>{entry.long}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        </>
        )}
      </section>
    </main>
  )
}
