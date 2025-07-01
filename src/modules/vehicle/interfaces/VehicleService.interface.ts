import { Vehicle } from "../../../../generated/prisma";
import { CreateVehicleDto } from "../dto/create-vehicle.dto";
import { UpdateVehicleDto } from "../dto/update-vehicle.dto";

export interface VehicleServiceInterface {
    findAllVehicles(): Promise<Vehicle[]>;
    findVehicleById(id: number): Promise<Vehicle>;
    findVehicleByPlate(plate: string): Promise<Vehicle>;
    createVehicle(vehicleData: CreateVehicleDto): Promise<Vehicle>;
    updateVehicle(id: number, vehicleData: UpdateVehicleDto): Promise<Vehicle>;
    deleteVehicle(id: number): Promise<void>;
}
