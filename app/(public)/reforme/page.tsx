'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

const TAG_CLASS: Record<string, string> = {
  modified: 'ctag-modified',
  stricter: 'ctag-stricter',
  new:      'ctag-new',
}
const CHIP_CLASS: Record<string, string> = {
  done:      'chip-done',
  published: 'chip-done',
  active:    'chip-active',
  soon:      'chip-soon',
  planned:   'chip-soon',
}
const TL_DOT: Record<string, string> = { done: '✓', active: '●', upcoming: '○' }

export default function ReformePage() {
  const { lang, t, isFull } = useLang()
  const [activeProfile, setActiveProfile] = useState('')
  const [changes, setChanges] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [timeline, setTimeline] = useState<any[]>([])
  const [faqItems, setFaqItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch reform data from API
  useEffect(() => {
    const fetchReformData = async () => {
      try {
        const [changesRes, profilesRes, timelineRes, faqRes] = await Promise.all([
          fetch('/api/reforms?type=changes'),
          fetch('/api/reforms?type=profiles'),
          fetch('/api/reforms?type=timeline'),
          fetch('/api/faq'),
        ])

        if (!changesRes.ok || !profilesRes.ok || !timelineRes.ok || !faqRes.ok) {
          throw new Error('Failed to load reform data')
        }

        const changesData = await changesRes.json()
        const profilesData = await profilesRes.json()
        const timelineData = await timelineRes.json()
        const faqData = await faqRes.json()

        // Transform changes
        if (changesData.success && changesData.data) {
          const transformed = changesData.data.map((c: any) => ({
            icon: '⚡',
            tag: c.impactTag || 'modified',
            title: c[`before${lang.charAt(0).toUpperCase()}${lang.slice(1)}`]?.split(':')[0] || 'Changement',
            desc: 'Description du changement',
            beforeLabel: c[`before${lang.charAt(0).toUpperCase()}${lang.slice(1)}`]?.split(':')[0] || 'Avant',
            beforeVal: c[`before${lang.charAt(0).toUpperCase()}${lang.slice(1)}`]?.split(':')[1] || '',
            afterLabel: c[`after${lang.charAt(0).toUpperCase()}${lang.slice(1)}`]?.split(':')[0] || 'Après',
            afterVal: c[`after${lang.charAt(0).toUpperCase()}${lang.slice(1)}`]?.split(':')[1] || '',
          }))
          setChanges(transformed)
        }

        // Transform profiles
        if (profilesData.success && profilesData.data) {
          const transformed = profilesData.data.map((p: any) => ({
            id: p.id,
            label: p[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || p.nameFr,
            title: p[`desc${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || p.descFr,
            rows: JSON.parse(p[`impact${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || '[]'),
          }))
          setProfiles(transformed)
          if (transformed.length > 0) setActiveProfile(transformed[0].id)
        }

        // Transform timeline
        if (timelineData.success && timelineData.data) {
          const transformed = timelineData.data.map((item: any) => ({
            date: new Date(item.eventDate).toLocaleDateString('fr-BE', { month: 'long', year: 'numeric' }),
            title: `Étape ${item.orderBy + 1}`,
            desc: item[`desc${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || item.descFr,
            status: item.orderBy === 0 ? 'active' : 'upcoming',
            chip: item.orderBy === 0 ? 'active' : 'planned',
          }))
          setTimeline(transformed)
        }

        // Get mini FAQ items (first 3 from each category)
        if (faqData.success && faqData.data) {
          const allItems: any[] = []
          faqData.data.forEach((category: any) => {
            category.items?.slice(0, 2).forEach((item: any) => {
              allItems.push({
                q: item[`question${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || item.questionFr,
                p: item[`answer${lang.charAt(0).toUpperCase()}${lang.slice(1)}`]?.substring(0, 100) || 'Voir la réponse',
              })
            })
          })
          setFaqItems(allItems.slice(0, 3))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reform data')
      } finally {
        setLoading(false)
      }
    }
    fetchReformData()
  }, [lang])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  if (error) {
    return (
      <section className="reform-hero">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'white', fontSize: '1rem' }}>⚠️ Erreur lors du chargement de la réforme: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="reform-hero">
        <div className="container">
          <div className="reform-hero-inner">
            <div>
              <div className="reform-eyebrow">{t('ref.eyebrow')}</div>
              <h1>{t('ref.title1')}<br /><span style={{ opacity: .85 }}>{t('ref.title2')}</span></h1>
              <p>{t('ref.sub')}</p>
              {!isFull && (
                <p style={{ marginTop: '10px', fontSize: '.82rem', opacity: .7 }}>
                  🤖 {t('lang.ai.notice')}
                </p>
              )}
              <div className="reform-hero-ctas">
                <Link href="/simulation" className="btn btn-white btn-lg">{t('ref.cta1')}</Link>
                <a href="#changes" className="btn btn-lg" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>
                  {t('ref.cta2')}
                </a>
              </div>
            </div>
            <div className="reform-meta">
              {[
                { icon: '📅', label: t('ref.meta1.label'), val: t('ref.meta1.val') },
                { icon: '📜', label: t('ref.meta2.label'), val: t('ref.meta2.val') },
                { icon: '👥', label: t('ref.meta3.label'), val: t('ref.meta3.val') },
              ].map(m => (
                <div key={m.label} className="meta-chip">
                  <span className="micon">{m.icon}</span>
                  <div><div className="mtext">{m.label}</div><div className="mval">{m.val}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY CHANGES ─────────────────────────────────────────────────── */}
      <section className="key-changes" id="changes">
        <div className="container">
          <div className="section-header reveal">
            <div className="eyebrow">{t('ref.changes.eyebrow')}</div>
            <h2>{t('ref.changes.title')}</h2>
            <p>{t('ref.changes.sub')}</p>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p>⏳ Chargement des changements...</p>
            </div>
          ) : (
          <div className="changes-grid">
            {changes.map((c, i) => (
              <div key={c.title} className="change-card reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="change-icon">{c.icon}</div>
                <span className={`change-tag ${TAG_CLASS[c.tag]}`}>{t(`ref.tag.${c.tag}`)}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className="before-after">
                  <div className="ba-box ba-before">
                    <div className="ba-label">{c.beforeLabel}</div>
                    <div className="ba-val">{c.beforeVal}</div>
                  </div>
                  <div className="ba-box ba-after">
                    <div className="ba-label">{c.afterLabel}</div>
                    <div className="ba-val">{c.afterVal}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ── IMPACT + TIMELINE ───────────────────────────────────────────── */}
      <section className="impact-section">
        <div className="container">
          <div className="impact-grid">

            {/* Profile tabs */}
            <div>
              <div className="section-header reveal">
                <div className="eyebrow">{t('ref.impact.eyebrow')}</div>
                <h2>{t('ref.impact.title1')} <em>{t('ref.impact.title2')}</em> {t('ref.impact.title3')}</h2>
              </div>
              <p className="impact-intro">{t('ref.impact.intro')}</p>
              <div className="profile-tabs reveal">
                {profiles.map(p => (
                  <button
                    key={p.id}
                    className={`ptab${activeProfile === p.id ? ' active' : ''}`}
                    onClick={() => setActiveProfile(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="reveal" style={{ transitionDelay: '100ms' }}>
                {profiles.map(p => (
                  <div key={p.id} className={`profile-card${activeProfile === p.id ? ' active' : ''}`}>
                    <h4>{p.title}</h4>
                    <div className="profile-rows">
                      {p.rows.map((r: any) => (
                        <div key={r.label} className="profile-row">
                          <span className="pr-label">{r.label}</span>
                          <span className={`pr-val${r.cls ? ` ${r.cls}` : ''}`}>{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px' }}>
                <Link href="/simulation" className="btn btn-primary">{t('ref.impact.cta')}</Link>
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline-card reveal" style={{ transitionDelay: '100ms' }}>
              <h3>{t('ref.tl.title')}</h3>
              <div className="tl">
                {timeline.map((item, i) => (
                  <div key={item.date} className="tl-item">
                    <div className="tl-left">
                      <div className={`tl-dot ${item.status}`}>{TL_DOT[item.status] ?? '○'}</div>
                      {i < timeline.length - 1 && <div className="tl-line" />}
                    </div>
                    <div className="tl-right">
                      <div className="tl-date">{item.date}</div>
                      <div className="tl-title">{item.title}</div>
                      <div className="tl-desc">{item.desc}</div>
                      <span className={`tl-chip ${CHIP_CLASS[item.chip] ?? 'chip-soon'}`}>
                        {t(`ref.chip.${item.chip}`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MINI FAQ ────────────────────────────────────────────────────── */}
      <section className="reform-faq">
        <div className="container">
          <div className="section-header center reveal">
            <div className="eyebrow center">{t('ref.faq.eyebrow')}</div>
            <h2>{t('ref.faq.title')}</h2>
            <p>{t('ref.faq.sub')}</p>
          </div>
          <div className="reform-faq-grid">
            {faqItems.map((item, i) => (
              <Link key={i} href="/faq" className="mini-faq-item reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <h4>{item.q}</h4>
                <p>{item.p}</p>
                <div className="mini-faq-link">{t('ref.faq.read')} <span>→</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="reform-cta">
        <div className="container">
          <div className="reform-cta-inner">
            <div className="reveal">
              <h2>{t('ref.cta.title')}</h2>
              <p>{t('ref.cta.sub')}</p>
            </div>
            <div className="reform-cta-btns reveal" style={{ transitionDelay: '100ms' }}>
              <Link href="/simulation" className="btn btn-primary btn-lg">{t('ref.cta.btn1')}</Link>
              <Link href="/faq" className="btn btn-ghost btn-lg">{t('ref.cta.btn2')}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
