import { OwnerVehicle } from "../../../generated/prisma";
import { CreateOwnerVehicleDto } from "./dto/create-owner-vehicle.dto";
import { UpdateOwnerVehicleDto } from "./dto/update-owner-vehicle.dto";
import { OwnerVehicleRepositoryInterface } from "./interfaces/OwnerVehicleRepository.interface";
import { OwnerVehicleServiceInterface } from "./interfaces/OwnerVehicleService.interface";

export class OwnerVehicleService implements OwnerVehicleServiceInterface {
    constructor(
        private readonly ownerVehicleRepository: OwnerVehicleRepositoryInterface
    ) { }

    async findAllOwnerVehicles(): Promise<OwnerVehicle[]> {
        return this.ownerVehicleRepository.findAll();
    }

    async findOwnerVehicleById(id: number): Promise<OwnerVehicle> {
        return this.ownerVehicleRepository.findById(id);
    }

    async findOwnerVehiclesByUserId(userId: number): Promise<OwnerVehicle[]> {
        return this.ownerVehicleRepository.findByUserId(userId);
    }

    async findOwnerVehiclesByVehicleId(vehicleId: number): Promise<OwnerVehicle[]> {
        return this.ownerVehicleRepository.findByVehicleId(vehicleId);
    }

    async findOwnerVehicleByUserIdAndVehicleId(userId: number, vehicleId: number): Promise<OwnerVehicle | null> {
        return this.ownerVehicleRepository.findByUserIdAndVehicleId(userId, vehicleId);
    }

    async createOwnerVehicle(ownerVehicleData: CreateOwnerVehicleDto): Promise<OwnerVehicle> {
        return this.ownerVehicleRepository.createOwnerVehicle(ownerVehicleData);
    }

    async updateOwnerVehicle(id: number, ownerVehicleData: UpdateOwnerVehicleDto): Promise<OwnerVehicle> {
        return this.ownerVehicleRepository.updateOwnerVehicle(id, ownerVehicleData);
    }

    async deleteOwnerVehicle(id: number): Promise<void> {
        return this.ownerVehicleRepository.deleteOwnerVehicle(id);
    }
}
