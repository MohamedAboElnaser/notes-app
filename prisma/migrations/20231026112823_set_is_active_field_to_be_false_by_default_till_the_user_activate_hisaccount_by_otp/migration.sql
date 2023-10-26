/*
  Warnings:

  - You are about to drop the `verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "verification" DROP CONSTRAINT "verification_userId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT false;

-- DropTable
DROP TABLE "verification";

-- CreateTable
CREATE TABLE "verifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "otp" TEXT NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verifications_id_key" ON "verifications"("id");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_userId_key" ON "verifications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_otp_key" ON "verifications"("otp");

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
