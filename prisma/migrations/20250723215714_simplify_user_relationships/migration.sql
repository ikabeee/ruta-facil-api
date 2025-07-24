/*
  Warnings:

  - You are about to drop the column `driver_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `owner_vehicle_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `owner_vehicle_id` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the `drivers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owner_vehicles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_owner_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_assignments" DROP CONSTRAINT "vehicle_assignments_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_owner_vehicle_id_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "driver_id",
DROP COLUMN "owner_vehicle_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "driver_experience" TEXT,
ADD COLUMN     "driver_license" TEXT,
ADD COLUMN     "driver_license_expiration" TIMESTAMP(3),
ADD COLUMN     "driver_rating" DOUBLE PRECISION DEFAULT 4.0,
ADD COLUMN     "driver_total_trips" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_driver_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_owner_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "owner_address" TEXT,
ADD COLUMN     "owner_company" TEXT,
ADD COLUMN     "owner_contact" TEXT,
ADD COLUMN     "owner_last_payment" TIMESTAMP(3),
ADD COLUMN     "owner_rfc" TEXT,
ADD COLUMN     "owner_total_vehicles" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "owner_vehicle_id";

-- DropTable
DROP TABLE "drivers";

-- DropTable
DROP TABLE "owner_vehicles";

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
