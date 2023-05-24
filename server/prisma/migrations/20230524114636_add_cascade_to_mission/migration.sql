-- DropForeignKey
ALTER TABLE "mission" DROP CONSTRAINT "mission_userId_fkey";

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
