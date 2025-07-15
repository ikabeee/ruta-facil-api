/*
  Warnings:

  - You are about to drop the column `vehicle_id` on the `owner_vehicles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `routes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `route_id` to the `starred_routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `starred_routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RouteStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'IN_REVIEW', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "StopStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IncidentPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "experience" TEXT,
ADD COLUMN     "license" TEXT,
ADD COLUMN     "license_expiration" TIMESTAMP(3),
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "total_trips" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "driver_id" INTEGER,
ADD COLUMN     "owner_vehicle_id" INTEGER;

-- AlterTable
ALTER TABLE "owner_vehicles" DROP COLUMN "vehicle_id",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "last_payment" TIMESTAMP(3),
ADD COLUMN     "rfc" TEXT,
ADD COLUMN     "total_vehicles" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ratings" ADD COLUMN     "category" TEXT,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "driver" TEXT,
ADD COLUMN     "max_rating" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "route" TEXT,
ADD COLUMN     "service" TEXT,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "userId" INTEGER,
ADD COLUMN     "user_type" TEXT,
ADD COLUMN     "vehicleId" INTEGER;

-- AlterTable
ALTER TABLE "routes" ADD COLUMN     "assigned_units" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "code" TEXT,
ADD COLUMN     "daily_trips" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "distance" DOUBLE PRECISION,
ADD COLUMN     "estimated_time" INTEGER,
ADD COLUMN     "operating_hours" TEXT,
ADD COLUMN     "status" "RouteStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "total_stops" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "vehicle_id" INTEGER;

-- AlterTable
ALTER TABLE "starred_routes" ADD COLUMN     "route_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stops" ADD COLUMN     "accessibility" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "facilities" TEXT,
ADD COLUMN     "routeId" INTEGER,
ADD COLUMN     "status" "StopStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_access" TIMESTAMP(3),
ADD COLUMN     "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "fuel" DOUBLE PRECISION DEFAULT 100,
ADD COLUMN     "mileage" INTEGER DEFAULT 0,
ADD COLUMN     "next_maintenance" TIMESTAMP(3),
ADD COLUMN     "owner_id" INTEGER NOT NULL,
ADD COLUMN     "owner_vehicle_id" INTEGER,
ADD COLUMN     "passengers" INTEGER;

-- CreateTable
CREATE TABLE "incidents" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "IncidentPriority" NOT NULL DEFAULT 'MEDIUM',
    "location" TEXT,
    "unit" TEXT,
    "reportedBy" TEXT,
    "status" "IncidentStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "route_id" INTEGER NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "route_id" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "frequency" TEXT,
    "days" TEXT,
    "total_trips" INTEGER NOT NULL DEFAULT 0,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "routes_code_key" ON "routes"("code");

-- AddForeignKey
ALTER TABLE "starred_routes" ADD CONSTRAINT "starred_routes_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "starred_routes" ADD CONSTRAINT "starred_routes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "stops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_owner_vehicle_id_fkey" FOREIGN KEY ("owner_vehicle_id") REFERENCES "owner_vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_locations" ADD CONSTRAINT "vehicle_locations_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_owner_vehicle_id_fkey" FOREIGN KEY ("owner_vehicle_id") REFERENCES "owner_vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
