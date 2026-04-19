'use client'

import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Category = { id: string; nameFr: string; nameEn: string; slug: string; _count: { posts: number } }

const EMPTY = { slug: '', nameFr: '', nameNl: '', nameDe: '', nameEn: '', nameAr: '', orderBy: 0 }

export default function CategoriesPage() {
  const { data, mutate } = useSWR('/api/categories', fetcher)
  const categories: Category[] = data?.data ?? []
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function slugify(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function save() {
    setSaving(true)
    const url = editing ? `/api/categories/${editing}` : '/api/categories'
    const method = editing ? 'PATCH' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    setForm(EMPTY)
    setEditing(null)
    mutate()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette catégorie ?')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    mutate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      <h1 style={{ color: '#fafafa', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Catégories</h1>

      {/* Form */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: 24 }}>
        <h2 style={{ color: '#a1a1aa', fontSize: '1rem', fontWeight: 600, margin: '0 0 16px' }}>
          {editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['FR', 'nameFr'], ['NL', 'nameNl'], ['DE', 'nameDe'], ['EN', 'nameEn'], ['AR', 'nameAr']].map(([lang, key]) => (
            <div key={key}>
              <label style={lbl}>Nom ({lang})</label>
              <input
                value={(form as Record<string, unknown>)[key] as string}
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
          <button onClick={save} disabled={saving} style={{ padding: '8px 18px', borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: '.875rem', border: 'none', cursor: 'pointer' }}>
            {saving ? 'Sauvegarde…' : editing ? 'Mettre à jour' : 'Créer'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(EMPTY) }} style={{ padding: '8px 14px', borderRadius: 8, background: '#27272a', color: '#a1a1aa', border: 'none', cursor: 'pointer', fontSize: '.875rem' }}>
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #27272a' }}>
              {['Nom (FR)', 'Slug', 'Articles', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', color: '#71717a', fontSize: '.75rem', fontWeight: 600, textAlign: 'left', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#71717a', fontSize: '.875rem' }}>Aucune catégorie</td></tr>
            )}
            {categories.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #27272a' }}>
                <td style={{ padding: '12px 16px', color: '#fafafa', fontSize: '.875rem' }}>{c.nameFr}</td>
                <td style={{ padding: '12px 16px', color: '#71717a', fontSize: '.8rem', fontFamily: 'monospace' }}>{c.slug}</td>
                <td style={{ padding: '12px 16px', color: '#71717a', fontSize: '.875rem' }}>{c._count?.posts ?? 0}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditing(c.id); setForm({ slug: c.slug, nameFr: c.nameFr, nameNl: '', nameDe: '', nameEn: c.nameEn, nameAr: '', orderBy: 0 }) }} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem' }}>Éditer</button>
                    <button onClick={() => remove(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem' }}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', color: '#a1a1aa', fontSize: '.8rem', fontWeight: 500, marginBottom: 6 }
const inp: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: 8, background: '#09090b', border: '1px solid #27272a', color: '#fafafa', fontSize: '.875rem', outline: 'none', boxSizing: 'border-box' }
