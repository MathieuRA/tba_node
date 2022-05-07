import { PrismaClient } from '@prisma/client'

// FIXTURES
import room from './room'

const prisma = new PrismaClient()

async function main() {
  await room(prisma)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => await prisma.$disconnect())
