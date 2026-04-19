import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { TagUpdateSchema } from '@/lib/schemas/tag'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const data = TagUpdateSchema.parse(await req.json())
    const tag = await prisma.tag.update({ where: { id }, data })
    return NextResponse.json({ success: true, data: tag })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ success: false, error: err.flatten() }, { status: 422 })
    return NextResponse.json({ success: false, error: 'Failed to update tag' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    await prisma.tag.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete tag' }, { status: 500 })
  }
}
