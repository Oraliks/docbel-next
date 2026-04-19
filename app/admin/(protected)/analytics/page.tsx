'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AnalyticsPage() {
  const [days, setDays] = useState(30)
  const { data } = useSWR(`/api/analytics?days=${days}`, fetcher)
  const stats = data?.data?.stats ?? {}
  const topPosts = data?.data?.topPosts ?? []
  const viewsByDay: Record<string, number> = data?.data?.viewsByDay ?? {}

  const chartData = Object.entries(viewsByDay).map(([date, views]) => ({ date: date.slice(5), views }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: '#fafafa', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Analytics</h1>
          <p style={{ color: '#71717a', fontSize: '.875rem', margin: '4px 0 0' }}>Statistiques de votre contenu</p>
        </div>
        <select value={days} onChange={e => setDays(Number(e.target.value))} style={{ padding: '8px 12px', borderRadius: 8, background: '#18181b', border: '1px solid #27272a', color: '#fafafa', fontSize: '.875rem', outline: 'none' }}>
          <option value={7}>7 derniers jours</option>
          <option value={30}>30 derniers jours</option>
          <option value={90}>90 derniers jours</option>
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {[
          { label: 'Articles total', value: stats.totalPosts ?? '—' },
          { label: 'Publiés', value: stats.publishedPosts ?? '—', color: '#10b981' },
          { label: 'Commentaires', value: stats.totalComments ?? '—' },
          { label: 'En attente', value: stats.pendingComments ?? '—', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: '18px 20px' }}>
            <p style={{ color: '#71717a', fontSize: '.8rem', margin: '0 0 6px' }}>{s.label}</p>
            <p style={{ color: s.color ?? '#fafafa', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Views chart */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: 24 }}>
        <h2 style={{ color: '#fafafa', fontSize: '1rem', fontWeight: 600, margin: '0 0 20px' }}>Vues par jour</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#27272a', border: 'none', borderRadius: 8, color: '#fafafa', fontSize: 12 }} />
              <Area type="monotone" dataKey="views" stroke="#6366f1" fill="url(#aGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', fontSize: '.875rem' }}>
            Aucune donnée de trafic disponible.<br /><span style={{ fontSize: '.75rem' }}>Les vues sont enregistrées via POST /api/analytics</span>
          </div>
        )}
      </div>

      {/* Top posts */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: 24 }}>
        <h2 style={{ color: '#fafafa', fontSize: '1rem', fontWeight: 600, margin: '0 0 16px' }}>Articles les plus vus</h2>
        {topPosts.length === 0 ? (
          <p style={{ color: '#71717a', fontSize: '.875rem' }}>Aucun article publié</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topPosts.slice(0, 8)} layout="vertical">
                <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="titleFr" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={160} />
                <Tooltip contentStyle={{ background: '#27272a', border: 'none', borderRadius: 8, color: '#fafafa', fontSize: 12 }} />
                <Bar dataKey="viewCount" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
              {topPosts.map((p: { id: string; titleFr: string; viewCount: number }, i: number) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#3f3f46', fontSize: '.75rem', width: 18, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <Link href={`/admin/posts/${p.id}`} style={{ color: '#a1a1aa', fontSize: '.8rem', flex: 1, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.titleFr}</Link>
                  <span style={{ color: '#71717a', fontSize: '.75rem', flexShrink: 0 }}>{p.viewCount} vues</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
