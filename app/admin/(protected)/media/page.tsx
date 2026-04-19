'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { useDropzone } from 'react-dropzone'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MediaPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const params = new URLSearchParams({ page: String(page), limit: '40' })
  if (type) params.set('type', type)

  const { data, mutate } = useSWR(`/api/media?${params}`, fetcher)
  const items = data?.data ?? []
  const total = data?.total ?? 0

  const onDrop = useCallback(async (files: File[]) => {
    setUploading(true)
    for (const file of files) {
      // In production: upload to cloud storage (S3/Cloudflare R2/etc.)
      // For now we store a local object URL as placeholder
      const url = URL.createObjectURL(file)
      await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          url,
          mimeType: file.type,
          size: file.size,
        }),
      })
    }
    setUploading(false)
    mutate()
  }, [mutate])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    multiple: true,
  })

  async function remove(id: string) {
    if (!confirm('Supprimer ce fichier ?')) return
    await fetch(`/api/media/${id}`, { method: 'DELETE' })
    if (selected === id) setSelected(null)
    mutate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: '#fafafa', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Médiathèque</h1>
          <p style={{ color: '#71717a', fontSize: '.875rem', margin: '4px 0 0' }}>{total} fichier(s)</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={type} onChange={e => setType(e.target.value)} style={selectStyle}>
            <option value="">Tous les types</option>
            <option value="image">Images</option>
            <option value="application/pdf">PDF</option>
          </select>
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} style={btnStyle}>
            {view === 'grid' ? '☰ Liste' : '⊞ Grille'}
          </button>
        </div>
      </div>

      {/* Dropzone */}
      <div {...getRootProps()} style={{
        border: `2px dashed ${isDragActive ? '#6366f1' : '#27272a'}`,
        borderRadius: 12, padding: '32px 24px', textAlign: 'center',
        background: isDragActive ? 'rgba(99,102,241,.05)' : '#18181b',
        cursor: 'pointer', transition: 'all .2s',
      }}>
        <input {...getInputProps()} />
        {uploading ? (
          <p style={{ color: '#6366f1', fontSize: '.875rem', margin: 0 }}>Téléversement en cours…</p>
        ) : (
          <>
            <p style={{ color: '#a1a1aa', fontSize: '1rem', margin: '0 0 4px' }}>📁 Déposez vos fichiers ici</p>
            <p style={{ color: '#71717a', fontSize: '.8rem', margin: 0 }}>ou cliquez pour sélectionner — images, PDF</p>
          </>
        )}
      </div>

      {/* Grid / List */}
      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {items.map((m: { id: string; filename: string; url: string; mimeType: string; size: number }) => (
            <div
              key={m.id}
              onClick={() => setSelected(selected === m.id ? null : m.id)}
              style={{
                background: '#18181b', border: `1px solid ${selected === m.id ? '#6366f1' : '#27272a'}`,
                borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .1s',
              }}
            >
              {m.mimeType.startsWith('image') ? (
                <img src={m.url} alt={m.filename} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📄</div>
              )}
              <div style={{ padding: '8px 10px' }}>
                <p style={{ color: '#a1a1aa', fontSize: '.7rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.filename}</p>
                <p style={{ color: '#52525b', fontSize: '.65rem', margin: '2px 0 0' }}>{(m.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, overflow: 'hidden' }}>
          {items.map((m: { id: string; filename: string; url: string; mimeType: string; size: number; createdAt: string }, i: number) => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px',
              borderBottom: i < items.length - 1 ? '1px solid #27272a' : 'none',
            }}>
              <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 6, overflow: 'hidden', background: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.mimeType.startsWith('image') ? (
                  <img src={m.url} alt={m.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <span>📄</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fafafa', fontSize: '.875rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.filename}</p>
                <p style={{ color: '#71717a', fontSize: '.75rem', margin: 0 }}>{m.mimeType} · {(m.size / 1024).toFixed(0)} KB</p>
              </div>
              <button onClick={() => remove(m.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4, fontSize: '.875rem' }}>🗑</button>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: '#71717a', textAlign: 'center', padding: 32, fontSize: '.875rem' }}>Aucun fichier</p>}
        </div>
      )}

      {total > 40 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={pageBtn}>←</button>
          <span style={{ padding: '6px 12px', color: '#71717a', fontSize: '.875rem' }}>Page {page} / {Math.ceil(total / 40)}</span>
          <button disabled={page >= Math.ceil(total / 40)} onClick={() => setPage(p => p + 1)} style={pageBtn}>→</button>
        </div>
      )}
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 8, background: '#18181b', border: '1px solid #27272a',
  color: '#fafafa', fontSize: '.875rem', outline: 'none',
}
const btnStyle: React.CSSProperties = {
  padding: '8px 14px', borderRadius: 8, background: '#27272a', color: '#a1a1aa',
  border: '1px solid #3f3f46', fontSize: '.875rem', cursor: 'pointer',
}
const pageBtn: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 6, background: '#27272a', color: '#a1a1aa', border: 'none', cursor: 'pointer',
}
