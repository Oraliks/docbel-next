'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b', APPROVED: '#10b981', REJECTED: '#ef4444', SPAM: '#6b7280',
}

export default function CommentsPage() {
  const [status, setStatus] = useState('PENDING')
  const [page, setPage] = useState(1)

  const params = new URLSearchParams({ status, page: String(page), limit: '20' })
  const { data, mutate } = useSWR(`/api/comments?${params}`, fetcher)
  const comments = data?.data ?? []
  const total = data?.total ?? 0

  async function moderate(id: string, newStatus: string) {
    await fetch(`/api/comments/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    mutate()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce commentaire ?')) return
    await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    mutate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ color: '#fafafa', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Commentaires</h1>
        <p style={{ color: '#71717a', fontSize: '.875rem', margin: '4px 0 0' }}>{total} commentaire(s)</p>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #27272a' }}>
        {['PENDING', 'APPROVED', 'REJECTED', 'SPAM'].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }} style={{
            padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: '.8rem', fontWeight: 600,
            background: 'transparent',
            borderBottom: status === s ? `2px solid ${STATUS_COLORS[s]}` : '2px solid transparent',
            color: status === s ? STATUS_COLORS[s] : '#71717a', transition: 'color .1s',
          }}>
            {{ PENDING: 'En attente', APPROVED: 'Approuvés', REJECTED: 'Rejetés', SPAM: 'Spam' }[s]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {comments.length === 0 && (
          <p style={{ color: '#71717a', fontSize: '.875rem', padding: '20px 0' }}>Aucun commentaire dans cette catégorie.</p>
        )}
        {comments.map((c: {
          id: string; body: string; guestName: string | null; guestEmail: string | null;
          author: { name: string; email: string } | null;
          post: { titleFr: string; slug: string }; status: string; createdAt: string;
        }) => (
          <div key={c.id} style={{
            background: '#18181b', border: '1px solid #27272a', borderRadius: 10, padding: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: '#fafafa', fontSize: '.875rem', fontWeight: 500, margin: '0 0 4px' }}>
                  {c.author?.name ?? c.guestName ?? 'Anonyme'}
                  {(c.author?.email ?? c.guestEmail) && (
                    <span style={{ color: '#71717a', fontSize: '.75rem', marginLeft: 8 }}>
                      {c.author?.email ?? c.guestEmail}
                    </span>
                  )}
                </p>
                <p style={{ color: '#a1a1aa', fontSize: '.8rem', margin: '0 0 8px' }}>
                  Sur : <Link href={`/admin/posts/${c.post?.slug}`} style={{ color: '#6366f1' }}>{c.post?.titleFr}</Link>
                  {' · '}{new Date(c.createdAt).toLocaleDateString('fr-BE')}
                </p>
                <p style={{ color: '#d4d4d8', fontSize: '.875rem', margin: 0, lineHeight: 1.6 }}>{c.body}</p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {status !== 'APPROVED' && (
                  <button onClick={() => moderate(c.id, 'APPROVED')} style={actionBtn('#10b981')}>✓ Approuver</button>
                )}
                {status !== 'REJECTED' && (
                  <button onClick={() => moderate(c.id, 'REJECTED')} style={actionBtn('#ef4444')}>✗ Rejeter</button>
                )}
                {status !== 'SPAM' && (
                  <button onClick={() => moderate(c.id, 'SPAM')} style={actionBtn('#6b7280')}>Spam</button>
                )}
                <button onClick={() => remove(c.id)} style={actionBtn('#ef4444', true)}>🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {total > 20 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={pageBtn}>←</button>
          <span style={{ padding: '6px 12px', color: '#71717a', fontSize: '.875rem' }}>Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} style={pageBtn}>→</button>
        </div>
      )}
    </div>
  )
}

const actionBtn = (color: string, ghost = false): React.CSSProperties => ({
  padding: '5px 10px', borderRadius: 6, fontSize: '.75rem', fontWeight: 500, cursor: 'pointer',
  background: ghost ? 'transparent' : color + '20', color,
  border: `1px solid ${color + '40'}`, transition: 'background .1s',
})
const pageBtn: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 6, background: '#27272a', color: '#a1a1aa', border: 'none', cursor: 'pointer',
}
