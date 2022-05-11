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
  const [sleep, open, eat, drink] = await Promise.all([
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
    prisma.command.findUnique({
      where: {
        command: 'eat',
      },
      rejectOnNotFound: true,
    }),
    prisma.command.findUnique({
      where: {
        command: 'drink',
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
      order: 1,
      message: 'Hmm, the fridge is empty...',
      item: {
        create: {
          name: 'fridge',
          roomId: kitchen.id,
          state: {
            create: {
              name: 'fridge_open',
              stateType: 'Boolean',
              booleanDefaultValue: false,
            },
          },
        },
      },
      command: {
        connect: {
          id: open.id,
        },
      },
    },
    {
      effectType: 'Remove',
      order: 0,
      message: '',
      item: {
        create: {
          name: 'cookie',
          roomId: bedroom.id,
        },
      },
      command: {
        connect: {
          id: eat.id,
        },
      },
    },
    {
      effectType: 'Remove',
      order: 0,
      message: '',
      item: {
        create: {
          name: 'cheese',
          roomId: bedroom.id,
        },
      },
      command: {
        connect: {
          id: eat.id,
        },
      },
    },
    {
      effectType: 'Rename',
      order: 0,
      message: 'empty-glass',
      item: {
        create: {
          name: 'glass',
          roomId: bedroom.id,
        },
      },
      command: {
        connect: {
          id: drink.id,
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
  await prisma.effect.create({
    data: effects[2],
  })
  await prisma.effect.create({
    data: effects[3],
  })
  await prisma.effect.create({
    data: effects[4],
  })

  const fridge = await prisma.item.findFirst({
    where: {
      name: 'fridge',
    },
  })

  await prisma.effect.create({
    data: {
      effectType: 'BooleanState',
      order: 0,
      message: 'fridge_open',
      item: {
        connect: {
          id: fridge?.id,
        },
      },
      command: {
        connect: {
          id: open.id,
        },
      },
    },
  })
}

export default effect
