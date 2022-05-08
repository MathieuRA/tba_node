import { Game } from '../src/class/game'
import { INIT_ROOM_NAME } from '../src/class/game/game'
import Direction from '../src/entity/Direction'
import Room from '../src/entity/Room'

describe('Game initialization', () => {
  const game = new Game()
  let initRoom: Room | null
  let nextRoom: Room | null

  test('Init', async () => {
    initRoom = await Room.findBy({ name: INIT_ROOM_NAME })
    expect(Game.isRunning()).toBe(false)
    await game.init()
    expect(Game.isRunning()).toBe(true)
    expect(game.getCurrentRoom()).not.toBeNull()
    expect(game.getCurrentRoom()).toStrictEqual(initRoom)
    expect(game.getCurrentRoom().getItems().length).not.toBe(0)
  })

  test('Change current room', async () => {
    nextRoom = await Room.findBy({ name: 'corridor' })
    const direction = await Direction.findBy({ command: 'north' })
    if (direction === null) {
      throw new Error('Run "npm run fixtures" before doing unit test')
    }
    expect(game.getCurrentRoom().getItems().length).not.toBe(0)
    expect(game.getCurrentRoom()).toStrictEqual(initRoom)
    expect(game.getCurrentRoom()).not.toStrictEqual(nextRoom)
    await game.changeCurrentRoom(direction)
    expect(game.getCurrentRoom()).toStrictEqual(nextRoom)
    expect(game.getCurrentRoom().getItems().length).toBe(0)
  })

  test('Stop', () => {
    expect(Game.isRunning()).toBe(true)
    Game.stop()
    expect(Game.isRunning()).toBe(false)
  })
})
