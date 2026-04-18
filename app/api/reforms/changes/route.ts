import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/reforms/changes - List all reform changes (PUBLIC)
 */
export async function GET(request: NextRequest) {
  try {
    const changes = await prisma.reformChange.findMany({
      orderBy: { orderBy: 'asc' },
    })

    return successResponse({
      total: changes.length,
      changes,
    })
  } catch (error) {
    console.error('Reform changes GET error:', error)
    return errorResponse('Failed to fetch reform changes', 500)
  }
}

/**
 * POST /api/reforms/changes - Create new reform change
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    const requiredFields = ['beforeFr', 'beforeNl', 'beforeDe', 'beforeEn', 'beforeAr', 'afterFr', 'afterNl', 'afterDe', 'afterEn', 'afterAr']
    if (!body || !requiredFields.every(field => field in body)) {
      return errorResponse(`Missing required fields: ${requiredFields.join(', ')}`, 400)
    }

    const change = await prisma.reformChange.create({
      data: {
        beforeFr: body.beforeFr,
        beforeNl: body.beforeNl,
        beforeDe: body.beforeDe,
        beforeEn: body.beforeEn,
        beforeAr: body.beforeAr,
        afterFr: body.afterFr,
        afterNl: body.afterNl,
        afterDe: body.afterDe,
        afterEn: body.afterEn,
        afterAr: body.afterAr,
        impactTag: body.impactTag ?? 'modified',
        orderBy: body.orderBy ?? 0,
      },
    })

    return successResponse(change, 201)
  } catch (error) {
    console.error('Reform changes POST error:', error)
    return errorResponse('Failed to create reform change', 500)
  }
}
