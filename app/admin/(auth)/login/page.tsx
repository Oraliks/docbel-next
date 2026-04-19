'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Email ou mot de passe incorrect')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#09090b', fontFamily: 'var(--font-inter, sans-serif)',
    }}>
      <div style={{
        background: '#18181b', border: '1px solid #27272a', borderRadius: 12,
        padding: '40px 48px', width: '100%', maxWidth: 400,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: '#6366f1', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 auto 16px',
          }}>DB</div>
          <h1 style={{ color: '#fafafa', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            DocBel Admin
          </h1>
          <p style={{ color: '#71717a', fontSize: '.875rem', marginTop: 4 }}>
            Connectez-vous pour continuer
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '.8rem', marginBottom: 6, fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                background: '#09090b', border: '1px solid #27272a',
                color: '#fafafa', fontSize: '.875rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '.8rem', marginBottom: 6, fontWeight: 500 }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                background: '#09090b', border: '1px solid #27272a',
                color: '#fafafa', fontSize: '.875rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '.8rem', textAlign: 'center', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px', borderRadius: 8, background: loading ? '#4f46e5' : '#6366f1',
              color: '#fff', fontWeight: 600, fontSize: '.875rem', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, transition: 'background .15s',
            }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
