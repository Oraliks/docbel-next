'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

/* ─── FAQ Item component ─────────────────────────────────────────────── */
function FAQItemComp({ id, q, a, isOpen, onToggle }: { id: string; q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  const panelId = `faq-panel-${id}`
  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button
        className="faq-q"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {q}
        <div className="faq-arrow" aria-hidden>▼</div>
      </button>
      <div
        id={panelId}
        className={`faq-a${isOpen ? ' open' : ''}`}
        role="region"
        aria-labelledby={undefined}
      >
        <div className="faq-a-inner">
          <div dangerouslySetInnerHTML={{ __html: a }} />
        </div>
      </div>
    </div>
  )
}

/* ─── Page component ─────────────────────────────────────────────────── */
export default function FAQPage() {
  const { lang, t, isFull } = useLang()
  const [query, setQuery]       = useState('')
  const [activecat, setActivecat] = useState('all')
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch FAQ data from API
  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const res = await fetch('/api/faq')
        if (!res.ok) throw new Error(`Failed to load FAQ: ${res.status}`)
        const result = await res.json()
        if (result.success && result.data) {
          // Transform API data to match component structure
          const transformed = result.data.map((category: any) => ({
            id: category.id,
            label: category[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || category.nameFr,
            icon: '📋',
            items: category.items.map((item: any) => ({
              id: item.id,
              q: item[`question${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || item.questionFr,
              a: item[`answer${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || item.answerFr,
            })),
          }))
          setGroups(transformed)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load FAQ')
      } finally {
        setLoading(false)
      }
    }
    fetchFaqData()
  }, [lang])

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const filteredGroups = useMemo(() => {
    return groups.map(g => ({
      ...g,
      items: g.items.filter((item: any) => {
        const matchCat = activecat === 'all' || g.id === activecat
        const matchQ   = !query || item.q.toLowerCase().includes(query.toLowerCase())
        return matchCat && matchQ
      }),
    })).filter(g => g.items.length > 0)
  }, [query, activecat, groups])

  const totalCount = groups.reduce((a, g) => a + g.items.length, 0)

  if (error) {
    return (
      <>
        <section className="faq-hero">
          <div className="container">
            <div className="eyebrow">{t('faq.eyebrow')}</div>
            <h1>{t('faq.title')}</h1>
          </div>
        </section>
        <div className="container">
          <div className="no-results">
            <div className="no-results-icon">⚠️</div>
            <p>Erreur lors du chargement des FAQ: {error}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="faq-hero">
        <div className="container">
          <div className="eyebrow">{t('faq.eyebrow')}</div>
          <h1>{t('faq.title')}</h1>
          <p>{t('faq.sub')}</p>
          {!isFull && (
            <p style={{ marginTop: '10px', fontSize: '.82rem', opacity: .7 }}>
              🤖 {t('lang.ai.notice')}
            </p>
          )}
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder={t('faq.search')}
              value={query}
              onChange={e => { setQuery(e.target.value); setActivecat('all') }}
              autoComplete="off"
              disabled={loading}
            />
          </div>
        </div>
      </section>

      {/* Layout */}
      <div className="container">
        <div className="faq-layout">

          {/* Sidebar */}
          <aside className="faq-sidebar">
            <div className="sidebar-title">{t('faq.sidebar.title')}</div>
            <div className="cat-list">
              <button
                className={`cat-btn${activecat === 'all' ? ' active' : ''}`}
                onClick={() => { setActivecat('all'); setQuery('') }}
                disabled={loading}
              >
                {t('faq.cat.all')}
                <span className="cat-count">{loading ? '...' : totalCount}</span>
              </button>
              {groups.map(g => (
                <button
                  key={g.id}
                  className={`cat-btn${activecat === g.id ? ' active' : ''}`}
                  onClick={() => { setActivecat(g.id); setQuery('') }}
                  disabled={loading}
                >
                  {g.icon} {g.label}
                  <span className="cat-count">{g.items.length}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="faq-content">
            {loading ? (
              <div className="no-results">
                <div className="no-results-icon">⏳</div>
                <p>Chargement des FAQ...</p>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>{t('faq.empty')}<br />{t('faq.empty.sub')}</p>
              </div>
            ) : (
              filteredGroups.map(g => (
                <div key={g.id} className="faq-group">
                  <div className="faq-group-title">{g.icon} {g.label}</div>
                  <div className="faq-list">
                    {g.items.map((item: any) => (
                      <FAQItemComp
                        key={item.id}
                        id={item.id}
                        q={item.q}
                        a={item.a}
                        isOpen={openItem === item.id}
                        onToggle={() => setOpenItem(prev => prev === item.id ? null : item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* CTA */}
            <div className="help-cta reveal">
              <div className="help-cta-text">
                <h3>{t('faq.help.title')}</h3>
                <p>{t('faq.help.sub')}</p>
              </div>
              <div className="help-cta-btns">
                <Link href="/simulation" className="btn btn-white">{t('faq.help.cta1')}</Link>
                <a href="#" className="btn" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>
                  {t('faq.help.cta2')}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
