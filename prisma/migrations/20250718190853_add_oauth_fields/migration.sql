-- AlterTable
ALTER TABLE "users" ADD COLUMN     "auth_provider" TEXT,
ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "provider_id" TEXT;
