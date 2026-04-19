import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../lib/generated/prisma/client'
import { hash } from 'bcryptjs'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'admin'
  const password = 'admin'
  const passwordHash = await hash(password, 12)

  // Upsert dans User (NextAuth credentials)
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN', name: 'Admin' },
    create: { email, passwordHash, role: 'ADMIN', name: 'Admin' },
  })

  // Upsert dans AdminUser (legacy check-auth)
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  })

  console.log('✅ Compte créé — login: admin / admin')
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
