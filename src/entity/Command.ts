import AbstractEntity from './AbstractEntity'
import { Command as CommandPrisma } from '@prisma/client'
class Command extends AbstractEntity {
  static #commands: Array<Command>
  #command
  #defaultMessage

  constructor(id: number, command: string, defaultMessage: string) {
    super(id)
    this.#command = command
    this.#defaultMessage = defaultMessage
  }

  // STATICS
  static async findAll() {
    if (Command.#commands === undefined) {
      const commands = await AbstractEntity.getDb().command.findMany()
      this.#commands = commands.map((command) =>
        Command.fromPrismaEntity(command)
      )
    }
    return Command.#commands
  }

  static async findBy(predicate: { command?: string; id?: number }) {
    const command = await AbstractEntity.getDb().command.findUnique({
      where: predicate,
    })
    if (command === null) {
      return null
    }
    return Command.fromPrismaEntity(command)
  }

  static fromPrismaEntity(command: CommandPrisma): Command {
    return new Command(command.id, command.command, command.default_message)
  }

  // GETTERS
  getCommand() {
    return this.#command
  }

  getDefaultMessage() {
    return this.#defaultMessage
  }
}

export default Command
