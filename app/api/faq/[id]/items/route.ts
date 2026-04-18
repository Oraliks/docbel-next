import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/faq/[id]/items - List items in a FAQ category (PUBLIC)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const items = await prisma.faqItem.findMany({
      where: { categoryId: id },
      orderBy: { orderBy: 'asc' },
    })

    return successResponse({
      categoryId: id,
      total: items.length,
      items,
    })
  } catch (error) {
    console.error('FAQ items GET error:', error)
    return errorResponse('Failed to fetch FAQ items', 500)
  }
}

/**
 * POST /api/faq/[id]/items - Create new FAQ item in category
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    // Validate required fields
    const requiredFields = ['questionFr', 'questionNl', 'questionDe', 'questionEn', 'questionAr', 'answerFr', 'answerNl', 'answerDe', 'answerEn', 'answerAr']
    if (!body || !requiredFields.every(field => field in body)) {
      return errorResponse(`Missing required fields: ${requiredFields.join(', ')}`, 400)
    }

    // Verify category exists
    const category = await prisma.faqCategory.findUnique({
      where: { id: id },
    })

    if (!category) {
      return errorResponse('FAQ category not found', 404)
    }

    const item = await prisma.faqItem.create({
      data: {
        categoryId: id,
        questionFr: body.questionFr,
        questionNl: body.questionNl,
        questionDe: body.questionDe,
        questionEn: body.questionEn,
        questionAr: body.questionAr,
        answerFr: body.answerFr,
        answerNl: body.answerNl,
        answerDe: body.answerDe,
        answerEn: body.answerEn,
        answerAr: body.answerAr,
        orderBy: body.orderBy ?? 0,
      },
    })

    return successResponse(item, 201)
  } catch (error) {
    console.error('FAQ items POST error:', error)
    return errorResponse('Failed to create FAQ item', 500)
  }
}
