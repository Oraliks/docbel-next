import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

/**
 * Middleware to check authentication for API routes
 */
export async function requireAuth(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return {
        authenticated: false,
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      }
    }

    return {
      authenticated: true,
      session,
      response: null,
    }
  } catch (error) {
    return {
      authenticated: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
}

/**
 * Parse and validate request body
 */
export async function parseBody(request: NextRequest) {
  try {
    return await request.json()
  } catch (error) {
    return null
  }
}

/**
 * Standardized error response
 */
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * Standardized success response
 */
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}
