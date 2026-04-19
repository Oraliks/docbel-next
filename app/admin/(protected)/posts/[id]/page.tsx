'use client'

import { use, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('@/components/admin/RichEditor'), { ssr: false })

const fetcher = (url: string) => fetch(url).then(r => r.json())

const LANGS = [
  { code: 'Fr', label: '🇫🇷 FR' },
  { code: 'Nl', label: '🇧🇪 NL' },
  { code: 'De', label: '🇩🇪 DE' },
  { code: 'En', label: '🇬🇧 EN' },
  { code: 'Ar', label: '🇸🇦 AR' },
]

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PUBLISHED', label: 'Publié' },
  { value: 'SCHEDULED', label: 'Planifié' },
  { value: 'ARCHIVED', label: 'Archivé' },
]

type PostForm = {
  slug: string; status: string;
  titleFr: string; titleNl: string; titleDe: string; titleEn: string; titleAr: string;
  bodyFr: string; bodyNl: string; bodyDe: string; bodyEn: string; bodyAr: string;
  excerptFr: string; excerptNl: string; excerptDe: string; excerptEn: string; excerptAr: string;
  metaTitleFr: string; metaTitleEn: string; metaDescFr: string; metaDescEn: string;
  featuredImage: string; scheduledAt: string;
}

const EMPTY: PostForm = {
  slug: '', status: 'DRAFT',
  titleFr: '', titleNl: '', titleDe: '', titleEn: '', titleAr: '',
  bodyFr: '', bodyNl: '', bodyDe: '', bodyEn: '', bodyAr: '',
  excerptFr: '', excerptNl: '', excerptDe: '', excerptEn: '', excerptAr: '',
  metaTitleFr: '', metaTitleEn: '', metaDescFr: '', metaDescEn: '',
  featuredImage: '', scheduledAt: '',
}

function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-')
}

export default function PostEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === 'new'
  const router = useRouter()

  const { data, isLoading } = useSWR(isNew ? null : `/api/posts/${id}`, fetcher)
  const [form, setForm] = useState<PostForm>(EMPTY)
  const [lang, setLang] = useState('Fr')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [autoSlug, setAutoSlug] = useState(isNew)

  useEffect(() => {
    if (data?.data) {
      const p = data.data
      setForm({
        slug: p.slug ?? '', status: p.status ?? 'DRAFT',
        titleFr: p.titleFr ?? '', titleNl: p.titleNl ?? '', titleDe: p.titleDe ?? '', titleEn: p.titleEn ?? '', titleAr: p.titleAr ?? '',
        bodyFr: p.bodyFr ?? '', bodyNl: p.bodyNl ?? '', bodyDe: p.bodyDe ?? '', bodyEn: p.bodyEn ?? '', bodyAr: p.bodyAr ?? '',
        excerptFr: p.excerptFr ?? '', excerptNl: p.excerptNl ?? '', excerptDe: p.excerptDe ?? '', excerptEn: p.excerptEn ?? '', excerptAr: p.excerptAr ?? '',
        metaTitleFr: p.metaTitleFr ?? '', metaTitleEn: p.metaTitleEn ?? '', metaDescFr: p.metaDescFr ?? '', metaDescEn: p.metaDescEn ?? '',
        featuredImage: p.featuredImage ?? '', scheduledAt: p.scheduledAt ? p.scheduledAt.slice(0, 16) : '',
      })
      setAutoSlug(false)
    }
  }, [data])

  // Auto-generate slug from French title
  const set = useCallback((key: keyof PostForm, val: string) => {
    setForm(f => {
      const next = { ...f, [key]: val }
      if (key === 'titleFr' && autoSlug) next.slug = slugify(val)
      return next
    })
  }, [autoSlug])

  async function save(publish = false) {
    setSaving(true)
    const body = { ...form }
    if (publish) body.status = 'PUBLISHED'

    const url = isNew ? '/api/posts' : `/api/posts/${id}`
    const method = isNew ? 'POST' : 'PATCH'
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    setSaving(false)
    if (res.ok) {
      const result = await res.json()
      setToast(publish ? 'Article publié ✓' : 'Sauvegardé ✓')
      setTimeout(() => setToast(''), 3000)
      if (isNew && result.data?.id) router.replace(`/admin/posts/${result.data.id}`)
    } else {
      setToast('Erreur lors de la sauvegarde')
      setTimeout(() => setToast(''), 4000)
    }
  }

  if (!isNew && isLoading) {
    return <div style={{ color: '#71717a', padding: 40, textAlign: 'center' }}>Chargement…</div>
  }

  const lc = lang.toLowerCase() as 'fr' | 'nl' | 'de' | 'en' | 'ar'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960 }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, padding: '12px 20px',
          background: toast.includes('Erreur') ? '#7f1d1d' : '#14532d',
          color: '#fafafa', borderRadius: 8, fontSize: '.875rem', fontWeight: 500,
          border: `1px solid ${toast.includes('Erreur') ? '#ef4444' : '#22c55e'}`, zIndex: 9999,
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ color: '#fafafa', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          {isNew ? 'Nouvel article' : 'Éditer l\'article'}
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => save(false)} disabled={saving} style={{
            padding: '9px 18px', borderRadius: 8, background: '#27272a', color: '#a1a1aa',
            border: '1px solid #3f3f46', fontWeight: 500, fontSize: '.875rem', cursor: 'pointer',
          }}>
            {saving ? 'Sauvegarde…' : 'Enregistrer'}
          </button>
          <button onClick={() => save(true)} disabled={saving} style={{
            padding: '9px 18px', borderRadius: 8, background: '#6366f1', color: '#fff',
            border: 'none', fontWeight: 600, fontSize: '.875rem', cursor: 'pointer',
          }}>
            Publier
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
        {/* Left: content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Lang tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #27272a', paddingBottom: 0 }}>
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                style={{
                  padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: '.8rem', fontWeight: 600,
                  background: 'transparent', borderBottom: lang === l.code ? '2px solid #6366f1' : '2px solid transparent',
                  color: lang === l.code ? '#6366f1' : '#71717a', transition: 'color .1s',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Titre ({lang})</label>
            <input
              value={(form as Record<string, string>)[`title${lang}`] ?? ''}
              onChange={e => set(`title${lang}` as keyof PostForm, e.target.value)}
              placeholder={`Titre en ${lang}…`}
              style={inputStyle}
            />
          </div>

          {/* Body */}
          <div>
            <label style={labelStyle}>Contenu ({lang})</label>
            <RichEditor
              value={(form as Record<string, string>)[`body${lang}`] ?? ''}
              onChange={val => set(`body${lang}` as keyof PostForm, val)}
              placeholder={`Contenu en ${lang}…`}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label style={labelStyle}>Extrait ({lang})</label>
            <textarea
              value={(form as Record<string, string>)[`excerpt${lang}`] ?? ''}
              onChange={e => set(`excerpt${lang}` as keyof PostForm, e.target.value)}
              rows={3}
              placeholder="Court résumé affiché dans les listes…"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* SEO (FR / EN only) */}
          {(lc === 'fr' || lc === 'en') && (
            <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ color: '#a1a1aa', fontSize: '.8rem', fontWeight: 600, margin: 0 }}>SEO ({lang})</p>
              <div>
                <label style={labelStyle}>Meta titre</label>
                <input
                  value={lc === 'fr' ? form.metaTitleFr : form.metaTitleEn}
                  onChange={e => set(lc === 'fr' ? 'metaTitleFr' : 'metaTitleEn', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Meta description</label>
                <textarea
                  value={lc === 'fr' ? form.metaDescFr : form.metaDescEn}
                  onChange={e => set(lc === 'fr' ? 'metaDescFr' : 'metaDescEn', e.target.value)}
                  rows={2} style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Status */}
          <div style={cardStyle}>
            <label style={labelStyle}>Statut</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {form.status === 'SCHEDULED' && (
              <>
                <label style={{ ...labelStyle, marginTop: 10 }}>Date de publication</label>
                <input type="datetime-local" value={form.scheduledAt} onChange={e => set('scheduledAt', e.target.value)} style={inputStyle} />
              </>
            )}
          </div>

          {/* Slug */}
          <div style={cardStyle}>
            <label style={labelStyle}>Slug (URL)</label>
            <input
              value={form.slug}
              onChange={e => { set('slug', e.target.value); setAutoSlug(false) }}
              style={inputStyle}
            />
            {autoSlug && <p style={{ color: '#71717a', fontSize: '.7rem', margin: '4px 0 0' }}>Généré automatiquement depuis le titre FR</p>}
          </div>

          {/* Featured image */}
          <div style={cardStyle}>
            <label style={labelStyle}>Image mise en avant</label>
            <input
              value={form.featuredImage}
              onChange={e => set('featuredImage', e.target.value)}
              placeholder="https://…"
              style={inputStyle}
            />
            {form.featuredImage && (
              <img src={form.featuredImage} alt="Preview" style={{ width: '100%', borderRadius: 6, marginTop: 8, aspectRatio: '16/9', objectFit: 'cover' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#a1a1aa', fontSize: '.8rem', fontWeight: 500, marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  background: '#09090b', border: '1px solid #27272a',
  color: '#fafafa', fontSize: '.875rem', outline: 'none', boxSizing: 'border-box',
}
const cardStyle: React.CSSProperties = {
  background: '#18181b', border: '1px solid #27272a', borderRadius: 10, padding: 16,
}
