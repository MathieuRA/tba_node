import { Direction, PrismaClient, Room } from '@prisma/client'

async function room_connection(prisma: PrismaClient) {
  await prisma.roomConnection.deleteMany({})
  const [directions, rooms] = await Promise.all([
    prisma.direction.findMany(),
    prisma.room.findMany(),
  ])

  // east, weast, south, north
  const directionsByCommand: { [key: string]: Direction } = {}
  // bedroom, corridorn bathroom, kitchen
  const roomsByName: { [key: string]: Room } = {}

  directions.forEach(
    (direction) => (directionsByCommand[direction.command] = direction)
  )
  rooms.forEach((room) => (roomsByName[room.name] = room))
  const room_connections = [
    {
      directionId: directionsByCommand.north.id,
      fromRoomId: roomsByName.bedroom.id,
      toRoomId: roomsByName.corridor.id,
    },
    {
      directionId: directionsByCommand.south.id,
      fromRoomId: roomsByName.bedroom.id,
      toRoomId: roomsByName.bathroom.id,
    },
    {
      directionId: directionsByCommand.south.id,
      fromRoomId: roomsByName.corridor.id,
      toRoomId: roomsByName.bedroom.id,
    },
    {
      directionId: directionsByCommand.west.id,
      fromRoomId: roomsByName.corridor.id,
      toRoomId: roomsByName.kitchen.id,
    },
    {
      directionId: directionsByCommand.north.id,
      fromRoomId: roomsByName.bathroom.id,
      toRoomId: roomsByName.bedroom.id,
    },
    {
      directionId: directionsByCommand.east.id,
      fromRoomId: roomsByName.kitchen.id,
      toRoomId: roomsByName.corridor.id,
    },
  ]

  await Promise.all(
    room_connections.map((connection) =>
      prisma.roomConnection.create({
        data: connection,
      })
    )
  )
}

export default room_connection
