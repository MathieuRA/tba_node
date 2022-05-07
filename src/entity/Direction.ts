import AbstractEntity from './AbstractEntity'
import { Direction as _DirectionPrisma } from '@prisma/client'

type DirectionPrisma = _DirectionPrisma

class Direction extends AbstractEntity {
  static #direction: Array<Direction>
  readonly #command
  readonly #name

  constructor(id: number, command: string, name: string) {
    super(id)
    this.#command = command
    this.#name = name
  }

  // STATICS
  static async findAll() {
    if (Direction.#direction === undefined) {
      const directions = await AbstractEntity.getDb().direction.findMany()
      Direction.#direction = directions.map(
        (direction) =>
          new Direction(direction.id, direction.command, direction.name)
      )
    }
    return Direction.#direction
  }

  static async findBy(predicate: { command?: string; id?: number }) {
    const direction = await AbstractEntity.getDb().direction.findUnique({
      where: predicate,
    })
    return direction !== null
      ? new Direction(direction.id, direction.command, direction.name)
      : null
  }

  static fromPrismaEntity(direction: DirectionPrisma) {
    return new Direction(direction.id, direction.command, direction.name)
  }

  // PRIVATES

  // GETTERS
  getName() {
    return this.#name
  }

  // SETTERS
}

export default Direction
