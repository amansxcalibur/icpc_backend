/*
  Warnings:

  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TeamMembers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Team` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamId` on the `TeamMembers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamId` on the `TeamScores` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "TeamMembers" DROP CONSTRAINT "TeamMembers_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamScores" DROP CONSTRAINT "TeamScores_teamId_fkey";

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TeamMembers" DROP CONSTRAINT "TeamMembers_pkey",
DROP COLUMN "teamId",
ADD COLUMN     "teamId" INTEGER NOT NULL,
ADD CONSTRAINT "TeamMembers_pkey" PRIMARY KEY ("teamId", "contestantId");

-- AlterTable
ALTER TABLE "TeamScores" DROP COLUMN "teamId",
ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TeamMembers" ADD CONSTRAINT "TeamMembers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamScores" ADD CONSTRAINT "TeamScores_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
