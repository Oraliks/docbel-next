import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/tools/[id] - Get specific tool (PUBLIC)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const tool = await prisma.toolItem.findUnique({
      where: { slug: id },
    })

    if (!tool) {
      return errorResponse('Tool not found', 404)
    }

    return successResponse(tool)
  } catch (error) {
    console.error('Tools GET [id] error:', error)
    return errorResponse('Failed to fetch tool', 500)
  }
}

/**
 * PUT /api/tools/[id] - Update tool
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    if (!body) {
      return errorResponse('Invalid request body', 400)
    }

    const existing = await prisma.toolItem.findUnique({
      where: { slug: id },
    })

    if (!existing) {
      return errorResponse('Tool not found', 404)
    }

    // Check slug uniqueness if changed
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await prisma.toolItem.findUnique({
        where: { slug: body.slug },
      })
      if (slugExists) {
        return errorResponse('Slug already exists', 400)
      }
    }

    const updated = await prisma.toolItem.update({
      where: { slug: id },
      data: {
        slug: body.slug ?? existing.slug,
        titleFr: body.titleFr ?? existing.titleFr,
        titleNl: body.titleNl ?? existing.titleNl,
        titleDe: body.titleDe ?? existing.titleDe,
        titleEn: body.titleEn ?? existing.titleEn,
        titleAr: body.titleAr ?? existing.titleAr,
        descFr: body.descFr ?? existing.descFr,
        descNl: body.descNl ?? existing.descNl,
        descDe: body.descDe ?? existing.descDe,
        descEn: body.descEn ?? existing.descEn,
        descAr: body.descAr ?? existing.descAr,
        link: body.link ?? existing.link,
        ctaFr: body.ctaFr ?? existing.ctaFr,
        ctaNl: body.ctaNl ?? existing.ctaNl,
        ctaDe: body.ctaDe ?? existing.ctaDe,
        ctaEn: body.ctaEn ?? existing.ctaEn,
        ctaAr: body.ctaAr ?? existing.ctaAr,
        orderBy: body.orderBy ?? existing.orderBy,
      },
    })

    return successResponse(updated)
  } catch (error) {
    console.error('Tools PUT error:', error)
    return errorResponse('Failed to update tool', 500)
  }
}

/**
 * DELETE /api/tools/[id] - Delete tool
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const existing = await prisma.toolItem.findUnique({
      where: { slug: id },
    })

    if (!existing) {
      return errorResponse('Tool not found', 404)
    }

    await prisma.toolItem.delete({
      where: { slug: id },
    })

    return successResponse({ message: 'Tool deleted successfully' })
  } catch (error) {
    console.error('Tools DELETE error:', error)
    return errorResponse('Failed to delete tool', 500)
  }
}
