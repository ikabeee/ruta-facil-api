import { Vehicle } from "../../../generated/prisma";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { VehicleRepositoryInterface } from "./interfaces/VehicleRepository.interface";
import { VehicleServiceInterface } from "./interfaces/VehicleService.interface";

export class VehicleService implements VehicleServiceInterface {
    constructor(
        private readonly vehicleRepository: VehicleRepositoryInterface
    ) { }

    async findAllVehicles(): Promise<Vehicle[]> {
        return this.vehicleRepository.findAll();
    }

    async findVehicleById(id: number): Promise<Vehicle> {
        return this.vehicleRepository.findById(id);
    }

    async findVehicleByPlate(plate: string): Promise<Vehicle> {
        return this.vehicleRepository.findByPlate(plate);
    }

    async createVehicle(vehicleData: CreateVehicleDto): Promise<Vehicle> {
        return this.vehicleRepository.createVehicle(vehicleData);
    }

    async updateVehicle(id: number, vehicleData: UpdateVehicleDto): Promise<Vehicle> {
        return this.vehicleRepository.updateVehicle(id, vehicleData);
    }

    async deleteVehicle(id: number): Promise<void> {
        return this.vehicleRepository.deleteVehicle(id);
    }
}
