import Readline from 'readline-sync'
import { PrismaClient } from '@prisma/client'
import { Game } from './class/game'
import Direction from './entity/Direction'
import Command from './entity/Command'
import Room from './entity/Room'
import Item from './entity/Item'

export const prisma = new PrismaClient()

const readline = (text: string) => Readline.question(text)

export const primaryResponse = (text: string) =>
  console.log('\x1b[36m%s\x1b[0m', text)
export const warningResponse = (text: string) =>
  console.log('\x1b[33m%s\x1b[0m', text)
export const errorResponse = (text: string) =>
  console.log('\x1b[41m%s\x1b[0m', text)
export const succesResponse = (text: string) =>
  console.log('\x1b[32m%s\x1b[0m', text)

async function main() {
  const game = new Game()
  await game.init()
  while (Game.isRunning()) {
    console.log(
      game
        .getCurrentRoom()
        .getItems()
        .forEach((item) => {
          console.log(item.getStates())
        })
    )
    console.log(`\nYou are in the ${game.getCurrentRoom().getName()}\n`)
    await game.printAvailableRooms()
    game.printAvailableItems()
    const input = readline('where you want to go ?\n')
    const splitedInput = input.split(' ')
    switch (splitedInput.length) {
      // DIRECTION
      case 1:
        const direction = await Direction.findBy({ command: input })
        if (direction === null) {
          warningResponse('Invalid direction')
          continue
        }
        await game.changeCurrentRoom(direction)
        break
      // ITEM INTERACTION
      case 2:
        const [cmd, item] = splitedInput
        const command = await Command.findBy({ command: cmd })
        if (command === null) {
          warningResponse('Invalid command.')
          continue
        }
        // Is item in the room ?
        const itemToInteractWith = game
          .getCurrentRoom()
          .getItems()
          .find((_item) => _item.getName() === item)
        if (itemToInteractWith === undefined) {
          warningResponse(`${item} not found in this room`)
          continue
        }
        // is the effect attached to the item ?
        const effects = itemToInteractWith
          .getEffects()
          .filter((effect) => effect.getCommandId() === command.getId())
          .sort((a, b) =>
            a.getOrder() < b.getOrder()
              ? -1
              : a.getOrder() < b.getOrder()
              ? 1
              : 0
          )
        console.log('\n')
        if (effects.length === 0) {
          primaryResponse(command.getDefaultMessage())
        } else {
          effects.forEach((effect) => effect.trigger())
        }
        break
      // ERROR
      default:
        errorResponse('Wrong response format')
    }
  }
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => await prisma.$disconnect())
