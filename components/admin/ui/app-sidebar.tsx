'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  LayoutDashboard, BarChart3, FileText, Image, FolderOpen, Tag,
  MessageSquare, Users, HelpCircle, Newspaper, Zap, Wrench,
  BookOpen, Languages, LogOut, ExternalLink, ChevronRight,
} from 'lucide-react'

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
  SidebarRail,
} from '@/components/admin/ui/sidebar'
import {
  Avatar, AvatarFallback,
} from '@/components/admin/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/admin/ui/dropdown-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/admin/ui/collapsible'

const NAV = [
  {
    label: 'Général',
    items: [
      { href: '/admin',           icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { href: '/admin/analytics', icon: BarChart3,       label: 'Analytics' },
    ],
  },
  {
    label: 'CMS',
    items: [
      { href: '/admin/posts',      icon: FileText,       label: 'Articles' },
      { href: '/admin/media',      icon: Image,          label: 'Médias' },
      { href: '/admin/categories', icon: FolderOpen,     label: 'Catégories' },
      { href: '/admin/tags',       icon: Tag,            label: 'Tags' },
      { href: '/admin/comments',   icon: MessageSquare,  label: 'Commentaires' },
    ],
  },
  {
    label: 'DocBel',
    items: [
      { href: '/admin/faq',        icon: HelpCircle,  label: 'FAQ' },
      { href: '/admin/news',       icon: Newspaper,   label: 'Actualités' },
      { href: '/admin/reforms',    icon: Zap,         label: 'Réforme 2025' },
      { href: '/admin/tools',      icon: Wrench,      label: 'Outils' },
      { href: '/admin/glossary',   icon: BookOpen,    label: 'Lexique' },
      { href: '/admin/ui-strings', icon: Languages,   label: 'Traductions UI' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { href: '/admin/users', icon: Users, label: 'Utilisateurs' },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = useSession()

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      {/* ── Header / Logo ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">
                  DB
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">DocBel</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent>
        {NAV.map(section => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map(item => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href, item.exact)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter>
        <SidebarMenu>
          {/* View site */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/" target="_blank" rel="noopener">
                <ExternalLink />
                <span>Voir le site</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User dropdown */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-indigo-600 text-white text-xs">
                      {(session?.user?.name ?? session?.user?.email ?? 'A').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{session?.user?.name ?? 'Admin'}</span>
                    <span className="truncate text-xs text-muted-foreground">{session?.user?.email ?? ''}</span>
                  </div>
                  <ChevronRight className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 size-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
