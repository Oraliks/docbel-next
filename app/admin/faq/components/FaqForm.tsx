'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RichEditor from '@/components/RichEditor'

interface FaqFormProps {
  itemId?: string
  categoryId?: string
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

export default function FaqForm({ itemId, categoryId, initialData, onSuccess }: FaqFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [currentLang, setCurrentLang] = useState('fr')
  const [formData, setFormData] = useState({
    categoryId: categoryId || '',
    questionFr: '',
    questionNl: '',
    questionDe: '',
    questionEn: '',
    questionAr: '',
    answerFr: '',
    answerNl: '',
    answerDe: '',
    answerEn: '',
    answerAr: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/faq')
        if (res.ok) {
          const data = await res.json()
          setCategories(data.data || [])
          if (!categoryId && data.data?.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: data.data[0].id }))
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()

    // Load initial data if editing
    if (itemId) {
      loadItemData()
    }
  }, [itemId, categoryId])

  async function loadItemData() {
    try {
      const res = await fetch(`/api/faq/items/${itemId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          categoryId: data.data.categoryId || categoryId || '',
          questionFr: data.data.questionFr || '',
          questionNl: data.data.questionNl || '',
          questionDe: data.data.questionDe || '',
          questionEn: data.data.questionEn || '',
          questionAr: data.data.questionAr || '',
          answerFr: data.data.answerFr || '',
          answerNl: data.data.answerNl || '',
          answerDe: data.data.answerDe || '',
          answerEn: data.data.answerEn || '',
          answerAr: data.data.answerAr || '',
        })
      }
    } catch (err) {
      console.error('Failed to load item:', err)
      setError('Failed to load item data')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const method = itemId ? 'PUT' : 'POST'
      const endpoint = itemId ? `/api/faq/items/${itemId}` : `/api/faq/items`

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to save FAQ item')
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        router.push('/admin/faq')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const langCode = currentLang as keyof typeof formData

  return (
    <form onSubmit={handleSubmit} className="faq-form">
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">✓ Question saved successfully!</div>}

      <div className="form-section">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          value={formData.categoryId}
          onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
          required
          disabled={loading}
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nameFr}
            </option>
          ))}
        </select>
      </div>

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
        <label htmlFor={`question-${currentLang}`}>Question ({LANGUAGES.find(l => l.code === currentLang)?.label}) *</label>
        <input
          id={`question-${currentLang}`}
          type="text"
          value={formData[`question${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}` as keyof typeof formData] || ''}
          onChange={e => {
            const fieldName = `question${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}`
            setFormData(prev => ({ ...prev, [fieldName]: e.target.value }))
          }}
          required
          disabled={loading}
          placeholder="Enter the FAQ question..."
        />
      </div>

      <div className="form-section">
        <label htmlFor={`answer-${currentLang}`}>Answer ({LANGUAGES.find(l => l.code === currentLang)?.label}) *</label>
        <RichEditor
          value={formData[`answer${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}` as keyof typeof formData] as string || ''}
          onChange={(content) => {
            const fieldName = `answer${currentLang.charAt(0).toUpperCase()}${currentLang.slice(1)}`
            setFormData(prev => ({ ...prev, [fieldName]: content }))
          }}
          placeholder="Enter the FAQ answer..."
          disabled={loading}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? '⏳ Saving...' : itemId ? '✓ Update Question' : '➕ Create Question'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/faq')}
          disabled={loading}
          className="btn btn-ghost"
        >
          Cancel
        </button>
      </div>

      <style jsx>{`
        .faq-form {
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
      `}</style>
    </form>
  )
}
