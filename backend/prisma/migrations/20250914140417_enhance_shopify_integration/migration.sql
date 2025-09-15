/*
  Warnings:

  - A unique constraint covering the columns `[shopifyDomain]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ordersCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "financialStatus" TEXT,
ADD COLUMN     "fulfillmentStatus" TEXT,
ADD COLUMN     "orderNumber" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalDiscounts" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalTax" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "compareAtPrice" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "inventory" INTEGER,
ADD COLUMN     "productType" TEXT,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "tags" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "vendor" TEXT;

-- AlterTable
ALTER TABLE "public"."Tenant" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "shopifyDomain" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "webhookSecret" TEXT;

-- CreateTable
CREATE TABLE "public"."CustomEvent" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "customerId" INTEGER,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB,
    "value" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_shopifyDomain_key" ON "public"."Tenant"("shopifyDomain");

-- AddForeignKey
ALTER TABLE "public"."CustomEvent" ADD CONSTRAINT "CustomEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomEvent" ADD CONSTRAINT "CustomEvent_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
