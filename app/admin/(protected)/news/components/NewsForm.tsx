'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RichEditor from '@/components/RichEditor'

interface NewsFormProps {
  itemId?: string
  initialData?: any
  onSuccess?: () => void
}

const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
]

export default function NewsForm({ itemId, initialData, onSuccess }: NewsFormProps) {
  const router = useRouter()
  const [currentLang, setCurrentLang] = useState('fr')
  const [formData, setFormData] = useState({
    titleFr: '',
    titleNl: '',
    titleDe: '',
    titleEn: '',
    titleAr: '',
    bodyFr: '',
    bodyNl: '',
    bodyDe: '',
    bodyEn: '',
    bodyAr: '',
    slug: '',
    tags: '',
    featuredAt: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Load initial data if editing
  useEffect(() => {
    if (itemId) {
      loadItemData()
    }
  }, [itemId])

  async function loadItemData() {
    try {
      const res = await fetch(`/api/news/${itemId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          titleFr: data.data.titleFr || '',
          titleNl: data.data.titleNl || '',
          titleDe: data.data.titleDe || '',
          titleEn: data.data.titleEn || '',
          titleAr: data.data.titleAr || '',
          bodyFr: data.data.bodyFr || '',
          bodyNl: data.data.bodyNl || '',
          bodyDe: data.data.bodyDe || '',
          bodyEn: data.data.bodyEn || '',
          bodyAr: data.data.bodyAr || '',
          slug: data.data.slug || '',
          tags: data.data.tags || '',
          featuredAt: data.data.featuredAt ? data.data.featuredAt.split('T')[0] : '',
        })
      }
    } catch (err) {
      console.error('Failed to load item:', err)
      setError('Failed to load news item')
    }
  }

  // Auto-generate slug from title
  useEffect(() => {
    const langCode = currentLang as keyof typeof formData
    const title = formData[`title${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}` as keyof typeof formData] as string
    if (title && !itemId) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.titleFr, formData.titleNl, formData.titleDe, formData.titleEn, formData.titleAr, currentLang, itemId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const method = itemId ? 'PUT' : 'POST'
      const endpoint = itemId ? `/api/news/${itemId}` : `/api/news`

      const dataToSend = {
        ...formData,
        featuredAt: formData.featuredAt ? `${formData.featuredAt}T00:00:00Z` : null,
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      if (!res.ok) {
        throw new Error('Failed to save news item')
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        router.push('/admin/news')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="news-form">
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">✓ News item saved successfully!</div>}

      <div className="form-section">
        <div className="lang-tabs">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              className={`lang-tab ${currentLang === lang.code ? 'active' : ''}`}
              onClick={() => setCurrentLang(lang.code)}
              disabled={loading}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <label htmlFor={`title-${currentLang}`}>Title ({LANGUAGES.find(l => l.code === currentLang)?.label}) *</label>
        <input
          id={`title-${currentLang}`}
          type="text"
          value={formData[`title${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}` as keyof typeof formData] || ''}
          onChange={e => {
            const fieldName = `title${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}`
            setFormData(prev => ({ ...prev, [fieldName]: e.target.value }))
          }}
          required
          disabled={loading}
          placeholder="Enter the news title..."
        />
      </div>

      <div className="form-section">
        <label htmlFor="slug">Slug *</label>
        <input
          id="slug"
          type="text"
          value={formData.slug}
          onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          required
          disabled={loading}
          placeholder="Auto-generated from title"
        />
      </div>

      <div className="form-section">
        <label htmlFor={`body-${currentLang}`}>Content ({LANGUAGES.find(l => l.code === currentLang)?.label}) *</label>
        <RichEditor
          value={formData[`body${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}` as keyof typeof formData] as string || ''}
          onChange={(content) => {
            const fieldName = `body${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}`
            setFormData(prev => ({ ...prev, [fieldName]: content }))
          }}
          placeholder="Enter the news content..."
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-section">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            value={formData.tags}
            onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            disabled={loading}
            placeholder="e.g., reform, info, alert"
          />
        </div>

        <div className="form-section">
          <label htmlFor="featured">Featured Date</label>
          <input
            id="featured"
            type="date"
            value={formData.featuredAt}
            onChange={e => setFormData(prev => ({ ...prev, featuredAt: e.target.value }))}
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? '⏳ Saving...' : itemId ? '✓ Update News' : '➕ Create News'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/news')}
          disabled={loading}
          className="btn btn-ghost"
        >
          Cancel
        </button>
      </div>

      <style jsx>{`
        .news-form {
          max-width: 700px;
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-section label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text);
        }

        .form-section input,
        .form-section select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 1rem;
          font-family: inherit;
          background: var(--input-bg);
          color: var(--text);
        }

        .form-section input:disabled,
        .form-section select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lang-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .lang-tab {
          padding: 0.5rem 1rem;
          border: 2px solid var(--border);
          background: var(--surface-light);
          color: var(--text);
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .lang-tab.active {
          border-color: var(--primary);
          background: var(--primary);
          color: white;
        }

        .lang-tab:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  )
}
