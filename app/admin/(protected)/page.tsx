'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function StatCard({ label, value, sub, href, color = '#6366f1' }: {
  label: string; value: number | string; sub?: string; href?: string; color?: string
}) {
  const content = (
    <div style={{
      background: '#18181b', border: '1px solid #27272a', borderRadius: 12,
      padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4,
      transition: 'border-color .15s',
    }}>
      <p style={{ color: '#71717a', fontSize: '.8rem', fontWeight: 500, margin: 0 }}>{label}</p>
      <p style={{ color: '#fafafa', fontSize: '1.75rem', fontWeight: 700, margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ color: color, fontSize: '.75rem', margin: 0 }}>{sub}</p>}
    </div>
  )
  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link> : content
}

export default function AdminDashboard() {
  const { data } = useSWR('/api/analytics?days=30', fetcher)
  const stats = data?.data?.stats ?? {}
  const topPosts = data?.data?.topPosts ?? []
  const viewsByDay: Record<string, number> = data?.data?.viewsByDay ?? {}
  const chartData = Object.entries(viewsByDay).slice(-14).map(([date, views]) => ({
    date: date.slice(5), views,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ color: '#fafafa', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px' }}>Dashboard</h1>
        <p style={{ color: '#71717a', fontSize: '.875rem', margin: 0 }}>Vue d'ensemble du CMS DocBel</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="Articles publiés" value={stats.publishedPosts ?? '—'} sub={`/ ${stats.totalPosts ?? '—'} total`} href="/admin/posts?status=PUBLISHED" />
        <StatCard label="Brouillons" value={stats.totalPosts != null ? stats.totalPosts - stats.publishedPosts : '—'} href="/admin/posts?status=DRAFT" color="#f59e0b" />
        <StatCard label="Commentaires" value={stats.totalComments ?? '—'} sub={stats.pendingComments ? `${stats.pendingComments} en attente` : undefined} href="/admin/comments" color="#10b981" />
        <StatCard label="En attente" value={stats.pendingComments ?? '—'} href="/admin/comments?status=PENDING" color="#ef4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        {/* Chart */}
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: 24 }}>
          <h2 style={{ color: '#fafafa', fontSize: '1rem', fontWeight: 600, margin: '0 0 20px' }}>Vues — 14 derniers jours</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#27272a', border: 'none', borderRadius: 8, color: '#fafafa', fontSize: 12 }} />
                <Area type="monotone" dataKey="views" stroke="#6366f1" fill="url(#viewsGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', fontSize: '.875rem' }}>
              Aucune donnée pour la période
            </div>
          )}
        </div>

        {/* Top posts */}
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: 24 }}>
          <h2 style={{ color: '#fafafa', fontSize: '1rem', fontWeight: 600, margin: '0 0 16px' }}>Top Articles</h2>
          {topPosts.length === 0 ? (
            <p style={{ color: '#71717a', fontSize: '.875rem' }}>Aucun article publié</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topPosts.slice(0, 7).map((p: { id: string; titleFr: string; titleEn: string; viewCount: number; slug: string }, i: number) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#3f3f46', fontSize: '.75rem', fontWeight: 700, width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <Link href={`/admin/posts/${p.id}`} style={{ color: '#a1a1aa', fontSize: '.8rem', textDecoration: 'none', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.titleFr || p.titleEn}
                  </Link>
                  <span style={{ color: '#71717a', fontSize: '.75rem', flexShrink: 0 }}>{p.viewCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { href: '/admin/posts/new', label: '+ Nouvel article', primary: true },
          { href: '/admin/media', label: '📎 Médias' },
          { href: '/admin/comments?status=PENDING', label: '💬 Modérer' },
          { href: '/admin/faq', label: '❓ FAQ' },
          { href: '/admin/news', label: '📰 Actualités' },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{
            padding: '9px 18px', borderRadius: 8,
            background: a.primary ? '#6366f1' : '#27272a',
            color: a.primary ? '#fff' : '#a1a1aa',
            fontWeight: 500, fontSize: '.875rem', textDecoration: 'none',
            transition: 'background .15s',
          }}>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
