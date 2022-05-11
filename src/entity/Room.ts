import { Room as RoomPrisma, RoomConnection } from '@prisma/client'

import AbstractEntity from './AbstractEntity'
import Direction from './Direction'
import Item, { ItemWithRelation } from './Item'

export type RoomWithRelation = RoomPrisma & {
  fromRoom: RoomConnection[]
  items: ItemWithRelation[]
}
class Room extends AbstractEntity {
  static #rooms: Array<Room>

  #name
  #connections
  #items

  constructor(
    id: number,
    name: string,
    connections: RoomConnection[],
    items: ItemWithRelation[]
  ) {
    super(id)
    this.#name = name
    this.#connections = connections
    this.#items = items.map((_item) => {
      const item = Item.fromPrismaEntity(_item)
      item.setRoom(this)
      return item
    })
  }

  // STATICS
  static async findAll() {
    if (Room.#rooms === undefined) {
      const rooms = await AbstractEntity.getDb().room.findMany({
        include: {
          fromRoom: true,
          items: {
            include: {
              effects: true,
              room: true,
              state: true,
            },
          },
        },
      })
      Room.#rooms = rooms.map((room) => Room.fromPrismaEntity(room))
    }
    return Room.#rooms
  }

  static getAllRoom() {
    return Room.#rooms
  }

  static async findBy(predicate: { name?: string; id?: number }) {
    const room = await AbstractEntity.getDb().room.findUnique({
      where: predicate,
      include: {
        fromRoom: true,
        items: {
          include: {
            effects: true,
            room: true,
            state: true,
          },
        },
      },
    })
    return room !== null
      ? new Room(room.id, room.name, room.fromRoom, room.items)
      : null
  }

  static fromPrismaEntity(room: RoomWithRelation): Room {
    return new Room(room.id, room.name, room.fromRoom, room.items)
  }

  // PRIVATES

  // GETTERS
  getConnections() {
    return this.#connections
  }

  getItems() {
    return this.#items
  }

  getName() {
    return this.#name
  }

  getRoomIdInDirection(direction: Direction): number | undefined {
    return this.#connections.find(
      (connection) => connection.directionId === direction.getId()
    )?.toRoomId
  }

  async getAvailableRoomsByDirection() {
    const rooms = await Room.findAll()
    const directions = await Direction.findAll()
    const availableRoomsByDirection = this.getConnections().map(
      (connection) => ({
        room: rooms.find((room) => room.getId() === connection.toRoomId),
        direction: directions.find(
          (direction) => direction.getId() === connection.directionId
        ),
      })
    )
    return availableRoomsByDirection
  }

  // SETTERS
  removeItem(item: Item) {
    this.setItems(
      this.getItems().filter((_item) => _item.getId() !== item.getId())
    )
  }

  setItems(items: Array<Item>) {
    this.#items = items
  }
}

export default Room
