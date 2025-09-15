/*
  Warnings:

  - You are about to drop the column `amount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shopifyId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shopifyId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shopifyId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[apiKey]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopifyId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopifyId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopifyId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apiKey` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_productId_fkey";

-- DropIndex
DROP INDEX "public"."Customer_email_key";

-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "shopifyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "amount",
DROP COLUMN "orderDate",
DROP COLUMN "productId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shopifyId" TEXT NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "name",
ADD COLUMN     "shopifyId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Tenant" ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."_OrderProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrderProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderProducts_B_index" ON "public"."_OrderProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_shopifyId_key" ON "public"."Customer"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_shopifyId_key" ON "public"."Order"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_shopifyId_key" ON "public"."Product"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_apiKey_key" ON "public"."Tenant"("apiKey");

-- AddForeignKey
ALTER TABLE "public"."_OrderProducts" ADD CONSTRAINT "_OrderProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OrderProducts" ADD CONSTRAINT "_OrderProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
