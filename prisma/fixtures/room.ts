import { PrismaClient } from '@prisma/client'

// Items that have no effects
const rooms = [
  {
    name: 'bedroom',
    items: {
      create: [{ name: 'chair' }],
    },
  },
  {
    name: 'corridor',
  },
  {
    name: 'bathroom',
    items: {
      create: [{ name: 'shower' }, { name: 'washing-machine' }],
    },
  },
  {
    name: 'kitchen',
    items: {
      create: [{ name: 'table' }],
    },
  },
]

async function room(prisma: PrismaClient) {
  await Promise.all(
    rooms.map((room) =>
      prisma.room.create({
        data: room,
      })
    )
  )
}

export default room
