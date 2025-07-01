import { OwnerVehicle } from "../../../../generated/prisma";
import { CreateOwnerVehicleDto } from "../dto/create-owner-vehicle.dto";
import { UpdateOwnerVehicleDto } from "../dto/update-owner-vehicle.dto";

export interface OwnerVehicleServiceInterface {
    findAllOwnerVehicles(): Promise<OwnerVehicle[]>;
    findOwnerVehicleById(id: number): Promise<OwnerVehicle>;
    findOwnerVehiclesByUserId(userId: number): Promise<OwnerVehicle[]>;
    findOwnerVehiclesByVehicleId(vehicleId: number): Promise<OwnerVehicle[]>;
    findOwnerVehicleByUserIdAndVehicleId(userId: number, vehicleId: number): Promise<OwnerVehicle | null>;
    createOwnerVehicle(ownerVehicleData: CreateOwnerVehicleDto): Promise<OwnerVehicle>;
    updateOwnerVehicle(id: number, ownerVehicleData: UpdateOwnerVehicleDto): Promise<OwnerVehicle>;
    deleteOwnerVehicle(id: number): Promise<void>;
}
