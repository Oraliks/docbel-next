import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const folder = searchParams.get('folder')
  const mimeType = searchParams.get('type')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '40')

  try {
    const where: Record<string, unknown> = {}
    if (folder) where.folder = folder
    if (mimeType) where.mimeType = { startsWith: mimeType }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.media.count({ where }),
    ])
    return NextResponse.json({ success: true, data: media, total, page, limit })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { filename, url, mimeType, size, width, height, altFr, altEn, caption, folder } = body
    if (!filename || !url || !mimeType || !size) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }
    const media = await prisma.media.create({
      data: { filename, url, mimeType, size, width, height, altFr, altEn, caption, folder: folder ?? '/' },
    })
    return NextResponse.json({ success: true, data: media }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to save media' }, { status: 500 })
  }
}
