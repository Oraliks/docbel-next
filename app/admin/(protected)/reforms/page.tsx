'use client'

import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

export default function AdminReformsPage() {
  const { t } = useLang()

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{t('admin.reforms.manage')}</h1>
        <p>Manage 2025 reform changes, profiles, and timeline</p>
      </div>

      <div className="admin-sections">
        <div className="admin-section">
          <h2>⚡ Reform Changes</h2>
          <p>Before/after changes for the 2025 reform</p>
          <Link href="/api/reforms/changes" className="admin-link">
            Manage Changes →
          </Link>
        </div>

        <div className="admin-section">
          <h2>👥 Impact Profiles</h2>
          <p>User profiles affected by the reform</p>
          <Link href="/api/reforms/profiles" className="admin-link">
            Manage Profiles →
          </Link>
        </div>

        <div className="admin-section">
          <h2>📅 Timeline</h2>
          <p>Important dates and events</p>
          <Link href="/api/reforms/timeline" className="admin-link">
            Manage Timeline →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-page { padding: 0; }
        .admin-page-header { margin-bottom: 2rem; }
        .admin-page-header h1 { font-size: 2rem; margin: 0 0 0.5rem; color: var(--text); }
        .admin-page-header p { margin: 0; color: var(--text-secondary); }
        .admin-sections { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .admin-section { padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; }
        .admin-section h2 { margin: 0 0 0.5rem; color: var(--text); font-size: 1.25rem; }
        .admin-section p { margin: 0 0 1rem; color: var(--text-secondary); font-size: 0.9rem; }
        .admin-link { color: var(--primary); text-decoration: none; font-weight: 600; }
        .admin-link:hover { text-decoration: underline; }
        @supports not (color: var(--primary)) { :root { --primary: #0066cc; --text: #000; --text-secondary: #666; --surface: #f5f5f5; --border: #e0e0e0; } }
      `}</style>
    </div>
  )
}
