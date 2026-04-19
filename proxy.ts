import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Never intercept the login page (prevents redirect loop)
  if (pathname.startsWith('/admin/login')) return NextResponse.next()

  // Protect all other /admin routes — JWT-only (Edge-safe, no DB call)
  if (pathname.startsWith('/admin')) {
    try {
      const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
      })
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    } catch {
      // If AUTH_SECRET is missing or getToken throws, redirect to login
      // (do NOT throw — that would cause a loop)
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
