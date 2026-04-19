'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  {
    label: 'Général',
    items: [
      { href: '/admin',          icon: '▣', label: 'Dashboard' },
    ],
  },
  {
    label: 'Contenu',
    items: [
      { href: '/admin/faq',      icon: '❓', label: 'FAQ' },
      { href: '/admin/news',     icon: '📰', label: 'Actualités' },
      { href: '/admin/reforms',  icon: '⚡', label: 'Réforme 2025' },
      { href: '/admin/tools',    icon: '🔧', label: 'Outils' },
      { href: '/admin/glossary', icon: '📖', label: 'Lexique' },
      { href: '/admin/ui-strings', icon: '🔤', label: 'Traductions UI' },
    ],
  },
]

function isActive(href: string, pathname: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname.startsWith(href)
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router    = useRouter()
  const pathname  = usePathname()
  const [authed, setAuthed]   = useState<boolean | null>(null)
  const [open, setOpen]       = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') { setAuthed(null); return }
    fetch('/api/admin/check-auth', { credentials: 'include' })
      .then(r => {
        if (r.ok) { setAuthed(true) }
        else { setAuthed(false); router.push('/admin/login') }
      })
      .catch(() => { setAuthed(false); router.push('/admin/login') })
  }, [pathname])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    router.push('/admin/login')
  }

  // Login page: render bare (no sidebar)
  if (pathname === '/admin/login') return <>{children}</>

  // Loading
  if (authed === null) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--adm-bg)' }}>
        <div style={{ width:32, height:32, border:'3px solid var(--adm-border)', borderTopColor:'var(--adm-primary)', borderRadius:'50%', animation:'adm-spin 0.8s linear infinite' }} />
        <style>{`@keyframes adm-spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!authed) return null

  return (
    <div className="adm-root">
      {/* ── Overlay (mobile) ── */}
      {open && <div className="adm-overlay" onClick={() => setOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`adm-sidebar${open ? ' adm-sidebar--open' : ''}`}>
        {/* Header */}
        <div className="adm-sidebar-header">
          <Link href="/admin" className="adm-logo" onClick={() => setOpen(false)}>
            <span className="adm-logo-mark">DB</span>
            <span className="adm-logo-text">DocBel <span className="adm-logo-badge">Admin</span></span>
          </Link>
          <button className="adm-close-btn" onClick={() => setOpen(false)} aria-label="Fermer">✕</button>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          {NAV.map(section => (
            <div key={section.label} className="adm-nav-section">
              <p className="adm-nav-section-label">{section.label}</p>
              {section.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`adm-nav-item${isActive(item.href, pathname) ? ' adm-nav-item--active' : ''}`}
                >
                  <span className="adm-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="adm-sidebar-footer">
          <a href="/" className="adm-footer-link" target="_blank" rel="noopener">
            <span>↗</span> Voir le site
          </a>
          <button className="adm-logout-btn" onClick={logout}>
            <span>⎋</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="adm-body">
        {/* Topbar */}
        <header className="adm-topbar">
          <button className="adm-menu-btn" onClick={() => setOpen(true)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <Breadcrumb pathname={pathname} />
        </header>

        {/* Content */}
        <main className="adm-main">
          {children}
        </main>
      </div>

      <style>{ADM_CSS}</style>
    </div>
  )
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const map: Record<string, string> = {
    '/admin':           'Dashboard',
    '/admin/faq':       'FAQ',
    '/admin/news':      'Actualités',
    '/admin/reforms':   'Réforme 2025',
    '/admin/tools':     'Outils',
    '/admin/glossary':  'Lexique',
    '/admin/ui-strings':'Traductions UI',
  }
  const parts = pathname.split('/').filter(Boolean)
  const base  = '/' + parts.slice(0, 2).join('/')
  const label = map[base] ?? parts.at(-1) ?? 'Admin'
  const sub   = parts.length > 2 ? parts.slice(2).join(' / ') : null

  return (
    <nav className="adm-breadcrumb" aria-label="Fil d'Ariane">
      <Link href="/admin" className="adm-bc-root">Admin</Link>
      {label !== 'Dashboard' && (
        <>
          <span className="adm-bc-sep">/</span>
          <Link href={base} className="adm-bc-link">{label}</Link>
        </>
      )}
      {sub && (
        <>
          <span className="adm-bc-sep">/</span>
          <span className="adm-bc-current">{sub}</span>
        </>
      )}
    </nav>
  )
}

const ADM_CSS = `
/* ── Tokens ── */
:root {
  --adm-sidebar-w: 260px;
  --adm-topbar-h: 56px;
  --adm-bg:       #09090b;
  --adm-surface:  #18181b;
  --adm-border:   #27272a;
  --adm-text:     #fafafa;
  --adm-muted:    #71717a;
  --adm-primary:  #6366f1;
  --adm-primary-hover: #818cf8;
  --adm-active-bg: rgba(99,102,241,.15);
  --adm-hover-bg:  rgba(255,255,255,.05);
  --adm-radius:   8px;
}
[data-theme="light"] {
  --adm-bg:       #f4f4f5;
  --adm-surface:  #ffffff;
  --adm-border:   #e4e4e7;
  --adm-text:     #18181b;
  --adm-muted:    #71717a;
  --adm-active-bg: rgba(99,102,241,.1);
  --adm-hover-bg:  rgba(0,0,0,.04);
}

/* ── Shell ── */
.adm-root {
  display: flex;
  min-height: 100vh;
  background: var(--adm-bg);
  color: var(--adm-text);
  font-family: var(--font-inter, sans-serif);
}

/* ── Overlay ── */
.adm-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.6);
  z-index: 199;
}

/* ── Sidebar ── */
.adm-sidebar {
  position: fixed;
  inset-block: 0; left: 0;
  width: var(--adm-sidebar-w);
  background: var(--adm-surface);
  border-right: 1px solid var(--adm-border);
  display: flex;
  flex-direction: column;
  z-index: 200;
  transition: transform .25s cubic-bezier(.4,0,.2,1);
}

/* ── Sidebar header ── */
.adm-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: var(--adm-topbar-h);
  border-bottom: 1px solid var(--adm-border);
  flex-shrink: 0;
}
.adm-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; color: var(--adm-text);
}
.adm-logo-mark {
  width: 32px; height: 32px;
  background: var(--adm-primary);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 800; color: #fff;
  flex-shrink: 0;
}
.adm-logo-text {
  font-size: .95rem; font-weight: 700; line-height: 1;
}
.adm-logo-badge {
  display: inline-block;
  font-size: .6rem; font-weight: 600;
  background: var(--adm-active-bg);
  color: var(--adm-primary);
  border-radius: 4px;
  padding: 1px 5px;
  margin-left: 4px;
  vertical-align: middle;
}
.adm-close-btn {
  display: none;
  background: none; border: none;
  color: var(--adm-muted); cursor: pointer;
  font-size: 1rem; padding: 4px 8px;
  border-radius: 4px;
}
.adm-close-btn:hover { background: var(--adm-hover-bg); color: var(--adm-text); }

/* ── Nav ── */
.adm-nav {
  flex: 1; overflow-y: auto;
  padding: 8px 0;
}
.adm-nav-section { padding: 8px 0; }
.adm-nav-section + .adm-nav-section {
  border-top: 1px solid var(--adm-border);
  margin-top: 4px; padding-top: 12px;
}
.adm-nav-section-label {
  font-size: .7rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--adm-muted);
  padding: 0 16px; margin: 0 0 4px;
}
.adm-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 16px; margin: 1px 8px;
  border-radius: var(--adm-radius);
  color: var(--adm-muted);
  text-decoration: none; font-size: .875rem;
  transition: background .15s, color .15s;
}
.adm-nav-item:hover {
  background: var(--adm-hover-bg);
  color: var(--adm-text);
}
.adm-nav-item--active {
  background: var(--adm-active-bg);
  color: var(--adm-primary);
  font-weight: 600;
}
.adm-nav-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }

/* ── Sidebar footer ── */
.adm-sidebar-footer {
  display: flex; flex-direction: column; gap: 4px;
  padding: 12px 8px;
  border-top: 1px solid var(--adm-border);
  flex-shrink: 0;
}
.adm-footer-link, .adm-logout-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px;
  border-radius: var(--adm-radius);
  font-size: .875rem; cursor: pointer;
  text-decoration: none;
  transition: background .15s, color .15s;
  background: none; border: none; width: 100%;
  text-align: left;
}
.adm-footer-link { color: var(--adm-muted); }
.adm-footer-link:hover { background: var(--adm-hover-bg); color: var(--adm-text); }
.adm-logout-btn { color: #f87171; }
.adm-logout-btn:hover { background: rgba(248,113,113,.1); color: #fca5a5; }

/* ── Body (main + topbar) ── */
.adm-body {
  flex: 1;
  margin-left: var(--adm-sidebar-w);
  display: flex; flex-direction: column;
  min-height: 100vh;
  min-width: 0;
}

/* ── Topbar ── */
.adm-topbar {
  height: var(--adm-topbar-h);
  background: var(--adm-surface);
  border-bottom: 1px solid var(--adm-border);
  display: flex; align-items: center; gap: 12px;
  padding: 0 24px;
  position: sticky; top: 0; z-index: 100;
  flex-shrink: 0;
}
.adm-menu-btn {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 4px;
}
.adm-menu-btn span {
  display: block; width: 20px; height: 2px;
  background: var(--adm-muted); border-radius: 2px;
  transition: background .15s;
}
.adm-menu-btn:hover span { background: var(--adm-text); }

/* ── Breadcrumb ── */
.adm-breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: .875rem;
}
.adm-bc-root { color: var(--adm-muted); text-decoration: none; }
.adm-bc-root:hover { color: var(--adm-text); }
.adm-bc-sep { color: var(--adm-border); }
.adm-bc-link { color: var(--adm-muted); text-decoration: none; }
.adm-bc-link:hover { color: var(--adm-text); }
.adm-bc-current { color: var(--adm-text); font-weight: 500; }

/* ── Content ── */
.adm-main {
  flex: 1; padding: 28px 32px;
  max-width: 1200px;
}

/* ── Mobile ── */
@media (max-width: 900px) {
  .adm-sidebar { transform: translateX(-100%); }
  .adm-sidebar--open { transform: translateX(0); }
  .adm-close-btn { display: block; }
  .adm-menu-btn { display: flex; }
  .adm-body { margin-left: 0; }
  .adm-main { padding: 20px 16px; }
}
`
