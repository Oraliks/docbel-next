import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/lib/generated/prisma/client'
import { Pool } from 'pg'

// Create a global type to hold the prisma instance
declare global {
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

let prismaInstance: PrismaClient | undefined

try {
  if (connectionString) {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    prismaInstance =
      global.prisma ||
      new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
  }
} catch (error) {
  console.warn('Prisma client initialization warning:', error instanceof Error ? error.message : 'Unknown error')
}

export const prisma = prismaInstance || (global.prisma as unknown as PrismaClient)

if (process.env.NODE_ENV !== 'production' && prismaInstance) {
  global.prisma = prismaInstance
}

export default prisma
