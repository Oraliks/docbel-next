'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

interface GlossaryEntry {
  id: string
  term: string
  category: string
  shortFr: string
}

export default function AdminGlossaryPage() {
  const { t } = useLang()
  const [entries, setEntries] = useState<GlossaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    try {
      setLoading(true)
      const response = await fetch('/api/glossary')
      const data = await response.json()
      setEntries(data.data || [])
    } catch (err) {
      console.error('Failed to load glossary entries:', err)
      setError('Failed to load glossary entries')
    } finally {
      setLoading(false)
    }
  }

  async function deleteEntry(id: string) {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return
    }

    try {
      const response = await fetch(`/api/glossary/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setEntries(entries.filter(entry => entry.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete entry:', err)
      alert('Failed to delete entry')
    }
  }

  return (
    <div className="admin-glossary-page">
      <div className="admin-page-header">
        <div>
          <h1>{t('admin.glossary.manage')}</h1>
          <p>Manage legal and administrative terms</p>
        </div>
        <Link href="/admin/glossary/new" className="admin-btn-primary">
          ➕ {t('admin.glossary.add')}
        </Link>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>{t('admin.loading')}</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="admin-empty">
          <p>{t('admin.no.items')}</p>
          <Link href="/admin/glossary/new" className="admin-btn-primary">
            ➕ {t('admin.glossary.add')}
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Term</th>
                <th>Category</th>
                <th>Short Definition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td><strong>{entry.term}</strong></td>
                  <td><span className="cat-badge">{entry.category}</span></td>
                  <td><small>{entry.shortFr.substring(0, 100)}...</small></td>
                  <td className="actions">
                    <Link href={`/admin/glossary/${entry.id}/edit`} className="admin-link-btn">
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="admin-link-btn delete"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .admin-glossary-page {
          padding: 0;
        }

        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .admin-page-header h1 {
          font-size: 2rem;
          margin: 0 0 0.5rem;
          color: var(--text);
        }

        .admin-page-header p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .admin-btn-primary {
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          white-space: nowrap;
          transition: background 0.2s;
        }

        .admin-btn-primary:hover {
          background: var(--primary-dark);
        }

        .admin-error {
          background: #fee;
          color: #c33;
          border: 1px solid #fcc;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 1rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .admin-empty {
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
        }

        .admin-empty p {
          margin-bottom: 1rem;
        }

        .admin-table-container {
          overflow-x: auto;
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--surface);
        }

        .admin-table thead {
          background: var(--surface-light);
          border-bottom: 2px solid var(--border);
        }

        .admin-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--text);
          font-size: 0.9rem;
        }

        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          color: var(--text);
        }

        .admin-table tbody tr:hover {
          background: var(--hover-bg);
        }

        .cat-badge {
          display: inline-block;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .admin-link-btn {
          display: inline-block;
          padding: 0.5rem 0.75rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .admin-link-btn:hover {
          background: var(--primary-dark);
        }

        .admin-link-btn.delete {
          background: #c33;
        }

        .admin-link-btn.delete:hover {
          background: #a22;
        }

        @supports not (color: var(--primary)) {
          :root {
            --primary: #0066cc;
            --primary-dark: #0052a3;
            --primary-light: #e6f0ff;
            --text: #000000;
            --text-secondary: #666666;
            --surface: #ffffff;
            --surface-light: #f5f5f5;
            --border: #e0e0e0;
            --hover-bg: #f9f9f9;
          }
        }
      `}</style>
    </div>
  )
}
