import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const UpdateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM']),
})

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const { status } = UpdateSchema.parse(await req.json())
    const comment = await prisma.comment.update({ where: { id }, data: { status } })
    return NextResponse.json({ success: true, data: comment })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ success: false, error: err.flatten() }, { status: 422 })
    return NextResponse.json({ success: false, error: 'Failed to update comment' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    await prisma.comment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete comment' }, { status: 500 })
  }
}
