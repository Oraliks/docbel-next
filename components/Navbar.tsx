'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useLang } from './LanguageProvider'
import LanguageSelector from './LanguageSelector'

type DropItem = { label: string; href: string; badge?: string }
type NavEntry =
  | { kind: 'link'; label: string; href: string }
  | { kind: 'dropdown'; label: string; key: string; items: DropItem[] }

export default function Navbar() {
  const { t } = useLang()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [mobile, setMobile]   = useState(false)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [mobileSection, setMobileSection] = useState<string | null>(null)
  const ddRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => { setOpenKey(null); setMobile(false) }, [pathname])

  useEffect(() => {
    if (!openKey) return
    const onDown = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setOpenKey(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [openKey])

  const NAV: NavEntry[] = [
    { kind: 'link', label: t('nav.home'), href: '/' },
    { kind: 'link', label: t('nav.news'), href: '/actualites' },
    {
      kind: 'dropdown', label: t('nav.simulations'), key: 'sim',
      items: [
        { label: t('nav.dd.sim1'), href: '/simulation' },
        { label: t('nav.dd.sim2'), href: '/simulation' },
        { label: t('nav.dd.sim3'), href: '/reforme', badge: t('nav.dd.sim3.badge') },
      ],
    },
    {
      kind: 'dropdown', label: t('nav.tools'), key: 'tools',
      items: [
        { label: t('nav.dd.tool1'), href: '/faq' },
        { label: t('nav.dd.tool2'), href: '#' },
        { label: t('nav.dd.tool3'), href: '/lexique' },
        { label: t('nav.dd.tool4'), href: '#' },
        { label: t('nav.dd.tool5'), href: '#' },
      ],
    },
    { kind: 'link', label: t('nav.contact'), href: '/contact' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="navbar">
      <div className="container nav-inner">

        <Link href="/" className="nav-logo" aria-label={t('nav.logo.aria')}>
          <span className="logo-name-gradient">DocBel</span>
        </Link>

        <nav className="nav-links" ref={ddRef}>
          {NAV.map(entry => {
            if (entry.kind === 'link') {
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={`nav-link${isActive(entry.href) ? ' active' : ''}`}
                >
                  {entry.label}
                </Link>
              )
            }
            const open = openKey === entry.key
            return (
              <div key={entry.key} className={`nav-dd${open ? ' open' : ''}`}>
                <button
                  className="nav-link nav-dd-trigger"
                  onClick={() => setOpenKey(open ? null : entry.key)}
                  aria-expanded={open}
                >
                  {entry.label}
                  <span className="nav-dd-caret" aria-hidden>▾</span>
                </button>
                {open && (
                  <div className="nav-dd-panel">
                    {entry.items.map(it => (
                      <Link key={it.label} href={it.href} className="nav-dd-item" onClick={() => setOpenKey(null)}>
                        <span className="nav-dd-label">
                          {it.label}
                          {it.badge && <span className="nav-dd-badge">{it.badge}</span>}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="nav-right">
          <LanguageSelector variant="navbar" />

          {mounted && (
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? t('nav.theme.light') : t('nav.theme.dark')}
              title={theme === 'dark' ? t('nav.theme.light') : t('nav.theme.dark')}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}

          <button
            className={`nav-burger${mobile ? ' open' : ''}`}
            onClick={() => setMobile(v => !v)}
            aria-label="Menu"
            aria-expanded={mobile}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`nav-mobile${mobile ? ' open' : ''}`}>
        {NAV.map(entry => {
          if (entry.kind === 'link') {
            return (
              <Link key={entry.href} href={entry.href} className="nav-mobile-link">
                {entry.label}
              </Link>
            )
          }
          const open = mobileSection === entry.key
          return (
            <div key={entry.key} className={`nav-mobile-section${open ? ' open' : ''}`}>
              <button
                className="nav-mobile-section-head"
                onClick={() => setMobileSection(open ? null : entry.key)}
                aria-expanded={open}
              >
                {entry.label}
                <span aria-hidden>{open ? '−' : '+'}</span>
              </button>
              <div className="nav-mobile-section-body">
                {entry.items.map(it => (
                  <Link key={it.label} href={it.href} className="nav-mobile-sub">
                    <strong>{it.label}</strong>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </header>
  )
}
