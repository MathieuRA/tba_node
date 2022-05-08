import { primaryResponse } from '../app'
import AbstractEntity from './AbstractEntity'

interface Effect {
  trigger(): void
}

export enum EffectTypes {
  message = 'Message',
}

export abstract class AbstractEffect extends AbstractEntity implements Effect {
  #order
  #commandId
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
