import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status')
  const postId = searchParams.get('postId')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  try {
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (postId) where.postId = postId

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          post: { select: { id: true, slug: true, titleFr: true, titleEn: true } },
          author: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.comment.count({ where }),
    ])
    return NextResponse.json({ success: true, data: comments, total, page, limit })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 })
  }
}
