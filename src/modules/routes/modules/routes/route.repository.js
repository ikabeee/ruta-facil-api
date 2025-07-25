"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteRepository = void 0;
const ApiError_1 = require("../../shared/errors/ApiError");
class RouteRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const routes = await this.prisma.route.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return routes;
    }
    async findById(id) {
        try {
            const route = await this.prisma.route.findUnique({
                where: { id }
            });
            if (!route) {
                throw new ApiError_1.ApiError(404, `Ruta con id ${id} no encontrada.`);
            }
            return route;
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                throw error;
            }
            throw new ApiError_1.ApiError(500, `Error al buscar la ruta con id ${id}`);
        }
    }
    async findByName(name) {
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
        }
        catch (error) {
            throw new ApiError_1.ApiError(500, `Error al buscar rutas con nombre ${name}`);
        }
    }
    async findByOwner(ownerId) {
        try {
            // Buscar rutas que tienen vehículos asignados de un propietario específico
            const routes = await this.prisma.route.findMany({
                where: {
                    vehicleAssignments: {
                        some: {
                            vehicle: {
                                ownerId: ownerId
                            }
                        }
                    }
                },
                include: {
                    vehicleAssignments: {
                        include: {
                            vehicle: {
                                include: {
                                    owner: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return routes;
        }
        catch (error) {
            throw new ApiError_1.ApiError(500, `Error al buscar rutas del propietario con id ${ownerId}: ${error.message}`);
        }
    }
    async searchRoutes(searchTerm) {
        try {
            const routes = await this.prisma.route.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            firstPoint: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            lastPoint: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                orderBy: {
                    name: 'asc'
                }
            });
            return routes;
        }
        catch (error) {
            throw new ApiError_1.ApiError(500, `Error al buscar rutas con término "${searchTerm}": ${error.message}`);
        }
    }
    async createRoute(routeData) {
        try {
            const route = await this.prisma.route.create({
                data: routeData
            });
            return route;
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                throw error;
            }
            throw new ApiError_1.ApiError(500, `Error al crear la ruta: ${error.message}`);
        }
    }
    async updateRoute(id, routeData) {
        try {
            const route = await this.prisma.route.findUnique({
                where: { id }
            });
            if (!route) {
                throw new ApiError_1.ApiError(404, `Ruta con id ${id} no encontrada.`);
            }
            const routeUpdated = await this.prisma.route.update({
                where: { id },
                data: routeData
            });
            return routeUpdated;
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                throw error;
            }
            throw new ApiError_1.ApiError(500, `Error al actualizar la ruta con id ${id}`);
        }
    }
    async deleteRoute(id) {
        try {
            const route = await this.prisma.route.findUnique({
                where: { id }
            });
            if (!route) {
                throw new ApiError_1.ApiError(404, `Ruta con id ${id} no encontrada.`);
            }
            await this.prisma.route.delete({
                where: { id }
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                throw error;
            }
            throw new ApiError_1.ApiError(500, `Error al eliminar la ruta con id ${id}`);
        }
    }
    async getStats() {
        try {
            const [total, active, routes, topRoutes] = await Promise.all([
                this.prisma.route.count(),
                this.prisma.route.count({ where: { status: 'ACTIVE' } }),
                this.prisma.route.findMany({
                    select: {
                        distance: true,
                        totalStops: true,
                        assignedUnits: true,
                        dailyTrips: true
                    }
                }),
                this.prisma.route.findMany({
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        totalStops: true,
                        assignedUnits: true
                    },
                    orderBy: [
                        { assignedUnits: 'desc' },
                        { totalStops: 'desc' }
                    ],
                    take: 5
                })
            ]);
            const inactive = total - active;
            const averageDistance = routes.length > 0
                ? routes.reduce((sum, route) => sum + (route.distance || 0), 0) / routes.length
                : 0;
            const totalStops = routes.reduce((sum, route) => sum + route.totalStops, 0);
            const assignedUnits = routes.reduce((sum, route) => sum + route.assignedUnits, 0);
            const dailyTrips = routes.reduce((sum, route) => sum + route.dailyTrips, 0);
            return {
                total,
                active,
                inactive,
                averageDistance: Math.round(averageDistance * 100) / 100,
                totalStops,
                assignedUnits,
                dailyTrips,
                topRoutes
            };
        }
        catch (error) {
            throw new ApiError_1.ApiError(500, `Error al obtener estadísticas de rutas: ${error.message}`);
        }
    }
}
exports.RouteRepository = RouteRepository;
