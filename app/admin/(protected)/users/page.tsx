'use client'

import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const ROLE_COLORS: Record<string, string> = { ADMIN: '#6366f1', EDITOR: '#f59e0b', AUTHOR: '#10b981' }
const EMPTY = { name: '', email: '', role: 'AUTHOR', password: '' }

export default function UsersPage() {
  const { data, mutate } = useSWR('/api/users', fetcher)
  const users = data?.data ?? []
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const url = editing ? `/api/users/${editing}` : '/api/users'
    const body = { ...form }
    if (!body.password) delete (body as Partial<typeof EMPTY>).password
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setSaving(false)
    setForm(EMPTY); setEditing(null); mutate()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cet utilisateur ?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    mutate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      <h1 style={{ color: '#fafafa', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Utilisateurs</h1>

      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: 24 }}>
        <h2 style={{ color: '#a1a1aa', fontSize: '1rem', fontWeight: 600, margin: '0 0 16px' }}>{editing ? 'Modifier' : 'Nouvel utilisateur'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={lbl}>Nom</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} />
          </div>
          <div>
            <label style={lbl}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inp} />
          </div>
          <div>
            <label style={lbl}>Rôle</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inp}>
              <option value="AUTHOR">Auteur</option>
              <option value="EDITOR">Éditeur</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Mot de passe {editing && <span style={{ color: '#71717a' }}>(laisser vide = inchangé)</span>}</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inp} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={save} disabled={saving} style={{ padding: '8px 18px', borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: '.875rem', border: 'none', cursor: 'pointer' }}>
            {saving ? '…' : editing ? 'Mettre à jour' : 'Créer'}
          </button>
          {editing && <button onClick={() => { setEditing(null); setForm(EMPTY) }} style={{ padding: '8px 14px', borderRadius: 8, background: '#27272a', color: '#a1a1aa', border: 'none', cursor: 'pointer', fontSize: '.875rem' }}>Annuler</button>}
        </div>
      </div>

      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #27272a' }}>
              {['Utilisateur', 'Rôle', 'Articles', 'Créé le', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', color: '#71717a', fontSize: '.75rem', fontWeight: 600, textAlign: 'left', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#71717a', fontSize: '.875rem' }}>Aucun utilisateur</td></tr>
            )}
            {users.map((u: { id: string; name: string; email: string; role: string; _count: { posts: number }; createdAt: string }) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #27272a' }}>
                <td style={{ padding: '12px 16px' }}>
                  <p style={{ color: '#fafafa', fontSize: '.875rem', margin: 0 }}>{u.name}</p>
                  <p style={{ color: '#71717a', fontSize: '.75rem', margin: 0 }}>{u.email}</p>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '.7rem', fontWeight: 600, background: ROLE_COLORS[u.role] + '20', color: ROLE_COLORS[u.role] }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#71717a', fontSize: '.875rem' }}>{u._count?.posts ?? 0}</td>
                <td style={{ padding: '12px 16px', color: '#71717a', fontSize: '.75rem' }}>{new Date(u.createdAt).toLocaleDateString('fr-BE')}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditing(u.id); setForm({ name: u.name, email: u.email, role: u.role, password: '' }) }} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem' }}>Éditer</button>
                    <button onClick={() => remove(u.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem' }}>Supprimer</button>
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
