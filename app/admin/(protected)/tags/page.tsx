'use client'

import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const EMPTY = { slug: '', nameFr: '', nameNl: '', nameDe: '', nameEn: '', nameAr: '' }

export default function TagsPage() {
  const { data, mutate } = useSWR('/api/tags', fetcher)
  const tags = data?.data ?? []
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)

  function slugify(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function save() {
    const url = editing ? `/api/tags/${editing}` : '/api/tags'
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm(EMPTY); setEditing(null); mutate()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce tag ?')) return
    await fetch(`/api/tags/${id}`, { method: 'DELETE' })
    mutate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 700 }}>
      <h1 style={{ color: '#fafafa', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Tags</h1>

      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: 24 }}>
        <h2 style={{ color: '#a1a1aa', fontSize: '1rem', fontWeight: 600, margin: '0 0 16px' }}>{editing ? 'Modifier le tag' : 'Nouveau tag'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['FR', 'nameFr'], ['NL', 'nameNl'], ['DE', 'nameDe'], ['EN', 'nameEn'], ['AR', 'nameAr']].map(([lang, key]) => (
            <div key={key}>
              <label style={lbl}>Nom ({lang})</label>
              <input
                value={(form as Record<string, string>)[key]}
                onChange={e => {
                  const val = e.target.value
                  setForm(f => ({ ...f, [key]: val, ...(key === 'nameFr' && !editing ? { slug: slugify(val) } : {}) }))
                }}
                style={inp}
              />
            </div>
          ))}
          <div>
            <label style={lbl}>Slug</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inp} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={save} style={{ padding: '8px 18px', borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: '.875rem', border: 'none', cursor: 'pointer' }}>
            {editing ? 'Mettre à jour' : 'Créer'}
          </button>
          {editing && <button onClick={() => { setEditing(null); setForm(EMPTY) }} style={{ padding: '8px 14px', borderRadius: 8, background: '#27272a', color: '#a1a1aa', border: 'none', cursor: 'pointer', fontSize: '.875rem' }}>Annuler</button>}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {tags.map((t: { id: string; nameFr: string; slug: string; _count: { posts: number } }) => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px',
            background: '#18181b', border: '1px solid #27272a', borderRadius: 999,
          }}>
            <span style={{ color: '#fafafa', fontSize: '.875rem' }}>{t.nameFr}</span>
            <span style={{ color: '#71717a', fontSize: '.75rem' }}>{t._count?.posts ?? 0}</span>
            <button onClick={() => { setEditing(t.id); setForm({ slug: t.slug, nameFr: t.nameFr, nameNl: '', nameDe: '', nameEn: '', nameAr: '' }) }} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.75rem', padding: 0 }}>✎</button>
            <button onClick={() => remove(t.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.75rem', padding: 0 }}>✕</button>
          </div>
        ))}
        {tags.length === 0 && <p style={{ color: '#71717a', fontSize: '.875rem' }}>Aucun tag</p>}
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', color: '#a1a1aa', fontSize: '.8rem', fontWeight: 500, marginBottom: 6 }
const inp: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: 8, background: '#09090b', border: '1px solid #27272a', color: '#fafafa', fontSize: '.875rem', outline: 'none', boxSizing: 'border-box' }
