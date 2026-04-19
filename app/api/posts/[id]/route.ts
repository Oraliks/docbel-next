import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PostUpdateSchema } from '@/lib/schemas/post'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: { include: { tag: true } },
        versions: { orderBy: { version: 'desc' }, take: 10 },
        _count: { select: { comments: true } },
      },
    })
    if (!post) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: post })
  } catch (err) {
    console.error('GET /api/posts/[id]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    const body = await req.json()
    const data = PostUpdateSchema.parse(body)
    const { tagIds, ...postData } = data

    // Save version before update
    const existing = await prisma.post.findUnique({ where: { id } })
    if (existing) {
      const versionCount = await prisma.postVersion.count({ where: { postId: id } })
      await prisma.postVersion.create({
        data: {
          postId: id,
          version: versionCount + 1,
          bodyFr: existing.bodyFr,
          bodyNl: existing.bodyNl,
          bodyDe: existing.bodyDe,
          bodyEn: existing.bodyEn,
          bodyAr: existing.bodyAr,
        },
      })
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
        publishedAt: postData.status === 'PUBLISHED' && !existing?.publishedAt ? new Date().toISOString() : postData.publishedAt,
        tags: tagIds !== undefined ? {
          deleteMany: {},
          create: tagIds.map(tid => ({ tagId: tid })),
        } : undefined,
      },
    })

    return NextResponse.json({ success: true, data: post })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.flatten() }, { status: 422 })
    }
    console.error('PATCH /api/posts/[id]', err)
    return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/posts/[id]', err)
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 })
  }
}
