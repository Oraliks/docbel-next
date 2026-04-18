import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/ui-strings - List all UI strings
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const strings = await prisma.uiString.findMany({
      orderBy: { key: 'asc' },
    })

    return successResponse({
      total: strings.length,
      strings,
    })
  } catch (error) {
    console.error('UI Strings GET error:', error)
    return errorResponse('Failed to fetch UI strings', 500)
  }
}

/**
 * POST /api/ui-strings - Create new UI string
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    const requiredFields = ['key', 'valueFr', 'valueNl', 'valueDe', 'valueEn', 'valueAr']
    if (!body || !requiredFields.every(field => field in body)) {
      return errorResponse(`Missing required fields: ${requiredFields.join(', ')}`, 400)
    }

    // Check key uniqueness
    const existing = await prisma.uiString.findUnique({
      where: { key: body.key },
    })

    if (existing) {
      return errorResponse('Key already exists', 400)
    }

    const uiString = await prisma.uiString.create({
      data: {
        key: body.key,
        valueFr: body.valueFr,
        valueNl: body.valueNl,
        valueDe: body.valueDe,
        valueEn: body.valueEn,
        valueAr: body.valueAr,
        category: body.category ?? 'general',
      },
    })

    return successResponse(uiString, 201)
  } catch (error) {
    console.error('UI Strings POST error:', error)
    return errorResponse('Failed to create UI string', 500)
  }
}
