import Readline from 'readline-sync'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

const readline = (text: string) => Readline.question(text)

async function main() {}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => await prisma.$disconnect())
