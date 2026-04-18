'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

export default function OutilsPage() {
  const { lang, t, isFull } = useLang()
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await fetch('/api/tools')
        if (!res.ok) throw new Error(`Failed to load tools: ${res.status}`)
        const result = await res.json()
        if (result.success && result.data) {
          const transformed = result.data.map((tool: any) => ({
            href: `/outils/${tool.slug}`,
            icon: '🔧',
            title: tool[`title${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || tool.titleFr,
            desc: tool[`desc${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || tool.descFr,
            cta: tool.link ? 'calc' : 'start',
            tag: null,
          }))
          setTools(transformed)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tools')
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
  }, [lang])

  if (error) {
    return (
      <div style={{ padding: '72px 0', minHeight: 'calc(100vh - 62px)' }}>
        <div className="container" style={{ maxWidth: '1080px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-3)', fontSize: '1rem' }}>⚠️ Erreur lors du chargement des outils: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '72px 0', minHeight: 'calc(100vh - 62px)' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>

        <div style={{ marginBottom: '44px' }}>
          <div className="eyebrow">{t('tools.eyebrow')}</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '10px' }}>{t('tools.title')}</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '1rem', maxWidth: '640px' }}>
            {t('tools.sub')}
          </p>
          {!isFull && (
            <p style={{ marginTop: '8px', fontSize: '.82rem', color: 'var(--text-3)' }}>
              🤖 {t('lang.ai.notice')}
            </p>
          )}
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-3)', fontSize: '1rem', textAlign: 'center' }}>⏳ Chargement des outils...</p>
        ) : (
        <div style={{
          display: 'grid', gap: '20px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        }}>
          {tools.map(tool => (
            <Link key={tool.title} href={tool.href} className="card" style={{
              padding: '26px', textDecoration: 'none', color: 'inherit',
              display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative',
            }}>
              {tool.tag && (
                <span style={{
                  position: 'absolute', top: '14px', right: '14px',
                  fontSize: '.62rem', padding: '3px 8px', borderRadius: '99px',
                  background: 'var(--primary)', color: '#fff', fontWeight: 800, letterSpacing: '.04em',
                }}>{tool.tag}</span>
              )}
              <div style={{ fontSize: '2rem' }}>{tool.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{tool.title}</div>
              <div style={{ color: 'var(--text-3)', fontSize: '.85rem', lineHeight: 1.55, flex: 1 }}>{tool.desc}</div>
              <div style={{ color: 'var(--primary)', fontSize: '.85rem', fontWeight: 700, marginTop: '4px' }}>
                {t(`tools.cta.${tool.cta}`)} →
              </div>
            </Link>
          ))}
        </div>
        )}

        <div style={{
          marginTop: '44px', padding: '20px 24px', borderRadius: '14px',
          background: 'var(--primary-xlight)', borderLeft: '3px solid var(--primary)',
          fontSize: '.88rem', color: 'var(--text-2)', lineHeight: 1.6,
        }}>
          💡 <strong>{t('tools.tip.strong')}</strong> {t('tools.tip.1')}{' '}
          <Link href="/simulation" style={{ color: 'var(--primary)', fontWeight: 700 }}>{t('tools.tip.2')}</Link>{' '}
          — {t('tools.tip.3')}
        </div>

      </div>
    </div>
  )
}
