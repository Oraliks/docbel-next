'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import GlossaryForm from '../../components/GlossaryForm'

export default function EditGlossaryPage() {
  const params = useParams()
  const itemId = params.id as string

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link href="/admin/glossary" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Glossary
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Edit Glossary Entry</h1>
          <p>Update this glossary term or concept</p>
        </div>
      </div>

      <GlossaryForm itemId={itemId} />
    </div>
  )
}
