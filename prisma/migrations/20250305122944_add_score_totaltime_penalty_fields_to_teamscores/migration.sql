/*
  Warnings:

  - A unique constraint covering the columns `[contestId,teamId]` on the table `TeamScores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `penalty` to the `TeamScores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTime` to the `TeamScores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamScores" ADD COLUMN     "penalty" INTEGER NOT NULL,
ADD COLUMN     "totalTime" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeamScores_contestId_teamId_key" ON "TeamScores"("contestId", "teamId");
