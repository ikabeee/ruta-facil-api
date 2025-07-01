import { VehicleLocation } from "../../../../generated/prisma";
import { CreateVehicleLocationDto } from "../dto/create-vehicle-location.dto";
import { UpdateVehicleLocationDto } from "../dto/update-vehicle-location.dto";


export interface VehicleLocationRepositoryInterface {
    findAll(): Promise<VehicleLocation[]>;
    findById(id: number): Promise<VehicleLocation>;
    findByVehicleId(vehicleId: number): Promise<VehicleLocation[]>;
    findLatestByVehicleId(vehicleId: number): Promise<VehicleLocation>;
    createVehicleLocation(vehicleLocationData: CreateVehicleLocationDto): Promise<VehicleLocation>;
    updateVehicleLocation(id: number, vehicleLocationData: UpdateVehicleLocationDto): Promise<VehicleLocation>;
    deleteVehicleLocation(id: number): Promise<void>;
}
