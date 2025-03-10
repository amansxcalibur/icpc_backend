/*
  Warnings:

  - The primary key for the `TeamScores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TeamScores` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `TeamScores` table. All the data in the column will be lost.
  - Added the required column `problemsSolved` to the `TeamScores` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TeamScores_contestId_teamId_key";

-- AlterTable
ALTER TABLE "TeamScores" DROP CONSTRAINT "TeamScores_pkey",
DROP COLUMN "id",
DROP COLUMN "score",
ADD COLUMN     "problemsSolved" INTEGER NOT NULL,
ADD COLUMN     "rank" INTEGER,
ADD CONSTRAINT "TeamScores_pkey" PRIMARY KEY ("contestId", "teamId");
