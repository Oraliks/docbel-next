import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/reforms/profiles - List all reform profiles (PUBLIC)
 */
export async function GET(request: NextRequest) {
  try {
    const profiles = await prisma.reformProfile.findMany({
      orderBy: { orderBy: 'asc' },
    })

    return successResponse({
      total: profiles.length,
      profiles,
    })
  } catch (error) {
    console.error('Reform profiles GET error:', error)
    return errorResponse('Failed to fetch reform profiles', 500)
  }
}

/**
 * POST /api/reforms/profiles - Create new reform profile
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    const requiredFields = ['nameFr', 'nameNl', 'nameDe', 'nameEn', 'nameAr', 'descFr', 'descNl', 'descDe', 'descEn', 'descAr', 'impactFr', 'impactNl', 'impactDe', 'impactEn', 'impactAr']
    if (!body || !requiredFields.every(field => field in body)) {
      return errorResponse(`Missing required fields: ${requiredFields.join(', ')}`, 400)
    }

    const profile = await prisma.reformProfile.create({
      data: {
        nameFr: body.nameFr,
        nameNl: body.nameNl,
        nameDe: body.nameDe,
        nameEn: body.nameEn,
        nameAr: body.nameAr,
        descFr: body.descFr,
        descNl: body.descNl,
        descDe: body.descDe,
        descEn: body.descEn,
        descAr: body.descAr,
        impactFr: body.impactFr,
        impactNl: body.impactNl,
        impactDe: body.impactDe,
        impactEn: body.impactEn,
        impactAr: body.impactAr,
        orderBy: body.orderBy ?? 0,
      },
    })

    return successResponse(profile, 201)
  } catch (error) {
    console.error('Reform profiles POST error:', error)
    return errorResponse('Failed to create reform profile', 500)
  }
}
