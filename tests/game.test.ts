import { Room } from '@prisma/client'
import { prisma } from '../src/app'
import { Game } from '../src/class/game'

describe('Game initialization', () => {
  const game = new Game()
  let initRoom: Room | null

  test('Init', async () => {
    initRoom = await prisma.room.findUnique({
      where: {
        name: 'bedroom',
      },
    })
    expect(game.isRunning()).toBe(false)
    expect(game.getCurrentRoom()).toBeNull()
    await game.init()
    expect(game.isRunning()).toBe(true)
    expect(game.getCurrentRoom()).not.toBeNull()
    expect(game.getCurrentRoom()).toStrictEqual(initRoom)
  })

  test('Change current room', () => {
    expect(game.getCurrentRoom()).toStrictEqual(initRoom)
    game.setCurrentRoom(initRoom!)
    expect(game.getCurrentRoom()).toStrictEqual(initRoom)
  })

  test('Stop', () => {
    expect(game.isRunning()).toBe(true)
    game.stop()
    expect(game.isRunning()).toBe(false)
  })
})
