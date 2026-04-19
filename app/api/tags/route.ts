import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { TagSchema } from '@/lib/schemas/tag'
import { z } from 'zod'

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { nameFr: 'asc' },
      include: { _count: { select: { posts: true } } },
    })
    return NextResponse.json({ success: true, data: tags })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch tags' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  try {
    const data = TagSchema.parse(await req.json())
    const tag = await prisma.tag.create({ data })
    return NextResponse.json({ success: true, data: tag }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ success: false, error: err.flatten() }, { status: 422 })
    return NextResponse.json({ success: false, error: 'Failed to create tag' }, { status: 500 })
  }
}
