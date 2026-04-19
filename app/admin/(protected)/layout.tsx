'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AppSidebar } from '@/components/admin/ui/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/admin/ui/sidebar'
import { Separator } from '@/components/admin/ui/separator'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/admin/ui/breadcrumb'
import '@/app/admin/tailwind.css'

const LABELS: Record<string, string> = {
  posts: 'Articles', media: 'Médias', categories: 'Catégories', tags: 'Tags',
  comments: 'Commentaires', users: 'Utilisateurs', analytics: 'Analytics',
  faq: 'FAQ', news: 'Actualités', reforms: 'Réforme 2025', tools: 'Outils',
  glossary: 'Lexique', 'ui-strings': 'Traductions UI', new: 'Nouveau',
}

function AdminBreadcrumb() {
  const pathname = usePathname()
  // segments after 'admin'
  const segments = pathname.split('/').filter(Boolean).slice(1)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin">Admin</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((seg, i) => (
          <span key={seg} style={{ display: 'contents' }}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {i === segments.length - 1 ? (
                <BreadcrumbPage>{LABELS[seg] ?? seg}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={'/admin/' + segments.slice(0, i + 1).join('/')}>
                    {LABELS[seg] ?? seg}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <AdminBreadcrumb />
        </header>

        {/* Page content */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
