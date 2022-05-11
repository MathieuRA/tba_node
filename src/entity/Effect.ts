import { primaryResponse } from '../app'
import { Game } from '../class/game'
import AbstractEntity from './AbstractEntity'
import Item from './Item'

interface Effect {
  trigger(): void
}

export enum EffectTypes {
  message = 'Message',
  endgame = 'EndGame',
  rename = 'Rename',
  remove = 'Remove',
  boolean = 'BooleanState',
}

export abstract class AbstractEffect extends AbstractEntity implements Effect {
  readonly #order
  readonly #commandId
  constructor(id: number, order: number, commandId: number) {
    super(id)
    this.#order = order
    this.#commandId = commandId
  }
  // STATICS

  // PRIVATES

  // GETTERS

  getOrder() {
    return this.#order
  }

  getCommandId() {
    return this.#commandId
  }

  // SETTERS

  // INTERFACES
  abstract trigger(): void
}

export class MessageEffect extends AbstractEffect {
  #message
  constructor(
    id: number,
    order: number,
    commandId: number,
    message: string | null
  ) {
    super(id, order, commandId)
    this.#message = message ?? `You must define message for the effect: ${id}`
  }

  trigger(): void {
    primaryResponse(this.#message)
  }
}

export class EndGameEffect extends AbstractEffect {
  readonly #game

  constructor(id: number, order: number, commandId: number) {
    super(id, order, commandId)
    this.#game = Game
  }

  trigger(): void {
    this.#game.stop()
  }
}

export class RemoveEffect extends AbstractEffect {
  readonly #item

  constructor(id: number, order: number, commandId: number, item: Item) {
    super(id, order, commandId)
    this.#item = item
  }

  trigger(): void {
    this.#item.getRoom().removeItem(this.#item)
  }
}

export class RenameEffect extends AbstractEffect {
  readonly #item
  readonly #name
  constructor(
    id: number,
    order: number,
    commandId: number,
    item: Item,
    name: string | null
  ) {
    super(id, order, commandId)
    this.#item = item
    this.#name = name ?? `You must define a new name for the effect: ${id}`
  }

  trigger(): void {
    this.#item.setName(this.#name)
  }
}

export class BooleanStateEffect extends AbstractEffect {
  readonly #item
  readonly #name

  constructor(
    id: number,
    order: number,
    commandId: number,
    item: Item,
    name: string
  ) {
    super(id, order, commandId)
    this.#item = item
    this.#name = name
  }
  trigger(): void {
    console.log('triggered')
    // console.log(this.#item.getStates())
    const state = this.#item.getStates()?.find((state) => {
      // console.log(state.getName())
      return state.getName() === this.#name
    })
    // if (state === undefined) {
    //   throw new Error(
    //     `No state found for item: ${this.#item.getId()} with name: ${
    //       this.#name
    //     }`
    //   )
    // }
    // state?.setValue(!state.getValue())
  }
}
