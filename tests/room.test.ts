import { Game } from '../src/class/game'
import { RemoveEffect } from '../src/entity/Effect'
describe('Item manipulation from the room', () => {
  test('Init', async () => {
    const game = new Game()
    await game.init()
    expect(game.getCurrentRoom().getItems().length).not.toBe(0)
  })

  test('Remove an item from the room manually', async () => {
    const game = new Game()
    await game.init()
    const cookie = game
      .getCurrentRoom()
      .getItems()
      .find((item) => item.getName() === 'cookie')
    if (cookie === undefined) {
      throw new Error('You must run "npm run fixtures" before testing')
    }
    game.getCurrentRoom().removeItem(cookie)
    const removedCookie = game
      .getCurrentRoom()
      .getItems()
      .find((item) => item.getName() === 'cookie')
    expect(removedCookie).toBeUndefined()
  })

  test('Remove an item from the room using RemoveEffect', async () => {
    const game = new Game()
    await game.init()
    const cheese = game
      .getCurrentRoom()
      .getItems()
      .find((item) => item.getName() === 'cheese')

    if (cheese === undefined) {
      throw new Error('You must run "npm run fixtures" before testing')
    }

    cheese.getEffects().forEach((effect) => {
      if (effect instanceof RemoveEffect) {
        effect.trigger()
      }
    })

    const removedCookie = game
      .getCurrentRoom()
      .getItems()
      .find((item) => item.getName() === 'cheese')
    expect(removedCookie).toBeUndefined()
  })
})
