import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PostSchema } from '@/lib/schemas/post'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const status = searchParams.get('status')
    const authorId = searchParams.get('authorId')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('q')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (authorId) where.authorId = authorId
    if (categoryId) where.categoryId = categoryId
    if (search) {
      where.OR = [
        { titleFr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, nameFr: true, nameEn: true } },
          tags: { include: { tag: { select: { id: true, slug: true, nameFr: true, nameEn: true } } } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({ success: true, data: posts, total, page, limit })
  } catch (err) {
    console.error('GET /api/posts', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = PostSchema.parse(body)
    const { tagIds, ...postData } = data

    const post = await prisma.post.create({
      data: {
        ...postData,
        authorId: session.user.id,
        publishedAt: data.status === 'PUBLISHED' && !data.publishedAt ? new Date().toISOString() : data.publishedAt ?? null,
        tags: tagIds?.length ? { create: tagIds.map(id => ({ tagId: id })) } : undefined,
      },
    })

    return NextResponse.json({ success: true, data: post }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.flatten() }, { status: 422 })
    }
    console.error('POST /api/posts', err)
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 })
  }
}
