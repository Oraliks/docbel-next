'use client'

import { useState, Suspense } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#71717a', PUBLISHED: '#10b981', SCHEDULED: '#f59e0b', ARCHIVED: '#ef4444',
}
const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon', PUBLISHED: 'Publié', SCHEDULED: 'Planifié', ARCHIVED: 'Archivé',
}

function PostsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState(searchParams.get('status') ?? '')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])

  const params = new URLSearchParams({ page: String(page), limit: '20' })
  if (status) params.set('status', status)
  if (search) params.set('q', search)

  const { data, mutate } = useSWR(`/api/posts?${params}`, fetcher)
  const posts = data?.data ?? []
  const total = data?.total ?? 0

  async function deletePosts(ids: string[]) {
    if (!confirm(`Supprimer ${ids.length} article(s) ?`)) return
    await Promise.all(ids.map(id => fetch(`/api/posts/${id}`, { method: 'DELETE' })))
    setSelected([])
    mutate()
  }

  const toggleSelect = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: '#fafafa', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Articles</h1>
          <p style={{ color: '#71717a', fontSize: '.875rem', margin: '4px 0 0' }}>{total} article(s)</p>
        </div>
        <Link href="/admin/posts/new" style={{
          padding: '9px 18px', borderRadius: 8, background: '#6366f1', color: '#fff',
          fontWeight: 600, fontSize: '.875rem', textDecoration: 'none',
        }}>
          + Nouvel article
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="search" placeholder="Rechercher…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={{
            padding: '8px 14px', borderRadius: 8, background: '#18181b',
            border: '1px solid #27272a', color: '#fafafa', fontSize: '.875rem', outline: 'none', minWidth: 200,
          }}
        />
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          style={{
            padding: '8px 14px', borderRadius: 8, background: '#18181b',
            border: '1px solid #27272a', color: '#fafafa', fontSize: '.875rem', outline: 'none',
          }}
        >
          <option value="">Tous les statuts</option>
          <option value="DRAFT">Brouillons</option>
          <option value="PUBLISHED">Publiés</option>
          <option value="SCHEDULED">Planifiés</option>
          <option value="ARCHIVED">Archivés</option>
        </select>

        {selected.length > 0 && (
          <button
            onClick={() => deletePosts(selected)}
            style={{
              padding: '8px 14px', borderRadius: 8, background: 'rgba(239,68,68,.15)',
              border: '1px solid rgba(239,68,68,.3)', color: '#f87171',
              fontSize: '.875rem', cursor: 'pointer',
            }}
          >
            Supprimer ({selected.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #27272a' }}>
              <th style={{ padding: '10px 16px', width: 40 }}>
                <input type="checkbox"
                  checked={selected.length === posts.length && posts.length > 0}
                  onChange={e => setSelected(e.target.checked ? posts.map((p: { id: string }) => p.id) : [])}
                />
              </th>
              {['Titre', 'Statut', 'Auteur', 'Catégorie', 'Commentaires', 'Modifié', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', color: '#71717a', fontSize: '.75rem', fontWeight: 600, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: '#71717a', fontSize: '.875rem' }}>
                  Aucun article trouvé
                </td>
              </tr>
            )}
            {posts.map((post: {
              id: string; titleFr: string; titleEn: string; status: string;
              author: { name: string }; category: { nameFr: string } | null;
              _count: { comments: number }; updatedAt: string;
            }) => (
              <tr key={post.id} style={{ borderBottom: '1px solid #27272a', transition: 'background .1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <input type="checkbox" checked={selected.includes(post.id)} onChange={() => toggleSelect(post.id)} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/admin/posts/${post.id}`} style={{ color: '#fafafa', textDecoration: 'none', fontWeight: 500, fontSize: '.875rem' }}>
                    {post.titleFr || post.titleEn || '(sans titre)'}
                  </Link>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '2px 8px', borderRadius: 999, fontSize: '.7rem', fontWeight: 600,
                    background: STATUS_COLORS[post.status] + '20', color: STATUS_COLORS[post.status],
                  }}>
                    {STATUS_LABELS[post.status] ?? post.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#a1a1aa', fontSize: '.8rem' }}>{post.author?.name ?? '—'}</td>
                <td style={{ padding: '12px 16px', color: '#71717a', fontSize: '.8rem' }}>{post.category?.nameFr ?? '—'}</td>
                <td style={{ padding: '12px 16px', color: '#71717a', fontSize: '.8rem' }}>{post._count?.comments ?? 0}</td>
                <td style={{ padding: '12px 16px', color: '#71717a', fontSize: '.75rem' }}>
                  {new Date(post.updatedAt).toLocaleDateString('fr-BE')}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/admin/posts/${post.id}`} style={{ color: '#6366f1', fontSize: '.8rem', textDecoration: 'none' }}>Éditer</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 12px', borderRadius: 6, background: '#27272a', color: '#a1a1aa', border: 'none', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>←</button>
          <span style={{ padding: '6px 12px', color: '#71717a', fontSize: '.875rem' }}>Page {page} / {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 12px', borderRadius: 6, background: '#27272a', color: '#a1a1aa', border: 'none', cursor: 'pointer' }}>→</button>
        </div>
      )}
    </div>
  )
}

export default function PostsPage() {
  return (
    <Suspense fallback={<div style={{ color: '#71717a', padding: 40, textAlign: 'center' }}>Chargement…</div>}>
      <PostsContent />
    </Suspense>
  )
}
