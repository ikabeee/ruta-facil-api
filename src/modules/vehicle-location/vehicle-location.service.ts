import { VehicleLocation } from "../../../generated/prisma";
import { CreateVehicleLocationDto } from "./dto/create-vehicle-location.dto";
import { UpdateVehicleLocationDto } from "./dto/update-vehicle-location.dto";
import { VehicleLocationRepositoryInterface } from "./interfaces/VehicleLocationRepository.interface";
import { VehicleLocationServiceInterface } from "./interfaces/VehicleLocationService.interface";

export class VehicleLocationService implements VehicleLocationServiceInterface {
    constructor(
        private readonly vehicleLocationRepository: VehicleLocationRepositoryInterface
    ) { }

    async findAllVehicleLocations(): Promise<VehicleLocation[]> {
        return this.vehicleLocationRepository.findAll();
    }

    async findVehicleLocationById(id: number): Promise<VehicleLocation> {
        return this.vehicleLocationRepository.findById(id);
    }

    async findVehicleLocationsByVehicleId(vehicleId: number): Promise<VehicleLocation[]> {
        return this.vehicleLocationRepository.findByVehicleId(vehicleId);
    }

    async findLatestVehicleLocationByVehicleId(vehicleId: number): Promise<VehicleLocation> {
        return this.vehicleLocationRepository.findLatestByVehicleId(vehicleId);
    }

    async createVehicleLocation(vehicleLocationData: CreateVehicleLocationDto): Promise<VehicleLocation> {
        return this.vehicleLocationRepository.createVehicleLocation(vehicleLocationData);
    }

    async updateVehicleLocation(id: number, vehicleLocationData: UpdateVehicleLocationDto): Promise<VehicleLocation> {
        return this.vehicleLocationRepository.updateVehicleLocation(id, vehicleLocationData);
    }

    async deleteVehicleLocation(id: number): Promise<void> {
        return this.vehicleLocationRepository.deleteVehicleLocation(id);
    }

    async getStats(): Promise<{
        totalRecords: number;
        uniqueVehicles: number;
        recentRecords: number; // Last 24 hours
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
    }> {
        return this.vehicleLocationRepository.getStats();
    }
}
