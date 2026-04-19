'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import FaqForm from '../../components/FaqForm'

export default function EditFaqPage() {
  const params = useParams()
  const itemId = params.id as string

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link href="/admin/faq" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to FAQ
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Edit FAQ Question</h1>
          <p>Update this frequently asked question</p>
        </div>
      </div>

      <FaqForm itemId={itemId} />
    </div>
  )
}
