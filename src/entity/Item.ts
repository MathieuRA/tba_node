import AbstractEntity from './AbstractEntity'
import {
  Room as RoomPrisma,
  Effect as EffectPrisma,
  Item as ItemPrisma,
} from '@prisma/client'
import {
  AbstractEffect,
  EffectTypes,
  EndGameEffect,
  MessageEffect,
  RemoveEffect,
  RenameEffect,
} from './Effect'
import Room, { RoomWithRelation } from './Room'

export type ItemWithRelation = ItemPrisma & {
  effects: EffectPrisma[]
}

class Item extends AbstractEntity {
  #name
  #effects: AbstractEffect[]
  #room: Room | null

  constructor(id: number, name: string, effects: EffectPrisma[]) {
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
        default:
          throw new Error(`Invalid effect type: ${effect.effectType}`)
      }
    })
  }
  // STATICS
  static async findAll() {
    const items = await AbstractEntity.getDb().item.findMany({
      include: {
        effects: true,
        room: true,
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
      },
    })
    if (item === null) {
      return null
    }
    return Item.fromPrismaEntity(item)
  }

  static fromPrismaEntity(item: ItemWithRelation): Item {
    return new Item(item.id, item.name, item.effects)
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

  // // SETTERS
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
