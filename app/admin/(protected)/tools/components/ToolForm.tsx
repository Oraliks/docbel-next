'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RichEditor from '@/components/RichEditor'

interface ToolFormProps {
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

const CTA_OPTIONS = ['calc', 'start', 'compare', 'browse', 'soon']

export default function ToolForm({ itemId, initialData, onSuccess }: ToolFormProps) {
  const router = useRouter()
  const [currentLang, setCurrentLang] = useState('fr')
  const [formData, setFormData] = useState({
    titleFr: '',
    titleNl: '',
    titleDe: '',
    titleEn: '',
    titleAr: '',
    descFr: '',
    descNl: '',
    descDe: '',
    descEn: '',
    descAr: '',
    slug: '',
    link: '',
    ctaFr: 'start',
    ctaNl: 'start',
    ctaDe: 'start',
    ctaEn: 'start',
    ctaAr: 'start',
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
      const res = await fetch(`/api/tools/${itemId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          titleFr: data.data.titleFr || '',
          titleNl: data.data.titleNl || '',
          titleDe: data.data.titleDe || '',
          titleEn: data.data.titleEn || '',
          titleAr: data.data.titleAr || '',
          descFr: data.data.descFr || '',
          descNl: data.data.descNl || '',
          descDe: data.data.descDe || '',
          descEn: data.data.descEn || '',
          descAr: data.data.descAr || '',
          slug: data.data.slug || '',
          link: data.data.link || '',
          ctaFr: data.data.ctaFr || 'start',
          ctaNl: data.data.ctaNl || 'start',
          ctaDe: data.data.ctaDe || 'start',
          ctaEn: data.data.ctaEn || 'start',
          ctaAr: data.data.ctaAr || 'start',
        })
      }
    } catch (err) {
      console.error('Failed to load tool:', err)
      setError('Failed to load tool')
    }
  }

  useEffect(() => {
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
      const endpoint = itemId ? `/api/tools/${itemId}` : `/api/tools`

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to save tool')
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        router.push('/admin/tools')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="tool-form">
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">✓ Tool saved successfully!</div>}

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
          placeholder="Enter the tool title..."
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
        <label htmlFor={`desc-${currentLang}`}>Description ({LANGUAGES.find(l => l.code === currentLang)?.label}) *</label>
        <RichEditor
          value={formData[`desc${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}` as keyof typeof formData] as string || ''}
          onChange={(content) => {
            const fieldName = `desc${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}`
            setFormData(prev => ({ ...prev, [fieldName]: content }))
          }}
          placeholder="Enter the tool description..."
          disabled={loading}
          minHeight="200px"
        />
      </div>

      <div className="form-row">
        <div className="form-section">
          <label htmlFor="link">Link / URL</label>
          <input
            id="link"
            type="url"
            value={formData.link}
            onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
            disabled={loading}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-section">
          <label htmlFor="cta">CTA Type ({currentLang})</label>
          <select
            id="cta"
            value={formData[`cta${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}` as keyof typeof formData] || ''}
            onChange={e => {
              const fieldName = `cta${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}`
              setFormData(prev => ({ ...prev, [fieldName]: e.target.value }))
            }}
            disabled={loading}
          >
            {CTA_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? '⏳ Saving...' : itemId ? '✓ Update Tool' : '➕ Create Tool'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/tools')}
          disabled={loading}
          className="btn btn-ghost"
        >
          Cancel
        </button>
      </div>

      <style jsx>{`
        .tool-form {
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
