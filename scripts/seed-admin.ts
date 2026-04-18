/**
 * Seed script to create the first admin user
 * Run with: npx ts-node scripts/seed-admin.ts
 */

import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/auth'

async function main() {
  console.log('🌱 Seeding database with admin user...')

  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findFirst()
  if (existingAdmin) {
    console.log('⚠️  Admin user already exists:')
    console.log(`   Email: ${existingAdmin.email}`)
    console.log(`   ID: ${existingAdmin.id}`)
    return
  }

  // For demo: use a default password
  // In production, use a strong random password or prompt the user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@docbel.local'
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123'

  const hashedPassword = await hashPassword(adminPassword)

  const admin = await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash: hashedPassword,
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log()
  console.log('Admin Credentials:')
  console.log(`  Email: ${admin.email}`)
  console.log(`  Password: ${adminPassword}`)
  console.log()
  console.log('⚠️  IMPORTANT: Change the password in /admin/login after first login')
  console.log()
  console.log(`Login at: http://localhost:3000/admin/login`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
