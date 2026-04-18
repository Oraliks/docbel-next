'use client'

import Link from 'next/link'
import FaqForm from '../components/FaqForm'

export default function NewFaqPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link href="/admin/faq" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to FAQ
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Create New FAQ Question</h1>
          <p>Add a new frequently asked question to the system</p>
        </div>
      </div>

      <FaqForm />
    </div>
  )
}
