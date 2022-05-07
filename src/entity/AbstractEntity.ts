import { prisma } from '../app'

abstract class AbstractEntity {
  protected readonly id

  constructor(id: number) {
    this.id = id
  }

  static getDb() {
    return prisma
  }

  getId() {
    return this.id
  }
}

export default AbstractEntity
