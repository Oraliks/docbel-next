'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import ToolForm from '../../components/ToolForm'

export default function EditToolPage() {
  const params = useParams()
  const itemId = params.id as string

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link href="/admin/tools" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Tools
          </Link>
          <h1 style={{ marginTop: '0.5rem' }}>Edit Tool</h1>
          <p>Update this tool or calculator</p>
        </div>
      </div>

      <ToolForm itemId={itemId} />
    </div>
  )
}
