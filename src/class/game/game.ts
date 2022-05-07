import { Room } from '@prisma/client'
import { prisma } from '../../app'

class Game {
  #currentRoom: Room | null
  #isRunning: boolean

  constructor() {
    this.#isRunning = false
    this.#currentRoom = null
  }

  // GETTERS
  getCurrentRoom() {
    return this.#currentRoom
  }

  isRunning() {
    return this.#isRunning
  }

  // SETTERS
  async init() {
    const initRoom = await prisma.room.findUnique({
      where: {
        name: 'bedroom',
      },
      rejectOnNotFound: true,
    })
    this.#currentRoom = initRoom
    this.#isRunning = true
  }

  setCurrentRoom(room: Room) {
    this.#currentRoom = room
  }

  stop() {
    this.#isRunning = false
  }
}

export default Game
