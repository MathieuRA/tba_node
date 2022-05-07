import { Room as RoomPrisma, RoomConnection } from '@prisma/client'

import AbstractEntity from './AbstractEntity'
import Direction from './Direction'

type RoomWithConnection = RoomPrisma & {
  fromRoom: RoomConnection[]
}
class Room extends AbstractEntity {
  static #rooms: Array<Room>

  #name
  #connections

  constructor(id: number, name: string, connections: RoomConnection[]) {
    super(id)
    this.#name = name
    this.#connections = connections
  }

  // STATICS
  static async findAll() {
    if (Room.#rooms === undefined) {
      const rooms = await AbstractEntity.getDb().room.findMany({
        include: {
          fromRoom: true,
        },
      })
      Room.#rooms = rooms.map((room) => Room.fromPrismaEntity(room))
    }
    return Room.#rooms
  }

  static async findBy(predicate: { name?: string; id?: number }) {
    const room = await AbstractEntity.getDb().room.findUnique({
      where: predicate,
      include: {
        fromRoom: true,
      },
    })
    return room !== null ? new Room(room.id, room.name, room.fromRoom) : null
  }

  static fromPrismaEntity(room: RoomWithConnection): Room {
    return new Room(room.id, room.name, room.fromRoom)
  }

  // PRIVATES

  // GETTERS
  getConnections() {
    return this.#connections
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
}

export default Room

// const availableRoomsByDirection = this.getConnections().map(
//   async (connection) => ({
//     room: (await Room.findAll()).find(
//       (room) => room.getId() === connection.fromRoomId
//     ),
//     direction: (await Direction.findAll()).find(
//       (direction) => direction.getId() === connection.directionId
//     ),
//   })
// )
// return availableRoomsByDirection
