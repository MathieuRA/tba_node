import AbstractEntity from './AbstractEntity'
import { Effect as EffectPrisma, Item as ItemPrisma } from '@prisma/client'
import { AbstractEffect, EffectTypes, MessageEffect } from './Effect'

export type ItemWithRelation = ItemPrisma & {
  effects: EffectPrisma[]
}

class Item extends AbstractEntity {
  #name
  #effects: AbstractEffect[]

  constructor(id: number, name: string, effects: EffectPrisma[]) {
    super(id)
    this.#name = name
    this.#effects = effects.map((effect) => {
      switch (effect.effectType) {
        case EffectTypes.message:
          return new MessageEffect(
            effect.id,
            effect.order,
            effect.commandId,
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
      },
    })
    return items.map((item) => Item.fromPrismaEntity(item))
  }

  static async findBy(predicate: { id?: number }) {
    const item = await AbstractEntity.getDb().item.findUnique({
      where: predicate,
      include: {
        effects: true,
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

  // SETTERS
}

export default Item
