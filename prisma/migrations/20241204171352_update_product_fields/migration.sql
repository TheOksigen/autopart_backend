-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "manufacturer" TEXT DEFAULT '',
ALTER COLUMN "iskonto" DROP NOT NULL;
