import Readline from 'readline-sync'
import { PrismaClient } from '@prisma/client'
import Room from './entity/Room'
import { Game } from './class/game'
import Direction from './entity/Direction'

export const prisma = new PrismaClient()

const readline = (text: string) => Readline.question(text)
/**
async function main() {
  const game = new Game()
  await game.init()
  while (true) {
    console.log(`You are in the ${game.getCurrentRoom().getName()}`)
    await game.printAvailableRooms()
    const input = readline('where you want to go ?\n')
    const direction = await Direction.findBy({ command: input })
    if (direction === null) {
      console.log('Invalid direction')
      continue
    }
    await game.changeCurrentRoom(direction)
  }
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => await prisma.$disconnect())
*/
