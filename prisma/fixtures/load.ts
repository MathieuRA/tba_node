import { PrismaClient } from '@prisma/client'
import command from './command'

// FIXTURES
import direction from './direction'
import effect from './effect'
import room from './room'
import room_connection from './room_connection'

const prisma = new PrismaClient()

async function main() {
  // Using Promise.all for drop table throw connection timed out
  await prisma.command.deleteMany({})
  await prisma.direction.deleteMany({})
  await prisma.room.deleteMany({})
  await Promise.all([command(prisma), direction(prisma), room(prisma)])
  await room_connection(prisma)
  await effect(prisma)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => await prisma.$disconnect())
