import { PrismaClient, VehicleLocation } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateVehicleLocationDto } from "./dto/create-vehicle-location.dto";
import { UpdateVehicleLocationDto } from "./dto/update-vehicle-location.dto";
import { VehicleLocationRepositoryInterface } from "./interfaces/VehicleLocationRepository.interface";

export class VehicleLocationRepository implements VehicleLocationRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<VehicleLocation[]> {
        const vehicleLocations = await this.prisma.vehicleLocation.findMany({
            orderBy: {
                recordedAt: 'desc'
            }
        });
        return vehicleLocations;
    }

    async findById(id: number): Promise<VehicleLocation> {
        try {
            const vehicleLocation = await this.prisma.vehicleLocation.findUnique({
                where: { id }
            });
            if (!vehicleLocation) {
                throw new ApiError(404, `Ubicación de vehículo con id ${id} no encontrada.`);
            }
            return vehicleLocation;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar la ubicación de vehículo con id ${id}`);
        }
    }

    async findByVehicleId(vehicleId: number): Promise<VehicleLocation[]> {
        try {
            const vehicleLocation = await this.prisma.vehicleLocation.findMany({
                where: { vehicleId },
                orderBy: {
                    recordedAt: 'desc'
                }
            });
            return vehicleLocation;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar las ubicaciones del vehículo con id ${vehicleId}`);
        }
    }

    async findLatestByVehicleId(vehicleId: number): Promise<VehicleLocation> {
        try {
            const vehicleLocation = await this.prisma.vehicleLocation.findFirst({
                where: { vehicleId },
                orderBy: {
                    recordedAt: 'desc'
                }
            });
            if (!vehicleLocation) {
                throw new ApiError(404, `No se encontraron ubicaciones para el vehículo con id ${vehicleId}.`);
            }
            return vehicleLocation;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar la última ubicación del vehículo con id ${vehicleId}`);
        }
    }

    async createVehicleLocation(vehicleLocationData: CreateVehicleLocationDto): Promise<VehicleLocation> {
        try {
            // Verificar que el vehículo existe
            const vehicle = await this.prisma.vehicle.findUnique({
                where: { id: vehicleLocationData.vehicleId }
            });

            if (!vehicle) {
                throw new ApiError(404, `Vehículo con id ${vehicleLocationData.vehicleId} no encontrado.`);
            }

            const vehicleLocation = await this.prisma.vehicleLocation.create({
                data: {
                    ...vehicleLocationData,
                    recordedAt: vehicleLocationData.recordedAt || new Date()
                }
            });
            return vehicleLocation;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear la ubicación del vehículo: ${error.message}`);
        }
    }

    async updateVehicleLocation(id: number, vehicleLocationData: UpdateVehicleLocationDto): Promise<VehicleLocation> {
        try {
            const vehicleLocation = await this.prisma.vehicleLocation.findUnique({
                where: { id }
            });
            if (!vehicleLocation) {
                throw new ApiError(404, `Ubicación de vehículo con id ${id} no encontrada.`);
            }

            // Verificar que el vehículo existe si se está actualizando el vehicleId
            if (vehicleLocationData.vehicleId) {
                const vehicle = await this.prisma.vehicle.findUnique({
                    where: { id: vehicleLocationData.vehicleId }
                });
                if (!vehicle) {
                    throw new ApiError(404, `Vehículo con id ${vehicleLocationData.vehicleId} no encontrado.`);
                }
            }

            const vehicleLocationUpdated = await this.prisma.vehicleLocation.update({
                where: { id },
                data: vehicleLocationData
            });
            return vehicleLocationUpdated;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar la ubicación del vehículo con id ${id}`);
        }
    }

    async deleteVehicleLocation(id: number): Promise<void> {
        try {
            const vehicleLocation = await this.prisma.vehicleLocation.findUnique({
                where: { id }
            });
            if (!vehicleLocation) {
                throw new ApiError(404, `Ubicación de vehículo con id ${id} no encontrada.`);
            }
            await this.prisma.vehicleLocation.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar la ubicación del vehículo con id ${id}`);
        }
    }

    async getStats(): Promise<{
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
    }> {
        try {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            const [
                totalRecords,
                uniqueVehicles,
                recentRecords,
                todayRecords,
                weekRecords,
                monthRecords,
                oldestRecord,
                latestRecord,
                vehicleStats
            ] = await Promise.all([
                this.prisma.vehicleLocation.count(),
                this.prisma.vehicleLocation.groupBy({
                    by: ['vehicleId'],
                    _count: { vehicleId: true }
                }).then(result => result.length),
                this.prisma.vehicleLocation.count({
                    where: { recordedAt: { gte: dayAgo } }
                }),
                this.prisma.vehicleLocation.count({
                    where: { recordedAt: { gte: today } }
                }),
                this.prisma.vehicleLocation.count({
                    where: { recordedAt: { gte: weekAgo } }
                }),
                this.prisma.vehicleLocation.count({
                    where: { recordedAt: { gte: monthAgo } }
                }),
                this.prisma.vehicleLocation.findFirst({
                    orderBy: { recordedAt: 'asc' },
                    select: { recordedAt: true }
                }),
                this.prisma.vehicleLocation.findFirst({
                    orderBy: { recordedAt: 'desc' },
                    select: { recordedAt: true }
                }),
                this.prisma.vehicleLocation.groupBy({
                    by: ['vehicleId'],
                    _count: { vehicleId: true },
                    _max: { recordedAt: true },
                    orderBy: { _count: { vehicleId: 'desc' } },
                    take: 5
                })
            ]);

            // Get vehicle details for most active vehicles
            const vehicleIds = vehicleStats.map(stat => stat.vehicleId);
            const vehicles = await this.prisma.vehicle.findMany({
                where: { id: { in: vehicleIds } },
                select: { id: true, name: true, plate: true }
            });

            const mostActiveVehicles = vehicleStats.map(stat => {
                const vehicle = vehicles.find(v => v.id === stat.vehicleId);
                return {
                    vehicleId: stat.vehicleId,
                    vehicleName: vehicle?.name || 'Unknown',
                    plate: vehicle?.plate || 'Unknown',
                    recordCount: stat._count.vehicleId,
                    lastUpdate: stat._max.recordedAt || new Date()
                };
            });

            return {
                totalRecords,
                uniqueVehicles,
                recentRecords,
                oldestRecord: oldestRecord?.recordedAt || null,
                latestRecord: latestRecord?.recordedAt || null,
                byTimeRange: {
                    today: todayRecords,
                    thisWeek: weekRecords,
                    thisMonth: monthRecords
                },
                mostActiveVehicles
            };
        } catch (error: any) {
            throw new ApiError(500, `Error al obtener estadísticas de ubicaciones: ${error.message}`);
        }
    }
}
