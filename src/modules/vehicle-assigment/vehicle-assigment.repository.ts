import { PrismaClient, VehicleAssignment } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateVehicleAssignmentDto } from "./dto/create-vehicle-assignment.dto";
import { UpdateVehicleAssignmentDto } from "./dto/update-vehicle-assignment.dto";
import { VehicleAssignmentRepositoryInterface } from "./interfaces/VehicleAssignmentRepository.interface";

export class VehicleAssignmentRepository implements VehicleAssignmentRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<VehicleAssignment[]> {
        const vehicleAssignments = await this.prisma.vehicleAssignment.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return vehicleAssignments;
    }

    async findById(id: number): Promise<VehicleAssignment> {
        try {
            const vehicleAssignment = await this.prisma.vehicleAssignment.findUnique({
                where: { id }
            });
            if (!vehicleAssignment) {
                throw new ApiError(404, `Asignación de vehículo con id ${id} no encontrada.`);
            }
            return vehicleAssignment;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar la asignación de vehículo con id ${id}`);
        }
    }

    async findByVehicleId(vehicleId: number): Promise<VehicleAssignment[]> {
        try {
            const vehicleAssignments = await this.prisma.vehicleAssignment.findMany({
                where: { vehicleId },
                orderBy: { createdAt: 'desc' }
            });
            return vehicleAssignments;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar asignaciones del vehículo con id ${vehicleId}`);
        }
    }

    async findByRouteId(routeId: number): Promise<VehicleAssignment[]> {
        try {
            const vehicleAssignments = await this.prisma.vehicleAssignment.findMany({
                where: { routeId },
                orderBy: { createdAt: 'desc' }
            });
            return vehicleAssignments;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar asignaciones de la ruta con id ${routeId}`);
        }
    }

    async findByDriverId(driverId: number): Promise<VehicleAssignment[]> {
        try {
            const vehicleAssignments = await this.prisma.vehicleAssignment.findMany({
                where: { driverId },
                orderBy: { createdAt: 'desc' }
            });
            return vehicleAssignments;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar asignaciones del conductor con id ${driverId}`);
        }
    }

    async createVehicleAssignment(assignmentData: CreateVehicleAssignmentDto): Promise<VehicleAssignment> {
        try {
            // Verificar si existe una asignación activa para el vehículo
            const existingActiveAssignment = await this.prisma.vehicleAssignment.findFirst({
                where: {
                    vehicleId: assignmentData.vehicleId,
                    endTime: null
                }
            });

            if (existingActiveAssignment) {
                throw new ApiError(409, `El vehículo con id ${assignmentData.vehicleId} ya tiene una asignación activa.`);
            }

            const vehicleAssignment = await this.prisma.vehicleAssignment.create({
                data: assignmentData
            });
            return vehicleAssignment;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear la asignación de vehículo: ${error.message}`);
        }
    }

    async updateVehicleAssignment(id: number, assignmentData: UpdateVehicleAssignmentDto): Promise<VehicleAssignment> {
        try {
            const vehicleAssignment = await this.prisma.vehicleAssignment.findUnique({
                where: { id }
            });
            if (!vehicleAssignment) {
                throw new ApiError(404, `Asignación de vehículo con id ${id} no encontrada.`);
            }

            // Si se está actualizando el vehicleId, verificar que no haya conflictos
            if (assignmentData.vehicleId && assignmentData.vehicleId !== vehicleAssignment.vehicleId) {
                const existingActiveAssignment = await this.prisma.vehicleAssignment.findFirst({
                    where: {
                        vehicleId: assignmentData.vehicleId,
                        endTime: null,
                        id: { not: id }
                    }
                });

                if (existingActiveAssignment) {
                    throw new ApiError(409, `El vehículo con id ${assignmentData.vehicleId} ya tiene una asignación activa.`);
                }
            }

            const updatedVehicleAssignment = await this.prisma.vehicleAssignment.update({
                where: { id },
                data: assignmentData
            });
            return updatedVehicleAssignment;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar la asignación de vehículo con id ${id}`);
        }
    }

    async deleteVehicleAssignment(id: number): Promise<void> {
        try {
            const vehicleAssignment = await this.prisma.vehicleAssignment.findUnique({
                where: { id }
            });
            if (!vehicleAssignment) {
                throw new ApiError(404, `Asignación de vehículo con id ${id} no encontrada.`);
            }
            await this.prisma.vehicleAssignment.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar la asignación de vehículo con id ${id}`);
        }
    }
}
