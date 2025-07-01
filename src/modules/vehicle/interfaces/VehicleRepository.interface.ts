import { Vehicle } from "../../../../generated/prisma";
import { CreateVehicleDto } from "../dto/create-vehicle.dto";
import { UpdateVehicleDto } from "../dto/update-vehicle.dto";

export interface VehicleRepositoryInterface {
    findAll(): Promise<Vehicle[]>;
    findById(id: number): Promise<Vehicle>;
    findByPlate(plate: string): Promise<Vehicle>;
    createVehicle(vehicleData: CreateVehicleDto): Promise<Vehicle>;
    updateVehicle(id: number, vehicleData: UpdateVehicleDto): Promise<Vehicle>;
    deleteVehicle(id: number): Promise<void>;
}
