'use client'

import Link from 'next/link'
import ToolForm from '../components/ToolForm'

export default function NewToolPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link href="/admin/tools" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Tools
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Create New Tool</h1>
          <p>Add a new tool or calculator to the system</p>
        </div>
      </div>

      <ToolForm />
    </div>
  )
}
