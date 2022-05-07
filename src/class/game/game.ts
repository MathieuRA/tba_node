import Direction from '../../entity/Direction'
import Room from '../../entity/Room'

export const INIT_ROOM_NAME = 'bedroom'

class Game {
  #currentRoom: Room | null
  #isRunning: boolean

  constructor() {
    this.#isRunning = false
    this.#currentRoom = null
  }

  // PRIVATES
  #setCurrentRoom(room: Room) {
    this.#currentRoom = room
  }

  // GETTERS
  getCurrentRoom() {
    if (this.#currentRoom === null) {
      throw new Error('The game have to be initilized first.')
    }
    return this.#currentRoom
  }

  isRunning() {
    return this.#isRunning
  }

  // SETTERS
  async changeCurrentRoom(direction: Direction) {
    const nextRoom = (await Room.findAll()).find(
      (room) =>
        room.getId() === this.getCurrentRoom().getRoomIdInDirection(direction)
    )
    if (nextRoom === undefined) {
      console.log('There is not room in this direction')
      return
    }
    this.#setCurrentRoom(nextRoom)
  }

  async init() {
    const initRoom = (await Room.findAll()).find(
      (room) => room.getName() === INIT_ROOM_NAME
    )
    if (initRoom === undefined) {
      throw new Error(`Invalid room: ${INIT_ROOM_NAME}`)
    }

    this.#currentRoom = initRoom
    this.#isRunning = true
  }

  stop() {
    this.#isRunning = false
  }

  // PRINTERS
  async printAvailableRooms() {
    const roomsByDirection =
      await this.getCurrentRoom().getAvailableRoomsByDirection()
    if (roomsByDirection.length === 0) {
      console.log('There is no room to go !')
      return
    }
    console.log('You can go: ')
    roomsByDirection.forEach(async ({ direction, room }) => {
      console.log(`-  ${direction?.getName()} is ${room!.getName()}`)
    })
  }
}

export default Game
