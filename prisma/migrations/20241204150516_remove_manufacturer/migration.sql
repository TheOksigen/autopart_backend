/*
  Warnings:

  - You are about to drop the column `manufacturerId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Manufacturer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_manufacturerId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "manufacturerId";

-- DropTable
DROP TABLE "Manufacturer";
