import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { CategorySchema } from '@/lib/schemas/category'
import { z } from 'zod'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { orderBy: 'asc' },
      include: {
        children: true,
        _count: { select: { posts: true } },
      },
    })
    return NextResponse.json({ success: true, data: categories })
  } catch (err) {
    console.error('GET /api/categories', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const data = CategorySchema.parse(body)
    const category = await prisma.category.create({ data })
    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ success: false, error: err.flatten() }, { status: 422 })
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}
