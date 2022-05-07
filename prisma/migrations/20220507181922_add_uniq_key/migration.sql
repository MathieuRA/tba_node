/*
  Warnings:

  - A unique constraint covering the columns `[command]` on the table `Direction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Direction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RoomConnection_toRoomId_key";

-- DropIndex
DROP INDEX "RoomConnection_fromRoomId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Direction_command_key" ON "Direction"("command");

-- CreateIndex
CREATE UNIQUE INDEX "Direction_name_key" ON "Direction"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");
