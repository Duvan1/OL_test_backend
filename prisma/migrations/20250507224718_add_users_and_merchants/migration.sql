/*
  Warnings:

  - A unique constraint covering the columns `[name,municipality_id]` on the table `establishments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `merchant_id` to the `establishments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "establishments" ADD COLUMN     "merchant_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "document_number" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "merchants_document_number_key" ON "merchants"("document_number");

-- CreateIndex
CREATE UNIQUE INDEX "establishments_name_municipality_id_key" ON "establishments"("name", "municipality_id");

-- AddForeignKey
ALTER TABLE "establishments" ADD CONSTRAINT "establishments_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
