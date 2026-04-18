import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/glossary/[id] - Get specific glossary entry (PUBLIC)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const entry = await prisma.glossaryEntry.findUnique({
      where: { id: id },
    })

    if (!entry) {
      return errorResponse('Glossary entry not found', 404)
    }

    return successResponse(entry)
  } catch (error) {
    console.error('Glossary GET [id] error:', error)
    return errorResponse('Failed to fetch glossary entry', 500)
  }
}

/**
 * PUT /api/glossary/[id] - Update glossary entry
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const body = await parseBody(request)

    if (!body) {
      return errorResponse('Invalid request body', 400)
    }

    const existing = await prisma.glossaryEntry.findUnique({
      where: { id: id },
    })

    if (!existing) {
      return errorResponse('Glossary entry not found', 404)
    }

    // Check term uniqueness if changed
    if (body.term && body.term !== existing.term) {
      const termExists = await prisma.glossaryEntry.findUnique({
        where: { term: body.term },
      })
      if (termExists) {
        return errorResponse('Term already exists', 400)
      }
    }

    const updated = await prisma.glossaryEntry.update({
      where: { id: id },
      data: {
        term: body.term ?? existing.term,
        shortFr: body.shortFr ?? existing.shortFr,
        shortNl: body.shortNl ?? existing.shortNl,
        shortDe: body.shortDe ?? existing.shortDe,
        shortEn: body.shortEn ?? existing.shortEn,
        shortAr: body.shortAr ?? existing.shortAr,
        longFr: body.longFr ?? existing.longFr,
        longNl: body.longNl ?? existing.longNl,
        longDe: body.longDe ?? existing.longDe,
        longEn: body.longEn ?? existing.longEn,
        longAr: body.longAr ?? existing.longAr,
        category: body.category ?? existing.category,
        orderBy: body.orderBy ?? existing.orderBy,
      },
    })

    return successResponse(updated)
  } catch (error) {
    console.error('Glossary PUT error:', error)
    return errorResponse('Failed to update glossary entry', 500)
  }
}

/**
 * DELETE /api/glossary/[id] - Delete glossary entry
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    const existing = await prisma.glossaryEntry.findUnique({
      where: { id: id },
    })

    if (!existing) {
      return errorResponse('Glossary entry not found', 404)
    }

    await prisma.glossaryEntry.delete({
      where: { id: id },
    })

    return successResponse({ message: 'Glossary entry deleted successfully' })
  } catch (error) {
    console.error('Glossary DELETE error:', error)
    return errorResponse('Failed to delete glossary entry', 500)
  }
}
