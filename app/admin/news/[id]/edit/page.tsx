'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import NewsForm from '../../components/NewsForm'

export default function EditNewsPage() {
  const params = useParams()
  const itemId = params.id as string

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link href="/admin/news" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to News
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Edit News Article</h1>
          <p>Update this news article</p>
        </div>
      </div>

      <NewsForm itemId={itemId} />
    </div>
  )
}
