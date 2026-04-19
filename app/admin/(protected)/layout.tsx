'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import '@/app/admin/tailwind.css'

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

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split('/').filter(Boolean).slice(1) // remove 'admin'
  const labels: Record<string, string> = {
    posts: 'Articles', media: 'Médias', categories: 'Catégories', tags: 'Tags',
    comments: 'Commentaires', users: 'Utilisateurs', analytics: 'Analytics',
    faq: 'FAQ', news: 'Actualités', reforms: 'Réforme 2025', tools: 'Outils',
    glossary: 'Lexique', 'ui-strings': 'Traductions UI', new: 'Nouveau',
  }
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link href="/admin" className="text-zinc-400 hover:text-zinc-100 transition-colors">Admin</Link>
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-zinc-600">/</span>
          {i === segments.length - 1
            ? <span className="text-zinc-100 font-medium">{labels[seg] ?? seg}</span>
            : <Link href={'/admin/' + segments.slice(0, i + 1).join('/')} className="text-zinc-400 hover:text-zinc-100 transition-colors">{labels[seg] ?? seg}</Link>
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
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: 'var(--font-inter, sans-serif)' }}>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-[199] lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-[260px] bg-zinc-900 border-r border-zinc-800 flex flex-col z-[200] transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-800 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 no-underline" onClick={() => setOpen(false)}>
            <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0">DB</div>
            <span className="text-zinc-100 font-bold text-[.95rem]">
              DocBel <span className="text-[.6rem] font-semibold bg-indigo-500/20 text-indigo-400 rounded px-1 py-px ml-1">Admin</span>
            </span>
          </Link>
          <button className="lg:hidden text-zinc-400 hover:text-zinc-100 p-1" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(section => (
            <div key={section.label} className="py-2 [&+&]:border-t [&+&]:border-zinc-800 [&+&]:mt-1 [&+&]:pt-3">
              <p className="text-[.7rem] font-semibold uppercase tracking-widest text-zinc-500 px-4 mb-1">{section.label}</p>
              {section.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2 mx-2 rounded-lg text-[.875rem] no-underline transition-all duration-150 ${
                    isActive(item.href, pathname)
                      ? 'bg-indigo-500/15 text-indigo-400 font-semibold'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                  }`}
                >
                  <span className="w-5 text-center text-base flex-shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex flex-col gap-1 p-2 border-t border-zinc-800 flex-shrink-0">
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100 text-[.875rem] no-underline transition-all">
            <span>↗</span> Voir le site
          </a>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 text-[.875rem] w-full text-left cursor-pointer bg-transparent border-none transition-all"
          >
            <span>⎋</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center gap-3 px-6 sticky top-0 z-100 flex-shrink-0">
          <button
            className="lg:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
            onClick={() => setOpen(true)}
            aria-label="Menu"
          >
            <span className="block w-5 h-0.5 bg-zinc-400 rounded" />
            <span className="block w-5 h-0.5 bg-zinc-400 rounded" />
            <span className="block w-5 h-0.5 bg-zinc-400 rounded" />
          </button>
          <Breadcrumb pathname={pathname} />
        </header>

        {/* Content */}
        <main className="flex-1 p-7 max-w-[1200px] w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
