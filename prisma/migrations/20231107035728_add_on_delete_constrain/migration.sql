-- DropForeignKey
ALTER TABLE "verifications" DROP CONSTRAINT "verifications_userId_fkey";

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
