'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

/* ─── Scroll reveal hook ─────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

/* ─── Home page ──────────────────────────────────────────────────────── */
export default function Home() {
  useReveal()
  const { t } = useLang()

  const SERVICES = [
    { icon: '🔍', title: t('home.srv.1.title'), desc: t('home.srv.1.desc'), link: t('home.srv.1.cta'), href: '/simulation' },
    { icon: '🧮', title: t('home.srv.2.title'), desc: t('home.srv.2.desc'), link: t('home.srv.2.cta'), href: '/simulation' },
    { icon: '📝', title: t('home.srv.3.title'), desc: t('home.srv.3.desc'), link: t('home.srv.3.cta'), href: '#' },
    { icon: '🏛️', title: t('home.srv.4.title'), desc: t('home.srv.4.desc'), link: t('home.srv.4.cta'), href: '#' },
  ]

  const BARS = [
    { label: t('home.hero.mock.days'),     val: '312/312', pct: '100%' },
    { label: t('home.hero.mock.forms'),    val: '3/4',     pct: '75%'  },
    { label: t('home.hero.mock.duration'), val: t('home.hero.mock.duration.val'), pct: '60%' },
  ]

  const STEPS = [
    { n: '1', title: t('home.step1.title'), desc: t('home.step1.desc') },
    { n: '2', title: t('home.step2.title'), desc: t('home.step2.desc') },
    { n: '3', title: t('home.step3.title'), desc: t('home.step3.desc') },
  ]

  const FORMS = [t('home.cta.f1'), t('home.cta.f2'), t('home.cta.f3'), t('home.cta.f4')]

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">

            {/* Left */}
            <div>
              <div className="hero-kicker">
                <span className="hero-kicker-dot" />
                {t('home.hero.kicker')}
              </div>
              <h1>
                {t('home.hero.title1')}<br />
                <span className="text-gradient">{t('home.hero.title2')}</span>
              </h1>
              <p className="hero-sub">{t('home.hero.sub')}</p>
              <div className="hero-ctas">
                <Link href="/simulation" className="btn btn-primary btn-lg">{t('home.hero.cta1')} →</Link>
                <Link href="/reforme" className="btn btn-ghost btn-lg">{t('home.hero.cta2')}</Link>
              </div>
            </div>

            {/* Right — UI mockup card */}
            <div className="hero-right" style={{ position: 'relative', padding: '20px 12px' }}>
              <div className="hero-badge hero-badge-top">
                <span style={{ fontSize: '1rem' }}>✅</span>
                {t('home.hero.badge.top')}
              </div>

              <div className="hero-card">
                <div className="hcard-header">
                  <div className="traffic-dot td-r" />
                  <div className="traffic-dot td-y" />
                  <div className="traffic-dot td-g" />
                  <span className="hcard-title">{t('home.hero.mock.title')}</span>
                </div>
                <div className="hcard-body">
                  <div className="hcard-section">
                    <div className="hcard-label">{t('home.hero.mock.status')}</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="status-pill status-ok">{t('home.hero.mock.eligible')}</span>
                      <span className="status-pill status-pending">{t('home.hero.mock.pending')}</span>
                    </div>
                  </div>
                  <div className="hcard-section">
                    <div className="hcard-label">{t('home.hero.mock.progress')}</div>
                    <div className="hcard-bar">
                      {BARS.map(b => (
                        <div key={b.label}>
                          <div className="bar-row"><span>{b.label}</span><span>{b.val}</span></div>
                          <div className="bar-track"><div className="bar-fill" style={{ width: b.pct }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="hcard-section" style={{ marginBottom: 0 }}>
                    <div className="hcard-label">{t('home.hero.mock.next')}</div>
                    <div className="check-list">
                      <div className="check-item"><div className="check-icon check-done">✓</div>{t('home.hero.mock.step1')}</div>
                      <div className="check-item"><div className="check-icon check-done">✓</div>{t('home.hero.mock.step2')}</div>
                      <div className="check-item"><div className="check-icon check-todo" />{t('home.hero.mock.step3')}</div>
                    </div>
                  </div>
                </div>
                <div className="hcard-footer">
                  <button className="hcard-btn">{t('home.hero.mock.btn')}</button>
                </div>
              </div>

              <div className="hero-badge hero-badge-bot">
                <span style={{ fontSize: '1rem' }}>📄</span>
                <span>{t('home.hero.badge.bot.label')} <strong style={{ color: 'var(--primary)' }}>{t('home.hero.badge.bot.strong')}</strong></span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section className="services">
        <div className="container">
          <div className="section-header reveal">
            <div className="eyebrow">{t('home.services.eyebrow')}</div>
            <h2>{t('home.services.title')}</h2>
            <p>{t('home.services.sub')}</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <Link
                key={s.title}
                href={s.href}
                className={`srv-card reveal`}
                style={{ transitionDelay: `${i * 60}ms`, display: 'block' }}
              >
                <div className="srv-icon">{s.icon}</div>
                <div className="srv-title">{s.title}</div>
                <div className="srv-desc">{s.desc}</div>
                <div className="srv-link">{s.link} <span>→</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────────────────── */}
      <section className="process">
        <div className="container">
          <div className="section-header center reveal">
            <div className="eyebrow center">{t('home.process.eyebrow')}</div>
            <h2>{t('home.process.title')}</h2>
            <p>{t('home.process.sub')}</p>
          </div>
          <div className="steps-row">
            {STEPS.map((s, i) => (
              <div key={s.n} className="step reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM CTA ────────────────────────────────────────────────────── */}
      <section className="form-cta">
        <div className="container">
          <div className="form-cta-inner">

            <div className="reveal" style={{ transitionDelay: '0ms' }}>
              <div className="cta-kicker">{t('home.cta.kicker')}</div>
              <h2>{t('home.cta.title')}</h2>
              <p>{t('home.cta.sub')}</p>
              <div className="cta-features">
                {FORMS.map(f => (
                  <div key={f} className="cta-feat"><div className="feat-check">✓</div>{f}</div>
                ))}
              </div>
              <button className="btn btn-white btn-lg">{t('home.cta.btn')}</button>
            </div>

            <div className="reveal" style={{ transitionDelay: '100ms' }}>
              <div className="fmock">
                <div className="fmock-bar">
                  <div className="traffic-dot td-r" /><div className="traffic-dot td-y" /><div className="traffic-dot td-g" />
                  <span className="fmock-bar-title">{t('home.cta.mock.title')}</span>
                </div>
                <div className="fmock-body">
                  <div className="fmock-steps">
                    <div className="fstep done">✓</div><div className="fstep-line done" />
                    <div className="fstep done">✓</div><div className="fstep-line" />
                    <div className="fstep active">3</div><div className="fstep-line" />
                    <div className="fstep">4</div>
                  </div>
                  <div className="fmock-step-label">{t('home.cta.mock.step')}</div>
                  <div className="ffields">
                    <div className="frow">
                      <div><div className="flabel">{t('home.cta.mock.date')}</div><div className="finput filled">31/12/2024</div></div>
                      <div><div className="flabel">{t('home.cta.mock.type')}</div><div className="finput filled">CDI</div></div>
                    </div>
                    <div>
                      <div className="flabel">{t('home.cta.mock.reason')}</div>
                      <div className="finput focus">{t('home.cta.mock.reason.val')}</div>
                      <div className="fhint">{t('home.cta.mock.hint')}</div>
                    </div>
                    <div><div className="flabel">{t('home.cta.mock.notice')}</div><div className="finput">{t('home.cta.mock.notice.placeholder')}</div></div>
                  </div>
                  <button className="fmock-submit">{t('home.cta.mock.next')}</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
