-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
