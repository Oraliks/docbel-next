'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'

const TAG_CLASS: Record<string, string> = {
  reform: 'status-pill status-ok',
  info:   'status-pill status-pending',
  alert:  'status-pill status-warn',
}

type NewsItem = {
  id: string
  slug: string
  titleFr: string; titleNl: string; titleDe: string; titleEn: string; titleAr: string
  bodyFr: string;  bodyNl: string;  bodyDe: string;  bodyEn: string;  bodyAr: string
  tags: string
  featuredAt: string | null
  createdAt: string
}

function getLangField(item: NewsItem, field: 'title' | 'body', lang: string): string {
  const key = `${field}${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof NewsItem
  return (item[key] as string) || item[`${field}Fr` as keyof NewsItem] as string
}

export default function ActualiteDetailPage() {
  const { lang, t, isFull } = useLang()
  const params = useParams()
  const slug = params.slug as string

  const [article, setArticle] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/news/slug/${slug}`)
        if (res.status === 404) { setNotFound(true); return }
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const result = await res.json()
        if (result.success && result.data) setArticle(result.data)
        else setNotFound(true)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [slug])

  if (loading) {
    return (
      <div style={{ padding: '72px 0', minHeight: 'calc(100vh - 62px)' }}>
        <div className="container" style={{ maxWidth: '760px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-3)', fontSize: '1rem' }}>⏳ Chargement…</p>
        </div>
      </div>
    )
  }

  if (notFound || !article) {
    return (
      <div style={{ padding: '72px 0', minHeight: 'calc(100vh - 62px)' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <Link href="/actualites" style={{ color: 'var(--primary)', fontSize: '.9rem', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
            {t('news.back')}
          </Link>
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📰</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t('news.not.found')}</h1>
            <p style={{ color: 'var(--text-3)', fontSize: '.95rem' }}>{t('news.not.found.sub')}</p>
            <Link href="/actualites" className="btn" style={{ display: 'inline-block', marginTop: '24px' }}>
              {t('news.back')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const title = getLangField(article, 'title', lang)
  const body  = getLangField(article, 'body', lang)
  const date  = article.featuredAt ?? article.createdAt
  const tag   = article.tags || 'info'

  return (
    <div style={{ padding: '72px 0', minHeight: 'calc(100vh - 62px)' }}>
      <div className="container" style={{ maxWidth: '760px' }}>

        {/* Back link */}
        <Link href="/actualites" style={{
          color: 'var(--primary)', fontSize: '.9rem', textDecoration: 'none',
          display: 'inline-block', marginBottom: '32px', fontWeight: 600,
        }}>
          {t('news.back')}
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px', fontSize: '.82rem', color: 'var(--text-3)' }}>
            <span className={TAG_CLASS[tag] || 'status-pill status-pending'}>{t(`news.tag.${tag}`)}</span>
            <span>{t('news.published')} {new Date(date).toLocaleDateString('fr-BE', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            {article.featuredAt && (
              <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{t('news.featured')}</span>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.25, margin: 0 }}>{title}</h1>
          {!isFull && (
            <p style={{ marginTop: '12px', fontSize: '.82rem', color: 'var(--text-3)' }}>
              🤖 {t('lang.ai.notice')}
            </p>
          )}
        </div>

        {/* Body */}
        <article
          className="card"
          style={{ padding: '36px', lineHeight: 1.75, fontSize: '1rem' }}
          dangerouslySetInnerHTML={{ __html: body }}
        />

        {/* Footer nav */}
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/actualites" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', fontSize: '.9rem' }}>
            {t('news.back')}
          </Link>
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: '8px',
              padding: '8px 16px', cursor: 'pointer', color: 'var(--text-2)', fontSize: '.85rem',
            }}
          >
            {t('news.share')} 🔗
          </button>
        </div>

      </div>
    </div>
  )
}
