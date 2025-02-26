/*
  Warnings:

  - You are about to drop the column `teamId` on the `Contestant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contestant" DROP CONSTRAINT "Contestant_teamId_fkey";

-- AlterTable
ALTER TABLE "Contestant" DROP COLUMN "teamId";

-- CreateTable
CREATE TABLE "TeamMembers" (
    "teamId" TEXT NOT NULL,
    "contestantId" INTEGER NOT NULL,

    CONSTRAINT "TeamMembers_pkey" PRIMARY KEY ("teamId","contestantId")
);

-- AddForeignKey
ALTER TABLE "TeamMembers" ADD CONSTRAINT "TeamMembers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMembers" ADD CONSTRAINT "TeamMembers_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "Contestant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
