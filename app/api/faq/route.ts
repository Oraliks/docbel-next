import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/faq - List all FAQ categories with items (PUBLIC)
 */
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.faqCategory.findMany({
      include: {
        items: {
          orderBy: { orderBy: 'asc' },
        },
      },
      orderBy: { orderBy: 'asc' },
    })

    return successResponse({
      total: categories.length,
      categories,
    })
  } catch (error) {
    console.error('FAQ GET error:', error)
    return errorResponse('Failed to fetch FAQ categories', 500)
  }
}

/**
 * POST /api/faq - Create new FAQ category
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    if (!body || !body.nameFr || !body.nameNl || !body.nameDe || !body.nameEn || !body.nameAr) {
      return errorResponse('Missing required fields (names in all 5 languages)', 400)
    }

    const category = await prisma.faqCategory.create({
      data: {
        nameFr: body.nameFr,
        nameNl: body.nameNl,
        nameDe: body.nameDe,
        nameEn: body.nameEn,
        nameAr: body.nameAr,
        orderBy: body.orderBy ?? 0,
      },
    })

    return successResponse(category, 201)
  } catch (error) {
    console.error('FAQ POST error:', error)
    return errorResponse('Failed to create FAQ category', 500)
  }
}
