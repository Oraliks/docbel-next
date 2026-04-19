import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
  interface User {
    role?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const email = credentials.email as string
        const password = credentials.password as string

        // Try User table first (new CMS users)
        try {
          const user = await prisma.user.findUnique({ where: { email } })
          if (user?.passwordHash) {
            const valid = await compare(password, user.passwordHash)
            if (!valid) return null
            return { id: user.id, email: user.email, name: user.name, role: user.role }
          }
        } catch {}

        // Fallback to legacy AdminUser table
        try {
          const admin = await prisma.adminUser.findUnique({ where: { email } })
          if (admin) {
            const valid = await compare(password, admin.passwordHash)
            if (!valid) return null
            return { id: admin.id, email: admin.email, name: 'Admin', role: 'ADMIN' }
          }
        } catch {}

        return null
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? 'AUTHOR'
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
})
