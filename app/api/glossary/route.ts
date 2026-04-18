import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/glossary - List all glossary entries (PUBLIC)
 */
export async function GET(request: NextRequest) {
  try {
    const entries = await prisma.glossaryEntry.findMany({
      orderBy: { orderBy: 'asc' },
    })

    return successResponse({
      total: entries.length,
      entries,
    })
  } catch (error) {
    console.error('Glossary GET error:', error)
    return errorResponse('Failed to fetch glossary entries', 500)
  }
}

/**
 * POST /api/glossary - Create new glossary entry
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    const requiredFields = ['term', 'shortFr', 'shortNl', 'shortDe', 'shortEn', 'shortAr', 'longFr', 'longNl', 'longDe', 'longEn', 'longAr']
    if (!body || !requiredFields.every(field => field in body)) {
      return errorResponse(`Missing required fields: ${requiredFields.join(', ')}`, 400)
    }

    // Check term uniqueness
    const existing = await prisma.glossaryEntry.findUnique({
      where: { term: body.term },
    })

    if (existing) {
      return errorResponse('Term already exists', 400)
    }

    const entry = await prisma.glossaryEntry.create({
      data: {
        term: body.term,
        shortFr: body.shortFr,
        shortNl: body.shortNl,
        shortDe: body.shortDe,
        shortEn: body.shortEn,
        shortAr: body.shortAr,
        longFr: body.longFr,
        longNl: body.longNl,
        longDe: body.longDe,
        longEn: body.longEn,
        longAr: body.longAr,
        category: body.category ?? 'general',
        orderBy: body.orderBy ?? 0,
      },
    })

    return successResponse(entry, 201)
  } catch (error) {
    console.error('Glossary POST error:', error)
    return errorResponse('Failed to create glossary entry', 500)
  }
}
