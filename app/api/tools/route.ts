import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/tools - List all tools (PUBLIC)
 */
export async function GET(request: NextRequest) {
  try {
    const tools = await prisma.toolItem.findMany({
      orderBy: { orderBy: 'asc' },
    })

    return successResponse({
      total: tools.length,
      tools,
    })
  } catch (error) {
    console.error('Tools GET error:', error)
    return errorResponse('Failed to fetch tools', 500)
  }
}

/**
 * POST /api/tools - Create new tool
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    const requiredFields = ['slug', 'titleFr', 'titleNl', 'titleDe', 'titleEn', 'titleAr', 'descFr', 'descNl', 'descDe', 'descEn', 'descAr', 'link']
    if (!body || !requiredFields.every(field => field in body)) {
      return errorResponse(`Missing required fields: ${requiredFields.join(', ')}`, 400)
    }

    // Check slug uniqueness
    const existing = await prisma.toolItem.findUnique({
      where: { slug: body.slug },
    })

    if (existing) {
      return errorResponse('Slug already exists', 400)
    }

    const tool = await prisma.toolItem.create({
      data: {
        slug: body.slug,
        titleFr: body.titleFr,
        titleNl: body.titleNl,
        titleDe: body.titleDe,
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        descFr: body.descFr,
        descNl: body.descNl,
        descDe: body.descDe,
        descEn: body.descEn,
        descAr: body.descAr,
        link: body.link,
        ctaFr: body.ctaFr ?? 'Utiliser',
        ctaNl: body.ctaNl ?? 'Gebruiken',
        ctaDe: body.ctaDe ?? 'Nutzen',
        ctaEn: body.ctaEn ?? 'Use',
        ctaAr: body.ctaAr ?? 'استخدم',
        orderBy: body.orderBy ?? 0,
      },
    })

    return successResponse(tool, 201)
  } catch (error) {
    console.error('Tools POST error:', error)
    return errorResponse('Failed to create tool', 500)
  }
}
