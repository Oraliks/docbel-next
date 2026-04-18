'use client'

import Link from 'next/link'
import NewsForm from '../components/NewsForm'

export default function NewNewsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link href="/admin/news" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to News
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Create New News Article</h1>
          <p>Add a new news article to the system</p>
        </div>
      </div>

      <NewsForm />
    </div>
  )
}
