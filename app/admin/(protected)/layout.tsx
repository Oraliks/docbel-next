'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

const SIDEBAR_W = 260
const TOPBAR_H = 56

const NAV = [
  {
    label: 'Général',
    items: [
      { href: '/admin',           icon: '▣',  label: 'Dashboard' },
      { href: '/admin/analytics', icon: '📊', label: 'Analytics' },
    ],
  },
  {
    label: 'Contenu',
    items: [
      { href: '/admin/posts',      icon: '📝', label: 'Articles' },
      { href: '/admin/media',      icon: '🖼️', label: 'Médias' },
      { href: '/admin/categories', icon: '📁', label: 'Catégories' },
      { href: '/admin/tags',       icon: '🏷️', label: 'Tags' },
      { href: '/admin/comments',   icon: '💬', label: 'Commentaires' },
    ],
  },
  {
    label: 'DocBel',
    items: [
      { href: '/admin/faq',        icon: '❓', label: 'FAQ' },
      { href: '/admin/news',       icon: '📰', label: 'Actualités' },
      { href: '/admin/reforms',    icon: '⚡', label: 'Réforme 2025' },
      { href: '/admin/tools',      icon: '🔧', label: 'Outils' },
      { href: '/admin/glossary',   icon: '📖', label: 'Lexique' },
      { href: '/admin/ui-strings', icon: '🔤', label: 'Traductions UI' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { href: '/admin/users', icon: '👥', label: 'Utilisateurs' },
    ],
  },
]

function isActive(href: string, pathname: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname.startsWith(href)
}

const LABELS: Record<string, string> = {
  posts: 'Articles', media: 'Médias', categories: 'Catégories', tags: 'Tags',
  comments: 'Commentaires', users: 'Utilisateurs', analytics: 'Analytics',
  faq: 'FAQ', news: 'Actualités', reforms: 'Réforme 2025', tools: 'Outils',
  glossary: 'Lexique', 'ui-strings': 'Traductions UI', new: 'Nouveau',
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split('/').filter(Boolean).slice(1)
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.875rem' }}>
      <Link href="/admin" style={{ color: '#71717a', textDecoration: 'none' }}>Admin</Link>
      {segments.map((seg, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#3f3f46' }}>/</span>
          {i === segments.length - 1
            ? <span style={{ color: '#fafafa', fontWeight: 500 }}>{LABELS[seg] ?? seg}</span>
            : <Link href={'/admin/' + segments.slice(0, i + 1).join('/')} style={{ color: '#71717a', textDecoration: 'none' }}>{LABELS[seg] ?? seg}</Link>
          }
        </span>
      ))}
    </nav>
  )
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#09090b', color: '#fafafa',
      fontFamily: 'var(--font-inter, system-ui, sans-serif)',
    }}>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 199 }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`adm-sidebar${open ? ' adm-sidebar--open' : ''}`} style={{
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        width: SIDEBAR_W,
        background: '#18181b',
        borderRight: '1px solid #27272a',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 200,
        transition: 'transform .2s ease',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: TOPBAR_H,
          borderBottom: '1px solid #27272a', flexShrink: 0,
        }}>
          <Link href="/admin" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, background: '#6366f1', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.75rem', fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>DB</div>
            <span style={{ color: '#fafafa', fontWeight: 700, fontSize: '.95rem' }}>
              DocBel{' '}
              <span style={{
                fontSize: '.6rem', fontWeight: 600,
                background: 'rgba(99,102,241,.2)', color: '#818cf8',
                borderRadius: 4, padding: '1px 5px', marginLeft: 4,
              }}>Admin</span>
            </span>
          </Link>
          {/* Close btn — always rendered but hidden on desktop via JS */}
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '1rem', padding: '4px 8px' }}
          >✕</button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {NAV.map((section, si) => (
            <div key={section.label} style={{
              padding: '8px 0',
              borderTop: si > 0 ? '1px solid #27272a' : 'none',
              marginTop: si > 0 ? 4 : 0,
            }}>
              <p style={{
                fontSize: '.7rem', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '.08em', color: '#52525b',
                padding: '0 16px', margin: '0 0 4px',
              }}>{section.label}</p>
              {section.items.map(item => {
                const active = isActive(item.href, pathname)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 16px', margin: '1px 8px',
                      borderRadius: 8, textDecoration: 'none', fontSize: '.875rem',
                      background: active ? 'rgba(99,102,241,.15)' : 'transparent',
                      color: active ? '#818cf8' : '#71717a',
                      fontWeight: active ? 600 : 400,
                      transition: 'background .1s, color .1s',
                    }}
                  >
                    <span style={{ width: 20, textAlign: 'center', flexShrink: 0, fontSize: '1rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 8px', borderTop: '1px solid #27272a', flexShrink: 0 }}>
          <a href="/" target="_blank" rel="noopener" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 8,
            color: '#71717a', textDecoration: 'none', fontSize: '.875rem',
          }}>
            <span>↗</span> Voir le site
          </a>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 8,
              background: 'none', border: 'none', width: '100%', textAlign: 'left',
              color: '#f87171', fontSize: '.875rem', cursor: 'pointer',
            }}
          >
            <span>⎋</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="adm-body" style={{
        flex: 1,
        marginLeft: SIDEBAR_W,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        minWidth: 0,
      }}>
        {/* Topbar */}
        <header style={{
          height: TOPBAR_H,
          background: '#18181b',
          borderBottom: '1px solid #27272a',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 24px',
          position: 'sticky', top: 0, zIndex: 100,
          flexShrink: 0,
        }}>
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Menu"
            style={{
              display: 'flex', flexDirection: 'column', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}
          >
            <span style={{ display: 'block', width: 20, height: 2, background: '#71717a', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 20, height: 2, background: '#71717a', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 20, height: 2, background: '#71717a', borderRadius: 2 }} />
          </button>
          <Breadcrumb pathname={pathname} />
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 32px', maxWidth: 1200 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .adm-sidebar { transform: translateX(-100%); }
          .adm-sidebar--open { transform: translateX(0) !important; }
          .adm-body { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  )
}
