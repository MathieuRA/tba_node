import { Game } from '../src/class/game'
import { RenameEffect } from '../src/entity/Effect'

describe('Item manipulation', () => {
  const game = new Game()

  test('Init', async () => {
    await game.init()
    expect(game.getCurrentRoom().getItems().length).not.toBe(0)
  })

  test('Rename an item manually', async () => {
    const alcool = () =>
      game
        .getCurrentRoom()
        .getItems()
        .find((item) => item.getName() === 'alcool')
    const unitTestItem = () =>
      game
        .getCurrentRoom()
        .getItems()
        .find((item) => item.getName() === 'unit_test')

    if (alcool() === undefined) {
      throw new Error('You must run "npm run fixtures" for testing')
    }

    expect(unitTestItem()).toBeUndefined
    alcool()?.setName('unit_test')
    expect(unitTestItem()).not.toBeUndefined()
    expect(alcool()).toBeUndefined()
  })

  test('Rename an item using RemoveEffect', async () => {
    const glass = () =>
      game
        .getCurrentRoom()
        .getItems()
        .find((item) => item.getName() === 'glass')
    const emptyGlass = () =>
      game
        .getCurrentRoom()
        .getItems()
        .find((item) => item.getName() === 'empty-glass')

    if (glass() === undefined) {
      throw new Error('You must run "npm run fixtures" for testing')
    }

    expect(emptyGlass()).toBeUndefined()
    glass()
      ?.getEffects()
      .forEach((effect) => {
        if (effect instanceof RenameEffect) {
          effect.trigger()
        }
      })

    expect(emptyGlass()).not.toBeUndefined()
    expect(glass()).toBeUndefined()
  })
})
