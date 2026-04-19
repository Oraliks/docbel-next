'use client'

import { SessionProvider } from 'next-auth/react'

// Root admin layout: just wraps with NextAuth SessionProvider.
// Actual UI (sidebar, topbar) lives in (protected)/layout.tsx
// Login page (bare) lives in (auth)/layout.tsx
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
