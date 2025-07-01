import { PrismaClient, RouteStop } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateRouteStopDto } from "./dto/create-route-stop.dto";
import { UpdateRouteStopDto } from "./dto/update-route-stop.dto";
import { RouteStopRepositoryInterface } from "./interfaces/RouteStopRepository.interface";

export class RouteStopRepository implements RouteStopRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<RouteStop[]> {
        const routeStops = await this.prisma.routeStop.findMany({
            orderBy: [
                { routeId: 'asc' },
                { order: 'asc' }
            ]
        });
        return routeStops;
    }

    async findById(id: number): Promise<RouteStop> {
        try {
            const routeStop = await this.prisma.routeStop.findUnique({
                where: { id }
            });
            if (!routeStop) {
                throw new ApiError(404, `RouteStop con id ${id} no encontrado.`);
            }
            return routeStop;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar el RouteStop con id ${id}`);
        }
    }

    async findByRouteId(routeId: number): Promise<RouteStop[]> {
        try {
            const routeStops = await this.prisma.routeStop.findMany({
                where: { routeId },
                orderBy: { order: 'asc' }
            });
            return routeStops;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar los RouteStops de la ruta con id ${routeId}`);
        }
    }

    async findByStopId(stopId: number): Promise<RouteStop[]> {
        try {
            const routeStops = await this.prisma.routeStop.findMany({
                where: { stopId },
                orderBy: [
                    { routeId: 'asc' },
                    { order: 'asc' }
                ]
            });
            return routeStops;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar los RouteStops de la parada con id ${stopId}`);
        }
    }

    async createRouteStop(routeStopData: CreateRouteStopDto): Promise<RouteStop> {
        try {
            // Verificar que no exista ya una combinación de routeId y stopId
            const existingRouteStop = await this.prisma.routeStop.findFirst({
                where: {
                    routeId: routeStopData.routeId,
                    stopId: routeStopData.stopId
                }
            });

            if (existingRouteStop) {
                throw new ApiError(409, `Ya existe una relación entre la ruta ${routeStopData.routeId} y la parada ${routeStopData.stopId}.`);
            }

            // Verificar que no exista ya el mismo orden para la misma ruta
            const existingOrder = await this.prisma.routeStop.findFirst({
                where: {
                    routeId: routeStopData.routeId,
                    order: routeStopData.order
                }
            });

            if (existingOrder) {
                throw new ApiError(409, `Ya existe una parada con el orden ${routeStopData.order} para la ruta ${routeStopData.routeId}.`);
            }

            const routeStop = await this.prisma.routeStop.create({
                data: routeStopData
            });
            return routeStop;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear el RouteStop: ${error.message}`);
        }
    }

    async updateRouteStop(id: number, routeStopData: UpdateRouteStopDto): Promise<RouteStop> {
        try {
            const routeStop = await this.prisma.routeStop.findUnique({
                where: { id }
            });
            if (!routeStop) {
                throw new ApiError(404, `RouteStop con id ${id} no encontrado.`);
            }

            // Si se actualiza routeId y stopId, verificar que no exista la combinación
            if (routeStopData.routeId && routeStopData.stopId) {
                const existingRouteStop = await this.prisma.routeStop.findFirst({
                    where: {
                        routeId: routeStopData.routeId,
                        stopId: routeStopData.stopId,
                        id: { not: id }
                    }
                });

                if (existingRouteStop) {
                    throw new ApiError(409, `Ya existe una relación entre la ruta ${routeStopData.routeId} y la parada ${routeStopData.stopId}.`);
                }
            }

            // Si se actualiza el orden, verificar que no exista para la misma ruta
            if (routeStopData.order) {
                const routeIdToCheck = routeStopData.routeId || routeStop.routeId;
                const existingOrder = await this.prisma.routeStop.findFirst({
                    where: {
                        routeId: routeIdToCheck,
                        order: routeStopData.order,
                        id: { not: id }
                    }
                });

                if (existingOrder) {
                    throw new ApiError(409, `Ya existe una parada con el orden ${routeStopData.order} para la ruta ${routeIdToCheck}.`);
                }
            }

            const routeStopUpdated = await this.prisma.routeStop.update({
                where: { id },
                data: routeStopData
            });
            return routeStopUpdated;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar el RouteStop con id ${id}`);
        }
    }

    async deleteRouteStop(id: number): Promise<void> {
        try {
            const routeStop = await this.prisma.routeStop.findUnique({
                where: { id }
            });
            if (!routeStop) {
                throw new ApiError(404, `RouteStop con id ${id} no encontrado.`);
            }
            await this.prisma.routeStop.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar el RouteStop con id ${id}`);
        }
    }
}