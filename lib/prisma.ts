import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/lib/generated/prisma/client'

declare global {
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient | undefined {
  const url = process.env.DATABASE_URL
  if (!url) return undefined
  try {
    const adapter = new PrismaPg({ connectionString: url, ssl: { rejectUnauthorized: false } })
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.warn('Prisma init error:', error instanceof Error ? error.message : error)
    return undefined
  }
}

const prismaInstance: PrismaClient | undefined = createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prismaInstance) {
  global.prisma = prismaInstance
}

export const prisma = prismaInstance as PrismaClient
export default prisma
