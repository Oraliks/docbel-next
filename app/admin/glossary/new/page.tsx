'use client'

import Link from 'next/link'
import GlossaryForm from '../components/GlossaryForm'

export default function NewGlossaryPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link href="/admin/glossary" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Glossary
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Create New Glossary Entry</h1>
          <p>Add a new legal term or concept to the glossary</p>
        </div>
      </div>

      <GlossaryForm />
    </div>
  )
}
