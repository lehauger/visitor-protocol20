import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  // Admin-bruker (brukes for demo-innlogging)
  const admin = await db.employee.upsert({
    where: { email: 'admin@demo.no' },
    update: {},
    create: {
      name: 'Demo Admin',
      email: 'admin@demo.no',
      role: 'ADMIN',
    },
  })

  // Ansatt for å teste verttildeling
  await db.employee.upsert({
    where: { email: 'anne@demo.no' },
    update: {},
    create: {
      name: 'Anne Ansatt',
      email: 'anne@demo.no',
      role: 'EMPLOYEE',
    },
  })

  await db.employee.upsert({
    where: { email: 'bjorn@demo.no' },
    update: {},
    create: {
      name: 'Bjørn Mottaker',
      email: 'bjorn@demo.no',
      role: 'RECEPTIONIST',
    },
  })

  // Lokasjon og dør
  const location = await db.location.upsert({
    where: { id: 'demo-location' },
    update: {},
    create: {
      id: 'demo-location',
      name: 'Demo Kontor',
      address: 'Testgata 1, 0001 Oslo',
    },
  })

  const door = await db.door.upsert({
    where: { id: 'demo-door' },
    update: {},
    create: {
      id: 'demo-door',
      locationId: location.id,
      name: 'Hovedinngang',
    },
  })

  console.log('Seed fullfort:')
  console.log(`   Admin: ${admin.email}`)
  console.log(`   Ansatte: anne@demo.no, bjorn@demo.no`)
  console.log(`   Lokasjon: ${location.name}`)
  console.log(`   Dor: ${door.name} (QR-token: ${door.qrToken})`)
  console.log(`   Innsjekk-URL: http://localhost:3000/checkin/${door.qrToken}`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
