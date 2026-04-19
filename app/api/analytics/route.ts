import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const days = parseInt(searchParams.get('days') ?? '30')
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  try {
    const [totalPosts, publishedPosts, totalComments, pendingComments, topPosts, viewsTrend] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.comment.count(),
      prisma.comment.count({ where: { status: 'PENDING' } }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: 10,
        select: { id: true, slug: true, titleFr: true, titleEn: true, viewCount: true, publishedAt: true },
      }),
      prisma.analyticsStat.findMany({
        where: { date: { gte: since } },
        orderBy: { date: 'asc' },
      }),
    ])

    // Group views by date for chart
    const viewsByDay = viewsTrend.reduce((acc: Record<string, number>, stat) => {
      const day = stat.date.toISOString().split('T')[0]
      acc[day] = (acc[day] ?? 0) + stat.views
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: {
        stats: { totalPosts, publishedPosts, totalComments, pendingComments },
        topPosts,
        viewsByDay,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

// Track a page view
export async function POST(req: NextRequest) {
  try {
    const { path, referrer, country, device } = await req.json()
    await prisma.analyticsEvent.create({ data: { path, referrer, country, device } })

    // Upsert daily stat
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    await prisma.analyticsStat.upsert({
      where: { date_path: { date: today, path } },
      update: { views: { increment: 1 } },
      create: { date: today, path, views: 1, uniques: 1 },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 })
  }
}
