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
    getStats(): Promise<{
        totalRecords: number;
        uniqueVehicles: number;
        recentRecords: number;
        oldestRecord: Date | null;
        latestRecord: Date | null;
        byTimeRange: {
            today: number;
            thisWeek: number;
            thisMonth: number;
        };
        mostActiveVehicles: Array<{
            vehicleId: number;
            vehicleName: string;
            plate: string;
            recordCount: number;
            lastUpdate: Date;
        }>;
    }>;
}
