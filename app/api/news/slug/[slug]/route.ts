import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-utils'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const article = await prisma.newsItem.findUnique({
      where: { slug },
    })

    if (!article) {
      return errorResponse('News article not found', 404)
    }

    return successResponse(article)
  } catch (error) {
    console.error('News slug GET error:', error)
    return errorResponse('Failed to fetch news article', 500)
  }
}
