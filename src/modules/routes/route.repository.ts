import { PrismaClient, Route } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateRouteDto } from "./dto/create-route.dto";
import { UpdateRouteDto } from "./dto/update-route.dto";
import { RouteRepositoryInterface } from "./interfaces/RouteRepository.interface";

export class RouteRepository implements RouteRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<Route[]> {
        const routes = await this.prisma.route.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return routes;
    }

    async findById(id: number): Promise<Route> {
        try {
            const route = await this.prisma.route.findUnique({
                where: { id }
            });
            if (!route) {
                throw new ApiError(404, `Ruta con id ${id} no encontrada.`);
            }
            return route;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar la ruta con id ${id}`);
        }
    }

    async findByName(name: string): Promise<Route[]> {
        try {
            const routes = await this.prisma.route.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: 'insensitive'
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return routes;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar rutas con nombre ${name}`);
        }
    }

    async createRoute(routeData: CreateRouteDto): Promise<Route> {
        try {
            const route = await this.prisma.route.create({
                data: routeData
            });
            return route;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear la ruta: ${error.message}`);
        }
    }

    async updateRoute(id: number, routeData: UpdateRouteDto): Promise<Route> {
        try {
            const route = await this.prisma.route.findUnique({
                where: { id }
            });
            if (!route) {
                throw new ApiError(404, `Ruta con id ${id} no encontrada.`);
            }
            const routeUpdated = await this.prisma.route.update({
                where: { id },
                data: routeData
            });
            return routeUpdated;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar la ruta con id ${id}`);
        }
    }

    async deleteRoute(id: number): Promise<void> {
        try {
            const route = await this.prisma.route.findUnique({
                where: { id }
            });
            if (!route) {
                throw new ApiError(404, `Ruta con id ${id} no encontrada.`);
            }
            await this.prisma.route.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar la ruta con id ${id}`);
        }
    }
}