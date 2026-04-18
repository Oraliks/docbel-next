'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RichEditor from '@/components/RichEditor'

interface GlossaryFormProps {
  itemId?: string
  initialData?: any
  onSuccess?: () => void
}

const CATEGORIES = [
  { value: 'institution', label: '🏛️ Institution' },
  { value: 'form', label: '📋 Form' },
  { value: 'concept', label: '💡 Concept' },
  { value: 'union', label: '🤝 Union' },
]

export default function GlossaryForm({ itemId, initialData, onSuccess }: GlossaryFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    term: '',
    category: 'institution' as string,
    shortFr: '',
    shortNl: '',
    shortDe: '',
    shortEn: '',
    shortAr: '',
    longFr: '',
    longNl: '',
    longDe: '',
    longEn: '',
    longAr: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (itemId) {
      loadItemData()
    }
  }, [itemId])

  async function loadItemData() {
    try {
      const res = await fetch(`/api/glossary/${itemId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          term: data.data.term || '',
          category: data.data.category || 'institution',
          shortFr: data.data.shortFr || '',
          shortNl: data.data.shortNl || '',
          shortDe: data.data.shortDe || '',
          shortEn: data.data.shortEn || '',
          shortAr: data.data.shortAr || '',
          longFr: data.data.longFr || '',
          longNl: data.data.longNl || '',
          longDe: data.data.longDe || '',
          longEn: data.data.longEn || '',
          longAr: data.data.longAr || '',
        })
      }
    } catch (err) {
      console.error('Failed to load glossary entry:', err)
      setError('Failed to load entry')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const method = itemId ? 'PUT' : 'POST'
      const endpoint = itemId ? `/api/glossary/${itemId}` : `/api/glossary`

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to save glossary entry')
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        router.push('/admin/glossary')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glossary-form">
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">✓ Glossary entry saved successfully!</div>}

      <div className="form-section">
        <label htmlFor="term">Term *</label>
        <input
          id="term"
          type="text"
          value={formData.term}
          onChange={e => setFormData(prev => ({ ...prev, term: e.target.value }))}
          required
          disabled={loading}
          placeholder="Enter the term..."
        />
      </div>

      <div className="form-section">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          value={formData.category}
          onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
          required
          disabled={loading}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-tabs">
        <h3>Short Definition (All Languages)</h3>
        <div className="lang-grid">
          <div className="form-section">
            <label htmlFor="short-fr">French</label>
            <textarea
              id="short-fr"
              value={formData.shortFr}
              onChange={e => setFormData(prev => ({ ...prev, shortFr: e.target.value }))}
              required
              disabled={loading}
              placeholder="Short definition in French..."
              rows={2}
            />
          </div>
          <div className="form-section">
            <label htmlFor="short-nl">Dutch</label>
            <textarea
              id="short-nl"
              value={formData.shortNl}
              onChange={e => setFormData(prev => ({ ...prev, shortNl: e.target.value }))}
              disabled={loading}
              placeholder="Short definition in Dutch..."
              rows={2}
            />
          </div>
          <div className="form-section">
            <label htmlFor="short-de">German</label>
            <textarea
              id="short-de"
              value={formData.shortDe}
              onChange={e => setFormData(prev => ({ ...prev, shortDe: e.target.value }))}
              disabled={loading}
              placeholder="Short definition in German..."
              rows={2}
            />
          </div>
          <div className="form-section">
            <label htmlFor="short-en">English</label>
            <textarea
              id="short-en"
              value={formData.shortEn}
              onChange={e => setFormData(prev => ({ ...prev, shortEn: e.target.value }))}
              disabled={loading}
              placeholder="Short definition in English..."
              rows={2}
            />
          </div>
          <div className="form-section">
            <label htmlFor="short-ar">Arabic</label>
            <textarea
              id="short-ar"
              value={formData.shortAr}
              onChange={e => setFormData(prev => ({ ...prev, shortAr: e.target.value }))}
              disabled={loading}
              placeholder="Short definition in Arabic..."
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="form-tabs">
        <h3>Long Definition (All Languages)</h3>
        <div className="form-section">
          <label htmlFor="long-fr">French</label>
          <RichEditor
            value={formData.longFr}
            onChange={content => setFormData(prev => ({ ...prev, longFr: content }))}
            placeholder="Long definition in French..."
            disabled={loading}
            minHeight="200px"
          />
        </div>
        <div className="form-section">
          <label htmlFor="long-nl">Dutch</label>
          <RichEditor
            value={formData.longNl}
            onChange={content => setFormData(prev => ({ ...prev, longNl: content }))}
            placeholder="Long definition in Dutch..."
            disabled={loading}
            minHeight="200px"
          />
        </div>
        <div className="form-section">
          <label htmlFor="long-de">German</label>
          <RichEditor
            value={formData.longDe}
            onChange={content => setFormData(prev => ({ ...prev, longDe: content }))}
            placeholder="Long definition in German..."
            disabled={loading}
            minHeight="200px"
          />
        </div>
        <div className="form-section">
          <label htmlFor="long-en">English</label>
          <RichEditor
            value={formData.longEn}
            onChange={content => setFormData(prev => ({ ...prev, longEn: content }))}
            placeholder="Long definition in English..."
            disabled={loading}
            minHeight="200px"
          />
        </div>
        <div className="form-section">
          <label htmlFor="long-ar">Arabic</label>
          <RichEditor
            value={formData.longAr}
            onChange={content => setFormData(prev => ({ ...prev, longAr: content }))}
            placeholder="Long definition in Arabic..."
            disabled={loading}
            minHeight="200px"
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? '⏳ Saving...' : itemId ? '✓ Update Entry' : '➕ Create Entry'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/glossary')}
          disabled={loading}
          className="btn btn-ghost"
        >
          Cancel
        </button>
      </div>

      <style jsx>{`
        .glossary-form {
          max-width: 900px;
          margin: 0 auto;
          background: var(--surface);
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .form-error {
          background: #fee;
          color: #c33;
          border: 1px solid #fcc;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }

        .form-success {
          background: #efe;
          color: #3c3;
          border: 1px solid #cfc;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }

        .form-section {
          margin-bottom: 1.5rem;
        }

        .form-section label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text);
        }

        .form-section input,
        .form-section select,
        .form-section textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 1rem;
          font-family: inherit;
          background: var(--input-bg);
          color: var(--text);
        }

        .form-section textarea {
          resize: vertical;
        }

        .form-section input:disabled,
        .form-section select:disabled,
        .form-section textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-tabs {
          margin: 2rem 0;
          padding: 1.5rem;
          background: var(--surface-light);
          border-radius: 6px;
          border: 1px solid var(--border);
        }

        .form-tabs h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: var(--text);
        }

        .lang-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          opacity: 0.9;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-ghost {
          background: transparent;
          border: 2px solid var(--border);
          color: var(--text);
        }

        .btn-ghost:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
        }

        .btn-ghost:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  )
}
