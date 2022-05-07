import { PrismaClient } from '@prisma/client'

// FIXTURES
import direction from './direction'
import room from './room'
import room_connection from './room_connection'

const prisma = new PrismaClient()

async function main() {
  await direction(prisma)
  await room(prisma)
  await room_connection(prisma)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => await prisma.$disconnect())
