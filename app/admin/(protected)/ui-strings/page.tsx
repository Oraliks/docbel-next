'use client'

import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

export default function AdminUiStringsPage() {
  const { t } = useLang()

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>{t('admin.ui.manage')}</h1>
          <p>Manage UI text and translation keys</p>
        </div>
        <Link href="/admin/ui-strings/new" className="admin-btn-primary">
          ➕ {t('admin.ui.add')}
        </Link>
      </div>

      <div className="admin-placeholder">
        <h2>Coming Soon</h2>
        <p>UI strings management interface is under development.</p>
        <p>
          You can manage UI strings through the <code>/api/ui-strings</code> API endpoint.
        </p>
      </div>

      <style jsx>{`
        .admin-page { padding: 0; }
        .admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 1rem; }
        .admin-page-header h1 { font-size: 2rem; margin: 0 0 0.5rem; color: var(--text); }
        .admin-page-header p { margin: 0; color: var(--text-secondary); }
        .admin-btn-primary { padding: 0.75rem 1.5rem; background: var(--primary); color: white; border-radius: 6px; text-decoration: none; font-weight: 600; }
        .admin-placeholder { text-align: center; padding: 3rem; background: var(--surface); border-radius: 8px; color: var(--text-secondary); }
        code { background: var(--border); padding: 0.25rem 0.5rem; border-radius: 3px; }
        @supports not (color: var(--primary)) { :root { --primary: #0066cc; --text: #000; --text-secondary: #666; --surface: #f5f5f5; --border: #e0e0e0; } }
      `}</style>
    </div>
  )
}
