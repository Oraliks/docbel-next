import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/reforms - Get all reform data (changes, profiles, timeline) (PUBLIC)
 */
export async function GET(request: NextRequest) {
  try {
    const [changes, profiles, timeline] = await Promise.all([
      prisma.reformChange.findMany({ orderBy: { orderBy: 'asc' } }),
      prisma.reformProfile.findMany({ orderBy: { orderBy: 'asc' } }),
      prisma.reformTimeline.findMany({ orderBy: { orderBy: 'asc' } }),
    ])

    return successResponse({
      changes: { total: changes.length, items: changes },
      profiles: { total: profiles.length, items: profiles },
      timeline: { total: timeline.length, items: timeline },
    })
  } catch (error) {
    console.error('Reforms GET error:', error)
    return errorResponse('Failed to fetch reform data', 500)
  }
}
