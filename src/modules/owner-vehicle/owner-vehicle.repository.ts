import { PrismaClient, OwnerVehicle } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateOwnerVehicleDto } from "./dto/create-owner-vehicle.dto";
import { UpdateOwnerVehicleDto } from "./dto/update-owner-vehicle.dto";
import { OwnerVehicleRepositoryInterface } from "./interfaces/OwnerVehicleRepository.interface";

export class OwnerVehicleRepository implements OwnerVehicleRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<OwnerVehicle[]> {
        const ownerVehicles = await this.prisma.ownerVehicle.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return ownerVehicles;
    }

    async findById(id: number): Promise<OwnerVehicle> {
        try {
            const ownerVehicle = await this.prisma.ownerVehicle.findUnique({
                where: { id }
            });
            if (!ownerVehicle) {
                throw new ApiError(404, `Propietario de vehículo con id ${id} no encontrado.`);
            }
            return ownerVehicle;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar el propietario de vehículo con id ${id}`);
        }
    }

    async findByUserId(userId: number): Promise<OwnerVehicle[]> {
        try {
            const ownerVehicles = await this.prisma.ownerVehicle.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
            return ownerVehicles;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar vehículos del usuario con id ${userId}`);
        }
    }

    async findByVehicleId(vehicleId: number): Promise<OwnerVehicle[]> {
        try {
            const ownerVehicles = await this.prisma.ownerVehicle.findMany({
                where: { vehicleId },
                orderBy: { createdAt: 'desc' }
            });
            return ownerVehicles;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar propietarios del vehículo con id ${vehicleId}`);
        }
    }

    async findByUserIdAndVehicleId(userId: number, vehicleId: number): Promise<OwnerVehicle | null> {
        try {
            const ownerVehicle = await this.prisma.ownerVehicle.findFirst({
                where: {
                    userId,
                    vehicleId
                }
            });
            return ownerVehicle;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar relación usuario-vehículo`);
        }
    }

    async createOwnerVehicle(ownerVehicleData: CreateOwnerVehicleDto): Promise<OwnerVehicle> {
        try {
            // Verificar si ya existe una relación entre el usuario y el vehículo
            const existingRelation = await this.prisma.ownerVehicle.findFirst({
                where: {
                    userId: ownerVehicleData.userId,
                    vehicleId: ownerVehicleData.vehicleId
                }
            });

            if (existingRelation) {
                throw new ApiError(409, `La relación entre el usuario ${ownerVehicleData.userId} y el vehículo ${ownerVehicleData.vehicleId} ya existe.`);
            }

            const ownerVehicle = await this.prisma.ownerVehicle.create({
                data: ownerVehicleData
            });
            return ownerVehicle;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear la relación propietario-vehículo: ${error.message}`);
        }
    }

    async updateOwnerVehicle(id: number, ownerVehicleData: UpdateOwnerVehicleDto): Promise<OwnerVehicle> {
        try {
            const ownerVehicle = await this.prisma.ownerVehicle.findUnique({
                where: { id }
            });
            if (!ownerVehicle) {
                throw new ApiError(404, `Propietario de vehículo con id ${id} no encontrado.`);
            }

            // Si se están actualizando userId o vehicleId, verificar que no haya conflictos
            if ((ownerVehicleData.userId && ownerVehicleData.userId !== ownerVehicle.userId) ||
                (ownerVehicleData.vehicleId && ownerVehicleData.vehicleId !== ownerVehicle.vehicleId)) {
                
                const checkUserId = ownerVehicleData.userId || ownerVehicle.userId;
                const checkVehicleId = ownerVehicleData.vehicleId || ownerVehicle.vehicleId;

                const existingRelation = await this.prisma.ownerVehicle.findFirst({
                    where: {
                        userId: checkUserId,
                        vehicleId: checkVehicleId,
                        id: { not: id }
                    }
                });

                if (existingRelation) {
                    throw new ApiError(409, `La relación entre el usuario ${checkUserId} y el vehículo ${checkVehicleId} ya existe.`);
                }
            }

            const updatedOwnerVehicle = await this.prisma.ownerVehicle.update({
                where: { id },
                data: ownerVehicleData
            });
            return updatedOwnerVehicle;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar el propietario de vehículo con id ${id}`);
        }
    }

    async deleteOwnerVehicle(id: number): Promise<void> {
        try {
            const ownerVehicle = await this.prisma.ownerVehicle.findUnique({
                where: { id }
            });
            if (!ownerVehicle) {
                throw new ApiError(404, `Propietario de vehículo con id ${id} no encontrado.`);
            }
            await this.prisma.ownerVehicle.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar el propietario de vehículo con id ${id}`);
        }
    }
}