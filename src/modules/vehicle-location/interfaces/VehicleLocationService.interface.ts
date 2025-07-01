import { VehicleLocation } from "../../../../generated/prisma";
import { CreateVehicleLocationDto } from "../dto/create-vehicle-location.dto";
import { UpdateVehicleLocationDto } from "../dto/update-vehicle-location.dto";


export interface VehicleLocationServiceInterface {
    findAllVehicleLocations(): Promise<VehicleLocation[]>;
    findVehicleLocationById(id: number): Promise<VehicleLocation>;
    findVehicleLocationsByVehicleId(vehicleId: number): Promise<VehicleLocation[]>;
    findLatestVehicleLocationByVehicleId(vehicleId: number): Promise<VehicleLocation>;
    createVehicleLocation(vehicleLocationData: CreateVehicleLocationDto): Promise<VehicleLocation>;
    updateVehicleLocation(id: number, vehicleLocationData: UpdateVehicleLocationDto): Promise<VehicleLocation>;
    deleteVehicleLocation(id: number): Promise<void>;
}
