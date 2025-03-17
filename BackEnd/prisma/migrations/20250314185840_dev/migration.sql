/*
  Warnings:

  - The primary key for the `Prompt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Prompt` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `content` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_createdBy_fkey";

-- AlterTable
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "description",
DROP COLUMN "updatedAt",
ADD COLUMN     "content" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Prompt_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "role" DROP DEFAULT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "AssignedPrompt" (
    "id" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,

    CONSTRAINT "AssignedPrompt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssignedPrompt" ADD CONSTRAINT "AssignedPrompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedPrompt" ADD CONSTRAINT "AssignedPrompt_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
