/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Command" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "command" TEXT NOT NULL,
    "default_message" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Direction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "command" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Effect" (
    "effectType" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "commandId" INTEGER NOT NULL,
    "message" TEXT,
    CONSTRAINT "Effect_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Effect_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    CONSTRAINT "Item_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "RoomConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromRoomId" INTEGER NOT NULL,
    "toRoomId" INTEGER NOT NULL,
    "directionId" INTEGER NOT NULL,
    CONSTRAINT "RoomConnection_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "RoomConnection_fromRoomId_fkey" FOREIGN KEY ("fromRoomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "RoomConnection_toRoomId_fkey" FOREIGN KEY ("toRoomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "State" (
    "stateType" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "booleanDefaultValue" BOOLEAN,
    "numberDefaultValue" REAL,
    "stringDefaultValue" TEXT,
    CONSTRAINT "State_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "Command_command_key" ON "Command"("command");

-- CreateIndex
CREATE UNIQUE INDEX "Direction_command_name_key" ON "Direction"("command", "name");

-- CreateIndex
CREATE INDEX "Effect_commandId_itemId_idx" ON "Effect"("commandId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Effect_commandId_key" ON "Effect"("commandId");

-- CreateIndex
CREATE INDEX "Item_roomId_idx" ON "Item"("roomId");

-- CreateIndex
CREATE INDEX "RoomConnection_directionId_fromRoomId_toRoomId_idx" ON "RoomConnection"("directionId", "fromRoomId", "toRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomConnection_directionId_key" ON "RoomConnection"("directionId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomConnection_fromRoomId_key" ON "RoomConnection"("fromRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomConnection_toRoomId_key" ON "RoomConnection"("toRoomId");

-- CreateIndex
CREATE INDEX "State_itemId_idx" ON "State"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "State_itemId_key" ON "State"("itemId");
