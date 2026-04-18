import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

// Session configuration
const SESSION_NAME = 'docbel-admin-session'
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-key-change-in-production'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Use a secret key (must be at least 32 bytes for HS256)
const secret = new TextEncoder().encode(SESSION_SECRET.padEnd(32, '0').slice(0, 32))

export interface Session {
  userId: string
  email: string
  iat: number
  exp: number
}

/**
 * Create a session token (JWT)
 */
export async function createSession(userId: string, email: string): Promise<string> {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + SESSION_DURATION / 1000

  const jwt = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret)

  return jwt
}

/**
 * Verify and decode a session token
 */
export async function verifySession(token: string): Promise<Session | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return {
      userId: verified.payload.userId as string,
      email: verified.payload.email as string,
      iat: verified.payload.iat as number,
      exp: verified.payload.exp as number,
    }
  } catch (error) {
    return null
  }
}

/**
 * Set session cookie (server action)
 */
export async function setSessionCookie(token: string) {
  const cookieJar = await cookies()
  cookieJar.set(SESSION_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // 24 hours
    path: '/',
  })
}

/**
 * Clear session cookie (server action)
 */
export async function clearSessionCookie() {
  const cookieJar = await cookies()
  cookieJar.delete(SESSION_NAME)
}

/**
 * Get current session from cookies
 */
export async function getSession(): Promise<Session | null> {
  const cookieJar = await cookies()
  const token = cookieJar.get(SESSION_NAME)?.value

  if (!token) return null
  return verifySession(token)
}

/**
 * Hash password with a simple method (use bcryptjs in production)
 * For demo: we'll use basic hashing
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password)
  return hashedPassword === hash
}
