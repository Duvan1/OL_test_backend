/*
  Warnings:

  - You are about to drop the column `annual_income` on the `establishments` table. All the data in the column will be lost.
  - You are about to drop the column `employees` on the `establishments` table. All the data in the column will be lost.
  - Added the required column `employee_count` to the `establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenue` to the `establishments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "annual_income",
DROP COLUMN "employees",
ADD COLUMN     "employee_count" INTEGER NOT NULL,
ADD COLUMN     "revenue" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';
