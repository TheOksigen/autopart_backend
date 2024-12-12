/*
  Warnings:

  - You are about to drop the column `discount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `priceWithOutKDV` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Product_OemNo_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discount",
DROP COLUMN "price",
ADD COLUMN     "discouisnt" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "manufacturerId" TEXT,
ADD COLUMN     "priceWithOutKDV" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "priceWithKDV" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
