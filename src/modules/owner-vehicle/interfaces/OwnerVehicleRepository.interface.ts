import { OwnerVehicle } from "../../../../generated/prisma";
import { CreateOwnerVehicleDto } from "../dto/create-owner-vehicle.dto";
import { UpdateOwnerVehicleDto } from "../dto/update-owner-vehicle.dto";

export interface OwnerVehicleRepositoryInterface {
    findAll(): Promise<OwnerVehicle[]>;
    findById(id: number): Promise<OwnerVehicle>;
    findByUserId(userId: number): Promise<OwnerVehicle[]>;
    findByVehicleId(vehicleId: number): Promise<OwnerVehicle[]>;
    findByUserIdAndVehicleId(userId: number, vehicleId: number): Promise<OwnerVehicle | null>;
    createOwnerVehicle(ownerVehicleData: CreateOwnerVehicleDto): Promise<OwnerVehicle>;
    updateOwnerVehicle(id: number, ownerVehicleData: UpdateOwnerVehicleDto): Promise<OwnerVehicle>;
    deleteOwnerVehicle(id: number): Promise<void>;
}
