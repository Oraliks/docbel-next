'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

const TAG_CLASS: Record<string, string> = {
  reform: 'status-pill status-ok',
  info:   'status-pill status-pending',
  alert:  'status-pill status-warn',
}

export default function ActualitesPage() {
  const { lang, t, isFull } = useLang()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news')
        if (!res.ok) throw new Error(`Failed to load news: ${res.status}`)
        const result = await res.json()
        if (result.success && result.data) {
          // Transform API data to match component structure
          const transformed = result.data.map((item: any) => ({
            href: `/actualites/${item.slug}`,
            tag: item.tags || 'info',
            date: item.featuredAt || new Date().toISOString(),
            title: item[`title${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || item.titleFr,
            excerpt: item[`body${lang.charAt(0).toUpperCase()}${lang.slice(1)}`] || item.bodyFr,
            featured: item.featuredAt ? true : false,
          }))
          // Sort by featured first, then by date
          transformed.sort((a: any, b: any) => {
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })
          setItems(transformed)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [lang])

  const [featured, ...rest] = items

  if (error) {
    return (
      <div style={{ padding: '72px 0', minHeight: 'calc(100vh - 62px)' }}>
        <div className="container" style={{ maxWidth: '1080px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-3)', fontSize: '1rem' }}>⚠️ Erreur lors du chargement des actualités: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '72px 0', minHeight: 'calc(100vh - 62px)' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>

        <div style={{ marginBottom: '44px' }}>
          <div className="eyebrow">{t('news.eyebrow')}</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '10px' }}>
            {t('news.title')}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '1rem', maxWidth: '640px' }}>
            {t('news.sub')}
          </p>
          {!isFull && (
            <p style={{ marginTop: '8px', fontSize: '.82rem', color: 'var(--text-3)' }}>
              🤖 {t('lang.ai.notice')}
            </p>
          )}
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-3)', fontSize: '1rem', textAlign: 'center' }}>⏳ Chargement des actualités...</p>
        ) : !featured ? (
          <p style={{ color: 'var(--text-3)', fontSize: '1rem', textAlign: 'center' }}>Aucune actualité disponible</p>
        ) : (
          <>
            {/* Featured */}
            <Link href={featured.href} className="card" style={{
              display: 'grid', gridTemplateColumns: '1fr', gap: '20px', padding: '36px',
              marginBottom: '32px', borderColor: 'var(--primary)', textDecoration: 'none', color: 'inherit',
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '.8rem', color: 'var(--text-3)' }}>
                <span className={TAG_CLASS[featured.tag] || 'status-pill status-pending'}>{t(`news.tag.${featured.tag}`)}</span>
                <span>{new Date(featured.date).toLocaleDateString('fr-BE', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{t('news.featured')}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: 0 }}>{featured.title}</h2>
              <p style={{ color: 'var(--text-3)', fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>{featured.excerpt}</p>
              <div style={{ color: 'var(--primary)', fontWeight: 700 }}>{t('news.read')}</div>
            </Link>

            {/* Grid */}
            <div style={{
              display: 'grid', gap: '20px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            }}>
              {rest.map(n => (
                <Link key={n.title} href={n.href} className="card" style={{
                  padding: '24px', textDecoration: 'none', color: 'inherit',
                  display: 'flex', flexDirection: 'column', gap: '12px',
                }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '.75rem', color: 'var(--text-3)' }}>
                    <span className={TAG_CLASS[n.tag] || 'status-pill status-pending'}>{t(`news.tag.${n.tag}`)}</span>
                    <span>{new Date(n.date).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, lineHeight: 1.4 }}>{n.title}</h3>
                  <p style={{ color: 'var(--text-3)', fontSize: '.88rem', lineHeight: 1.55, margin: 0, flex: 1 }}>{n.excerpt}</p>
                  <div style={{ color: 'var(--primary)', fontSize: '.85rem', fontWeight: 700 }}>{t('news.read.short')}</div>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
