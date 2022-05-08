import { PrismaClient } from '@prisma/client'

const directions = [
  {
    command: 'east',
    name: 'East',
  },
  {
    command: 'west',
    name: 'West',
  },
  {
    command: 'north',
    name: 'North',
  },
  {
    command: 'south',
    name: 'South',
  },
]

async function direction(prisma: PrismaClient) {
  await Promise.all(
    directions.map((direction) =>
      prisma.direction.create({
        data: direction,
      })
    )
  )
}

export default direction
