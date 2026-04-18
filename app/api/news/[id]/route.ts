import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/news/[id] - Get specific news article (PUBLIC)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const article = await prisma.newsItem.findUnique({
      where: { id },
    })

    if (!article) {
      return errorResponse('News article not found', 404)
    }

    return successResponse(article)
  } catch (error) {
    console.error('News GET [id] error:', error)
    return errorResponse('Failed to fetch news article', 500)
  }
}

/**
 * PUT /api/news/[id] - Update news article
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

    const existing = await prisma.newsItem.findUnique({
      where: { id: id },
    })

    if (!existing) {
      return errorResponse('News article not found', 404)
    }

    // Check slug uniqueness if changed
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await prisma.newsItem.findUnique({
        where: { slug: body.slug },
      })
      if (slugExists) {
        return errorResponse('Slug already exists', 400)
      }
    }

    const updated = await prisma.newsItem.update({
      where: { id: id },
      data: {
        slug: body.slug ?? existing.slug,
        titleFr: body.titleFr ?? existing.titleFr,
        titleNl: body.titleNl ?? existing.titleNl,
        titleDe: body.titleDe ?? existing.titleDe,
        titleEn: body.titleEn ?? existing.titleEn,
        titleAr: body.titleAr ?? existing.titleAr,
        bodyFr: body.bodyFr ?? existing.bodyFr,
        bodyNl: body.bodyNl ?? existing.bodyNl,
        bodyDe: body.bodyDe ?? existing.bodyDe,
        bodyEn: body.bodyEn ?? existing.bodyEn,
        bodyAr: body.bodyAr ?? existing.bodyAr,
        tags: body.tags ?? existing.tags,
        featuredAt: body.featuredAt ? new Date(body.featuredAt) : existing.featuredAt,
        orderBy: body.orderBy ?? existing.orderBy,
      },
    })

    return successResponse(updated)
  } catch (error) {
    console.error('News PUT error:', error)
    return errorResponse('Failed to update news article', 500)
  }
}

/**
 * DELETE /api/news/[id] - Delete news article
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const existing = await prisma.newsItem.findUnique({
      where: { id: id },
    })

    if (!existing) {
      return errorResponse('News article not found', 404)
    }

    await prisma.newsItem.delete({
      where: { id: id },
    })

    return successResponse({ message: 'News article deleted successfully' })
  } catch (error) {
    console.error('News DELETE error:', error)
    return errorResponse('Failed to delete news article', 500)
  }
}
