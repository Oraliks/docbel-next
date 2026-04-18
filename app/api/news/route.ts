import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/news - List all news articles (PUBLIC)
 */
export async function GET(request: NextRequest) {
  try {
    const news = await prisma.newsItem.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return successResponse({
      total: news.length,
      news,
    })
  } catch (error) {
    console.error('News GET error:', error)
    return errorResponse('Failed to fetch news articles', 500)
  }
}

/**
 * POST /api/news - Create new news article
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    const requiredFields = ['slug', 'titleFr', 'titleNl', 'titleDe', 'titleEn', 'titleAr', 'bodyFr', 'bodyNl', 'bodyDe', 'bodyEn', 'bodyAr']
    if (!body || !requiredFields.every(field => field in body)) {
      return errorResponse(`Missing required fields: ${requiredFields.join(', ')}`, 400)
    }

    // Check slug uniqueness
    const existing = await prisma.newsItem.findUnique({
      where: { slug: body.slug },
    })

    if (existing) {
      return errorResponse('Slug already exists', 400)
    }

    const article = await prisma.newsItem.create({
      data: {
        slug: body.slug,
        titleFr: body.titleFr,
        titleNl: body.titleNl,
        titleDe: body.titleDe,
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        bodyFr: body.bodyFr,
        bodyNl: body.bodyNl,
        bodyDe: body.bodyDe,
        bodyEn: body.bodyEn,
        bodyAr: body.bodyAr,
        tags: body.tags ?? '',
        featuredAt: body.featuredAt ? new Date(body.featuredAt) : null,
        orderBy: body.orderBy ?? 0,
      },
    })

    return successResponse(article, 201)
  } catch (error) {
    console.error('News POST error:', error)
    return errorResponse('Failed to create news article', 500)
  }
}
