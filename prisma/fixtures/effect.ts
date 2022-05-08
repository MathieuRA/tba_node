import { PrismaClient } from '@prisma/client'

async function effect(prisma: PrismaClient) {
  await prisma.effect.deleteMany()
  // ROOMS
  const [bedroom, kitchen] = await Promise.all([
    prisma.room.findUnique({
      where: {
        name: 'bedroom',
      },
      rejectOnNotFound: true,
    }),
    prisma.room.findUnique({
      where: {
        name: 'kitchen',
      },
      rejectOnNotFound: true,
    }),
  ])

  // COMMANDS
  const [sleep, open] = await Promise.all([
    prisma.command.findUnique({
      where: {
        command: 'sleep',
      },
      rejectOnNotFound: true,
    }),
    prisma.command.findUnique({
      where: {
        command: 'open',
      },
      rejectOnNotFound: true,
    }),
  ])

  const effects = [
    {
      effectType: 'Message',
      order: 0,
      message: 'This bed is so dirty ! you cannot sleep here !',
      item: {
        create: {
          name: 'bed',
          roomId: bedroom.id,
        },
      },
      command: {
        connect: {
          id: sleep.id,
        },
      },
    },
    {
      effectType: 'Message',
      order: 0,
      message: 'Hmm, the fridge is empty...',
      item: {
        create: {
          name: 'fridge',
          roomId: kitchen.id,
        },
      },
      command: {
        connect: {
          id: open.id,
        },
      },
    },
  ]

  // Cannot use Promise.all() due to sqLite timeout query
  await prisma.effect.create({
    data: effects[0],
  })
  await prisma.effect.create({
    data: effects[1],
  })
}

export default effect
