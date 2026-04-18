'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'

export default function AdminLoginPage() {
  const { t } = useLang()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t('admin.login.error'))
        return
      }

      // Redirect to admin dashboard
      router.push('/admin')
    } catch (err) {
      console.error('Login failed:', err)
      setError(t('admin.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-main admin-login-container">
      <section className="admin-login-hero">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1 className="admin-login-title">{t('admin.login.title')}</h1>
            <p className="admin-login-subtitle">{t('admin.title')}</p>
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="email" className="admin-form-label">
                {t('admin.login.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-form-input"
                placeholder="admin@example.com"
                disabled={loading}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password" className="admin-form-label">
                {t('admin.login.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-form-input"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? t('admin.loading') : t('admin.login.submit')}
            </button>
          </form>

          <div className="admin-login-footer">
            <p className="admin-login-help">
              DocBel Admin Panel — Single Admin Account Only
            </p>
            <Link href="/" className="admin-login-home-link">
              ← {t('nav.home')}
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, var(--surface-light) 0%, var(--surface) 100%);
        }

        .admin-login-hero {
          width: 100%;
          max-width: 420px;
        }

        .admin-login-card {
          background: var(--surface);
          border-radius: 12px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border);
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .admin-login-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 0.5rem;
        }

        .admin-login-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .admin-login-error {
          background: #fee;
          color: #c33;
          border: 1px solid #fcc;
          border-radius: 6px;
          padding: 0.75rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .admin-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .admin-form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
        }

        .admin-form-input {
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 1rem;
          background: var(--input-bg);
          color: var(--text);
          transition: border-color 0.2s;
        }

        .admin-form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .admin-form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-login-button {
          padding: 0.875rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .admin-login-button:hover:not(:disabled) {
          background: var(--primary-dark);
        }

        .admin-login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-login-footer {
          text-align: center;
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
        }

        .admin-login-help {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0 0 0.75rem;
        }

        .admin-login-home-link {
          font-size: 0.9rem;
          color: var(--primary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .admin-login-home-link:hover {
          color: var(--primary-dark);
        }

        @media (max-width: 900px) {
          .admin-login-container {
            padding: 1rem;
          }

          .admin-login-card {
            padding: 2rem;
          }

          .admin-login-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </main>
  )
}
