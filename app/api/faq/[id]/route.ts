import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, parseBody, errorResponse, successResponse } from '@/lib/api-utils'

/**
 * GET /api/faq/[id] - Get specific FAQ category with items (PUBLIC)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const category = await prisma.faqCategory.findUnique({
      where: { id: id },
      include: {
        items: {
          orderBy: { orderBy: 'asc' },
        },
      },
    })

    if (!category) {
      return errorResponse('FAQ category not found', 404)
    }

    return successResponse(category)
  } catch (error) {
    console.error('FAQ GET [id] error:', error)
    return errorResponse('Failed to fetch FAQ category', 500)
  }
}

/**
 * PUT /api/faq/[id] - Update FAQ category
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

    // Verify category exists
    const existing = await prisma.faqCategory.findUnique({
      where: { id: id },
    })

    if (!existing) {
      return errorResponse('FAQ category not found', 404)
    }

    const updated = await prisma.faqCategory.update({
      where: { id: id },
      data: {
        nameFr: body.nameFr ?? existing.nameFr,
        nameNl: body.nameNl ?? existing.nameNl,
        nameDe: body.nameDe ?? existing.nameDe,
        nameEn: body.nameEn ?? existing.nameEn,
        nameAr: body.nameAr ?? existing.nameAr,
        orderBy: body.orderBy ?? existing.orderBy,
      },
      include: {
        items: {
          orderBy: { orderBy: 'asc' },
        },
      },
    })

    return successResponse(updated)
  } catch (error) {
    console.error('FAQ PUT error:', error)
    return errorResponse('Failed to update FAQ category', 500)
  }
}

/**
 * DELETE /api/faq/[id] - Delete FAQ category (cascades to items)
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const auth = await requireAuth(request)
    if (!auth.authenticated) return auth.response!

    // Verify category exists
    const existing = await prisma.faqCategory.findUnique({
      where: { id: id },
    })

    if (!existing) {
      return errorResponse('FAQ category not found', 404)
    }

    await prisma.faqCategory.delete({
      where: { id: id },
    })

    return successResponse({ message: 'FAQ category deleted successfully' })
  } catch (error) {
    console.error('FAQ DELETE error:', error)
    return errorResponse('Failed to delete FAQ category', 500)
  }
}
