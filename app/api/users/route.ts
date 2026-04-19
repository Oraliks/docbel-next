import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserSchema } from '@/lib/schemas/user'
import { hash } from 'bcryptjs'
import { z } from 'zod'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, image: true, createdAt: true, _count: { select: { posts: true } } },
    })
    return NextResponse.json({ success: true, data: users })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const data = UserSchema.parse(body)
    const passwordHash = data.password ? await hash(data.password, 12) : undefined
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        passwordHash,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ success: false, error: err.flatten() }, { status: 422 })
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
  }
}
