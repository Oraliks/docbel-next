import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/reforms/timeline - List all timeline events (PUBLIC)
 */
export async function GET(request: NextRequest) {
  try {
    const timeline = await prisma.reformTimeline.findMany({
      orderBy: { eventDate: 'asc' },
    })

    return successResponse({
      total: timeline.length,
      timeline,
    })
  } catch (error) {
    console.error('Reform timeline GET error:', error)
    return errorResponse('Failed to fetch timeline events', 500)
  }
}

/**
 * POST /api/reforms/timeline - Create new timeline event
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    const requiredFields = ['eventDate', 'descFr', 'descNl', 'descDe', 'descEn', 'descAr']
    if (!body || !requiredFields.every(field => field in body)) {
      return errorResponse(`Missing required fields: ${requiredFields.join(', ')}`, 400)
    }

    const event = await prisma.reformTimeline.create({
      data: {
        eventDate: new Date(body.eventDate),
        descFr: body.descFr,
        descNl: body.descNl,
        descDe: body.descDe,
        descEn: body.descEn,
        descAr: body.descAr,
        orderBy: body.orderBy ?? 0,
      },
    })

    return successResponse(event, 201)
  } catch (error) {
    console.error('Reform timeline POST error:', error)
    return errorResponse('Failed to create timeline event', 500)
  }
}
