import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'
import { NEWS_ITEMS } from '@/lib/content'

function staticFallback() {
  const langs = ['fr', 'nl', 'de', 'en', 'ar'] as const
  const base = NEWS_ITEMS.fr
  return base.map((item, i) => ({
    id: `static-${i}`,
    slug: `article-${i + 1}`,
    tags: item.tag,
    featuredAt: item.featured ? item.date : null,
    createdAt: item.date,
    titleFr: NEWS_ITEMS.fr[i]?.title ?? item.title,
    titleNl: NEWS_ITEMS.nl[i]?.title ?? item.title,
    titleDe: NEWS_ITEMS.de[i]?.title ?? item.title,
    titleEn: NEWS_ITEMS.en[i]?.title ?? item.title,
    titleAr: NEWS_ITEMS.ar[i]?.title ?? item.title,
    bodyFr: NEWS_ITEMS.fr[i]?.excerpt ?? '',
    bodyNl: NEWS_ITEMS.nl[i]?.excerpt ?? '',
    bodyDe: NEWS_ITEMS.de[i]?.excerpt ?? '',
    bodyEn: NEWS_ITEMS.en[i]?.excerpt ?? '',
    bodyAr: NEWS_ITEMS.ar[i]?.excerpt ?? '',
  }))
}

/**
 * GET /api/news - List all news articles (PUBLIC)
 */
export async function GET(_request: NextRequest) {
  try {
    if (!prisma) {
      const data = staticFallback()
      return NextResponse.json({ success: true, data })
    }

    const news = await prisma.newsItem.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('News GET error:', error)
    const data = staticFallback()
    return NextResponse.json({ success: true, data })
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
