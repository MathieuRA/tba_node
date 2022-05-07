import { PrismaClient } from '@prisma/client'

const rooms = [
  {
    name: 'bedroom',
  },
  {
    name: 'corridor',
  },
  {
    name: 'bathroom',
  },
  {
    name: 'kitchen',
  },
]

async function room(prisma: PrismaClient) {
  await prisma.room.deleteMany({})
  await Promise.all(
    rooms.map((room) =>
      prisma.room.create({
        data: room,
      })
    )
  )
}

export default room
