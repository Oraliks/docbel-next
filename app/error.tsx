'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <h1>Error</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
