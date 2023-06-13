/*
  Warnings:

  - Added the required column `gold` to the `mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mission" ADD COLUMN     "gold" INTEGER NOT NULL;
