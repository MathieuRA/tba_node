import AbstractEntity from './AbstractEntity'
import {
  Room as RoomPrisma,
  Effect as EffectPrisma,
  Item as ItemPrisma,
  State as StatePrisma,
} from '@prisma/client'
import {
  AbstractEffect,
  BooleanStateEffect,
  EffectTypes,
  EndGameEffect,
  MessageEffect,
  RemoveEffect,
  RenameEffect,
} from './Effect'
import Room, { RoomWithRelation } from './Room'
import State, { StateTypes } from './State'

export type ItemWithRelation = ItemPrisma & {
  effects: EffectPrisma[]
  state: StatePrisma[]
}

class Item extends AbstractEntity {
  #name
  #effects: AbstractEffect[]
  #room: Room | null
  #states?: State<unknown>[]

  constructor(
    id: number,
    name: string,
    effects: EffectPrisma[],
    states?: StatePrisma[]
  ) {
    super(id)
    this.#name = name
    this.#room = null
    this.#effects = effects.map((effect) => {
      switch (effect.effectType) {
        case EffectTypes.message:
          return new MessageEffect(
            effect.id,
            effect.order,
            effect.commandId,
            effect.message
          )
        case EffectTypes.endgame:
          return new EndGameEffect(effect.id, effect.order, effect.commandId)
        case EffectTypes.remove:
          return new RemoveEffect(
            effect.id,
            effect.order,
            effect.commandId,
            this
          )
        case EffectTypes.rename:
          return new RenameEffect(
            effect.id,
            effect.order,
            effect.commandId,
            this,
            effect.message
          )
        case EffectTypes.boolean:
          return new BooleanStateEffect(
            effect.id,
            effect.order,
            effect.commandId,
            this,
            effect.message!
          )
        default:
          throw new Error(`Invalid effect type: ${effect.effectType}`)
      }
    })
    states?.forEach((state) => {
      switch (state.stateType) {
        case StateTypes.BOOLEAN:
          new State(state.id, this, state.name, state.booleanDefaultValue!)
          break
        case StateTypes.STRING:
          new State(state.id, this, state.name, state.stringDefaultValue!)
          break
        default:
          throw new Error(`Unsuported state type: ${state.stateType}`)
      }
    })
  }
  // STATICS
  static async findAll() {
    const items = await AbstractEntity.getDb().item.findMany({
      include: {
        effects: true,
        room: true,
        state: true,
      },
    })
    return items.map((item) => Item.fromPrismaEntity(item))
  }

  static async findBy(predicate: { id?: number }) {
    const item = await AbstractEntity.getDb().item.findUnique({
      where: predicate,
      include: {
        effects: true,
        room: true,
        state: true,
      },
    })
    if (item === null) {
      return null
    }
    return Item.fromPrismaEntity(item)
  }

  static fromPrismaEntity(item: ItemWithRelation): Item {
    return new Item(item.id, item.name, item.effects, item.state)
  }

  // PRIVATES

  // GETTERS
  getEffects() {
    return this.#effects
  }
  getName() {
    return this.#name
  }

  getRoom() {
    if (this.#room === null) {
      throw new Error('Item is on any room')
    }
    return this.#room
  }

  getStates() {
    return this.#states
  }

  // SETTERS
  addState(state: State<unknown>) {
    this.#states?.push(state)
  }
  removeState(state: State<unknown>) {
    // @TODO
  }

  setName(name: string) {
    this.#name = name
  }

  setRoom(newRoom: Room | null) {
    if (newRoom === null) {
      this.#room?.removeItem(this)
      this.#room = null
      return
    }
    this.#room = newRoom
  }
}

export default Item
