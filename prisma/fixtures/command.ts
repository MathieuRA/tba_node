import { PrismaClient } from '@prisma/client'

const commands = [
  {
    command: 'sleep',
    default_message: 'Not enought confortable',
  },
  {
    command: 'open',
    default_message: 'You cannot open this one !',
  },
]

async function command(prisma: PrismaClient) {
  await Promise.all(
    commands.map((command) => prisma.command.create({ data: command }))
  )
}

export default command
