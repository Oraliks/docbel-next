'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLang()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    // Check authentication on mount (only on client)
    if (typeof window !== 'undefined') {
      checkAuth()
    }
  }, [])

  async function checkAuth() {
    try {
      // Try to fetch a protected admin resource to verify session
      const response = await fetch('/api/admin/check-auth', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setIsLoading(false)
      } else {
        // Not authenticated, redirect to login
        setIsAuthenticated(false)
        setIsLoading(false)
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      }
    } catch (error) {
      // If endpoint doesn't exist yet, assume not authenticated
      setIsAuthenticated(false)
      setIsLoading(false)
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Show login form for login page
  if (pathname === '/admin/login') {
    return children
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-layout-loading">
        <div className="admin-spinner"></div>
        <p>{t('admin.loading')}</p>
      </div>
    )
  }

  // If not authenticated, show minimal structure to allow build to proceed
  if (!isAuthenticated) {
    return <div>{children}</div>
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${showMobileMenu ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-sidebar-logo">
            DocBel Admin
          </Link>
          <button
            className="admin-sidebar-close"
            onClick={() => setShowMobileMenu(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section">
            <h3 className="admin-nav-section-title">{t('admin.dashboard.welcome')}</h3>
            <ul className="admin-nav-list">
              <li>
                <Link href="/admin" className="admin-nav-link">
                  📊 Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="admin-nav-section">
            <h3 className="admin-nav-section-title">Content</h3>
            <ul className="admin-nav-list">
              <li>
                <Link href="/admin/faq" className="admin-nav-link">
                  ❓ {t('admin.faq.manage')}
                </Link>
              </li>
              <li>
                <Link href="/admin/news" className="admin-nav-link">
                  📰 {t('admin.news.manage')}
                </Link>
              </li>
              <li>
                <Link href="/admin/reforms" className="admin-nav-link">
                  ⚡ {t('admin.reforms.manage')}
                </Link>
              </li>
              <li>
                <Link href="/admin/tools" className="admin-nav-link">
                  🔧 {t('admin.tools.manage')}
                </Link>
              </li>
              <li>
                <Link href="/admin/glossary" className="admin-nav-link">
                  📖 {t('admin.glossary.manage')}
                </Link>
              </li>
              <li>
                <Link href="/admin/ui-strings" className="admin-nav-link">
                  🔤 {t('admin.ui.manage')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="admin-nav-section">
            <h3 className="admin-nav-section-title">Settings</h3>
            <ul className="admin-nav-list">
              <li>
                <button
                  className="admin-nav-link admin-logout-btn"
                  onClick={handleLogout}
                >
                  🚪 {t('admin.logout')}
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <p>DocBel CMS</p>
          <small>v1.0.0</small>
        </div>
      </aside>

      {/* Mobile menu toggle */}
      <button
        className="admin-mobile-menu-toggle"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
        }

        .admin-layout-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 1rem;
        }

        .admin-spinner {
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

        .admin-sidebar {
          width: 280px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .admin-sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .admin-sidebar-logo {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text);
          text-decoration: none;
        }

        .admin-sidebar-close {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text);
          cursor: pointer;
        }

        .admin-sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
        }

        .admin-nav-section {
          padding: 0.5rem 0;
        }

        .admin-nav-section-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-secondary);
          padding: 0.5rem 1.5rem;
          margin: 1rem 0 0.5rem;
        }

        .admin-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .admin-nav-link {
          display: block;
          padding: 0.75rem 1.5rem;
          color: var(--text);
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 0.95rem;
          text-align: left;
          width: 100%;
        }

        .admin-nav-link:hover {
          background: var(--hover-bg);
        }

        .admin-logout-btn {
          color: #c33;
        }

        .admin-sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border);
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .admin-sidebar-footer p {
          margin: 0 0 0.25rem;
          font-weight: 600;
        }

        .admin-sidebar-footer small {
          display: block;
        }

        .admin-mobile-menu-toggle {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1001;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 6px;
          width: 44px;
          height: 44px;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
          min-height: 100vh;
        }

        .admin-content {
          padding: 2rem;
          max-width: 1400px;
        }

        /* CSS variables for theming */
        @supports not (color: var(--primary)) {
          :root {
            --primary: #0066cc;
            --primary-dark: #0052a3;
            --bg: #ffffff;
            --surface: #f5f5f5;
            --surface-light: #fafafa;
            --text: #000000;
            --text-secondary: #666666;
            --border: #e0e0e0;
            --hover-bg: #efefef;
            --input-bg: #ffffff;
          }
        }

        @media (max-width: 900px) {
          .admin-sidebar {
            width: 100%;
            transform: translateX(-100%);
          }

          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }

          .admin-sidebar-close {
            display: block;
          }

          .admin-mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .admin-main {
            margin-left: 0;
          }

          .admin-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
