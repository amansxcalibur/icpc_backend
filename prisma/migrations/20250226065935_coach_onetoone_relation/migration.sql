/*
  Warnings:

  - You are about to drop the column `teamId` on the `Coach` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coachId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Coach" DROP CONSTRAINT "Coach_teamId_fkey";

-- DropIndex
DROP INDEX "Coach_teamId_key";

-- AlterTable
ALTER TABLE "Coach" DROP COLUMN "teamId";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "coachId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Team_coachId_key" ON "Team"("coachId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE SET NULL ON UPDATE CASCADE;
