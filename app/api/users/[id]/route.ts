import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserUpdateSchema } from '@/lib/schemas/user'
import { hash } from 'bcryptjs'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const body = await req.json()
    const data = UserUpdateSchema.parse(body)
    const updateData: Record<string, unknown> = { ...data }
    if (data.password) {
      updateData.passwordHash = await hash(data.password, 12)
      delete updateData.password
    }
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json({ success: true, data: user })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ success: false, error: err.flatten() }, { status: 422 })
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  if (id === session.user.id) {
    return NextResponse.json({ success: false, error: 'Cannot delete yourself' }, { status: 400 })
  }
  try {
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 })
  }
}
