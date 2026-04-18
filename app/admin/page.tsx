'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface AdminStats {
  faqCount?: number
  newsCount?: number
  toolsCount?: number
  glossaryCount?: number
}

export default function AdminDashboard() {
  const { t } = useLang()
  const [stats, setStats] = useState<AdminStats>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard stats
    loadStats()
  }, [])

  async function loadStats() {
    try {
      setLoading(true)
      const [faqRes, newsRes, toolsRes, glossaryRes] = await Promise.all([
        fetch('/api/faq'),
        fetch('/api/news'),
        fetch('/api/tools'),
        fetch('/api/glossary'),
      ])

      let faqCount = 0
      let newsCount = 0
      let toolsCount = 0
      let glossaryCount = 0

      if (faqRes.ok) {
        const faqData = await faqRes.json()
        faqCount = faqData.data?.reduce((total: number, cat: any) => total + (cat.items?.length || 0), 0) || 0
      }

      if (newsRes.ok) {
        const newsData = await newsRes.json()
        newsCount = newsData.data?.length || 0
      }

      if (toolsRes.ok) {
        const toolsData = await toolsRes.json()
        toolsCount = toolsData.data?.length || 0
      }

      if (glossaryRes.ok) {
        const glossaryData = await glossaryRes.json()
        glossaryCount = glossaryData.data?.length || 0
      }

      setStats({
        faqCount,
        newsCount,
        toolsCount,
        glossaryCount,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>{t('admin.dashboard.welcome')}</h1>
        <p>Manage all DocBel content from here</p>
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>{t('admin.loading')}</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon">❓</div>
              <div className="admin-stat-content">
                <h3>FAQ Items</h3>
                <p className="admin-stat-number">{stats.faqCount || 0}</p>
                <p className="admin-stat-label">{t('admin.faq.manage')}</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">📰</div>
              <div className="admin-stat-content">
                <h3>News Articles</h3>
                <p className="admin-stat-number">{stats.newsCount || 0}</p>
                <p className="admin-stat-label">{t('admin.news.manage')}</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">🔧</div>
              <div className="admin-stat-content">
                <h3>Tools</h3>
                <p className="admin-stat-number">{stats.toolsCount || 0}</p>
                <p className="admin-stat-label">{t('admin.tools.manage')}</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">📖</div>
              <div className="admin-stat-content">
                <h3>Glossary Terms</h3>
                <p className="admin-stat-number">{stats.glossaryCount || 0}</p>
                <p className="admin-stat-label">{t('admin.glossary.manage')}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="admin-quick-actions">
            <h2>Quick Actions</h2>
            <div className="admin-action-grid">
              <a href="/admin/faq" className="admin-action-card">
                <span className="admin-action-icon">➕</span>
                <span className="admin-action-text">{t('admin.faq.add')}</span>
              </a>
              <a href="/admin/news" className="admin-action-card">
                <span className="admin-action-icon">➕</span>
                <span className="admin-action-text">{t('admin.news.add')}</span>
              </a>
              <a href="/admin/tools" className="admin-action-card">
                <span className="admin-action-icon">➕</span>
                <span className="admin-action-text">{t('admin.tools.add')}</span>
              </a>
              <a href="/admin/glossary" className="admin-action-card">
                <span className="admin-action-icon">➕</span>
                <span className="admin-action-text">{t('admin.glossary.add')}</span>
              </a>
            </div>
          </div>

          {/* Welcome Box */}
          <div className="admin-welcome-box">
            <h2>Getting Started</h2>
            <p>Welcome to DocBel Admin Panel. Use the sidebar to navigate between different content sections.</p>
            <p>
              <strong>Next Steps:</strong>
            </p>
            <ul>
              <li>Set up your first FAQ category and questions</li>
              <li>Add news articles</li>
              <li>Configure reform details and user profiles</li>
              <li>Create glossary entries for legal terms</li>
            </ul>
          </div>
        </>
      )}

      <style jsx>{`
        .admin-dashboard {
          padding: 0;
        }

        .admin-dashboard-header {
          margin-bottom: 2rem;
        }

        .admin-dashboard-header h1 {
          font-size: 2rem;
          margin: 0 0 0.5rem;
          color: var(--text);
        }

        .admin-dashboard-header p {
          margin: 0;
          color: var(--text-secondary);
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
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

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .admin-stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
        }

        .admin-stat-icon {
          font-size: 2rem;
          line-height: 1;
        }

        .admin-stat-content {
          flex: 1;
        }

        .admin-stat-content h3 {
          margin: 0 0 0.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .admin-stat-number {
          margin: 0.5rem 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary);
        }

        .admin-stat-label {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .admin-quick-actions {
          margin-bottom: 2rem;
        }

        .admin-quick-actions h2 {
          margin: 0 0 1rem;
          font-size: 1.25rem;
          color: var(--text);
        }

        .admin-action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }

        .admin-action-card {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.5rem;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
          font-weight: 600;
        }

        .admin-action-card:hover {
          background: var(--primary-dark);
        }

        .admin-action-icon {
          font-size: 1.25rem;
        }

        .admin-action-text {
          flex: 1;
          text-align: left;
        }

        .admin-welcome-box {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
        }

        .admin-welcome-box h2 {
          margin: 0 0 1rem;
          font-size: 1.25rem;
          color: var(--text);
        }

        .admin-welcome-box p {
          margin: 0 0 1rem;
          color: var(--text);
          line-height: 1.6;
        }

        .admin-welcome-box ul {
          margin: 0;
          padding-left: 1.5rem;
          color: var(--text);
        }

        .admin-welcome-box li {
          margin-bottom: 0.5rem;
        }

        /* CSS variable fallbacks */
        @supports not (color: var(--primary)) {
          :root {
            --primary: #0066cc;
            --primary-dark: #0052a3;
            --text: #000000;
            --text-secondary: #666666;
            --surface: #f5f5f5;
            --border: #e0e0e0;
          }
        }
      `}</style>
    </div>
  )
}
