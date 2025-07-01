import { PrismaClient, Vehicle } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { VehicleRepositoryInterface } from "./interfaces/VehicleRepository.interface";

export class VehicleRepository implements VehicleRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<Vehicle[]> {
        const vehicles = await this.prisma.vehicle.findMany();
        return vehicles;
    }

    async findById(id: number): Promise<Vehicle> {
        try {
            const vehicle = await this.prisma.vehicle.findUnique({
                where: { id }
            });
            if (!vehicle) {
                throw new ApiError(404, `Vehículo con id ${id} no encontrado.`);
            }
            return vehicle;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar el vehículo con id ${id}`);
        }
    }

    async findByPlate(plate: string): Promise<Vehicle> {
        try {
            const vehicle = await this.prisma.vehicle.findUnique({
                where: { plate }
            });
            if (!vehicle) {
                throw new ApiError(404, `Vehículo con placa ${plate} no encontrado.`);
            }
            return vehicle;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar el vehículo con placa ${plate}`);
        }
    }

    async createVehicle(vehicleData: CreateVehicleDto): Promise<Vehicle> {
        try {
            const existingVehicle = await this.prisma.vehicle.findUnique({
                where: { plate: vehicleData.plate }
            });

            if (existingVehicle) {
                throw new ApiError(409, `Vehículo con placa ${vehicleData.plate} ya existe.`);
            }

            const vehicle = await this.prisma.vehicle.create({
                data: vehicleData
            });
            return vehicle;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear el vehículo: ${error.message}`);
        }
    }

    async updateVehicle(id: number, vehicleData: UpdateVehicleDto): Promise<Vehicle> {
        try {
            const vehicle = await this.prisma.vehicle.findUnique({
                where: { id }
            });
            if (!vehicle) {
                throw new ApiError(404, `Vehículo con id ${id} no encontrado.`);
            }

            // Verificar si la placa ya existe en otro vehículo
            if (vehicleData.plate) {
                const existingVehicle = await this.prisma.vehicle.findUnique({
                    where: { plate: vehicleData.plate }
                });
                if (existingVehicle && existingVehicle.id !== id) {
                    throw new ApiError(409, `Ya existe otro vehículo con la placa ${vehicleData.plate}.`);
                }
            }

            const vehicleUpdated = await this.prisma.vehicle.update({
                where: { id },
                data: vehicleData
            });
            return vehicleUpdated;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar el vehículo con id ${id}`);
        }
    }

    async deleteVehicle(id: number): Promise<void> {
        try {
            const vehicle = await this.prisma.vehicle.findUnique({
                where: { id }
            });
            if (!vehicle) {
                throw new ApiError(404, `Vehículo con id ${id} no encontrado.`);
            }
            await this.prisma.vehicle.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar el vehículo con id ${id}`);
        }
    }
}