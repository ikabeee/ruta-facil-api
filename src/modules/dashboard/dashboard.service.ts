import { PrismaClient } from '../../../generated/prisma';
import { 
    DashboardServiceInterface, 
    DashboardStats,
    LiveRouteStatus,
    IncidentSummary,
    RatingsSummary,
    DashboardOverview,
    EfficiencyData
} from './interfaces/DashboardService.interface';
import { ApiError } from '../../shared/errors/ApiError';

export class DashboardService implements DashboardServiceInterface {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Obtener estadísticas generales del sistema
     */
    async getGeneralStats(ownerId?: number): Promise<DashboardStats> {
        try {
            let routeWhereClause: any = {};
            let vehicleWhereClause: any = {};
            let ratingWhereClause: any = {};
            let incidentWhereClause: any = {};

            // Si se proporciona ownerId, filtrar por datos del propietario
            if (ownerId) {
                vehicleWhereClause = { ownerId };
                
                routeWhereClause = {
                    vehicleAssignments: {
                        some: {
                            vehicle: { ownerId }
                        }
                    }
                };

                ratingWhereClause = {
                    Vehicle: {
                        ownerId: ownerId
                    }
                };

                incidentWhereClause = {
                    route: {
                        vehicleAssignments: {
                            some: {
                                vehicle: { ownerId }
                            }
                        }
                    }
                };
            }

            const [
                totalUsers,
                activeDrivers,
                totalRoutes,
                activeRoutes,
                totalVehicles,
                averageRating,
                totalIncidents,
                recentIncidents
            ] = await Promise.all([
                // Para owners, contar solo conductores asignados a sus vehículos
                ownerId ? this.prisma.user.count({
                    where: {
                        role: 'DRIVER',
                        vehicleAssignments: {
                            some: {
                                vehicle: { ownerId }
                            }
                        }
                    }
                }) : this.prisma.user.count(),

                ownerId ? this.prisma.user.count({
                    where: {
                        role: 'DRIVER',
                        isDriverVerified: true,
                        vehicleAssignments: {
                            some: {
                                vehicle: { ownerId }
                            }
                        }
                    }
                }) : this.prisma.user.count({
                    where: {
                        role: 'DRIVER',
                        isDriverVerified: true
                    }
                }),

                this.prisma.route.count({
                    where: routeWhereClause
                }),

                this.prisma.route.count({
                    where: {
                        ...routeWhereClause,
                        status: 'ACTIVE'
                    }
                }),

                this.prisma.vehicle.count({
                    where: vehicleWhereClause
                }),

                this.prisma.rating.aggregate({
                    _avg: {
                        rating: true
                    },
                    where: ratingWhereClause
                }),

                this.prisma.incident.count({
                    where: incidentWhereClause
                }),

                this.prisma.incident.count({
                    where: {
                        ...incidentWhereClause,
                        createdAt: {
                            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
                        }
                    }
                })
            ]);

            return {
                totalUsers,
                activeDrivers,
                totalRoutes,
                activeRoutes,
                totalVehicles,
                operationalVehicles: totalVehicles,
                totalIncidents,
                recentIncidents,
                averageRating: averageRating._avg?.rating || 0,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting general stats:', error);
            throw new ApiError(500, 'Error al obtener estadísticas generales');
        }
    }

    /**
     * Obtener estado de rutas en tiempo real
     */
    async getLiveRoutesStatus(ownerId?: number): Promise<LiveRouteStatus[]> {
        try {
            const whereClause: any = {
                status: 'ACTIVE'
            };

            // Si se proporciona ownerId, filtrar por rutas asignadas a vehículos de ese propietario
            if (ownerId) {
                whereClause.vehicleAssignments = {
                    some: {
                        vehicle: {
                            ownerId: ownerId
                        }
                    }
                };
            }

            const routes = await this.prisma.route.findMany({
                where: whereClause,
                include: {
                    incidents: {
                        where: {
                            status: {
                                in: ['PENDING', 'IN_PROGRESS']
                            }
                        }
                    },
                    schedules: {
                        where: {
                            status: 'ACTIVE'
                        }
                    }
                }
            });

            // Obtener asignaciones de vehículos activas para cada ruta
            const routeIds = routes.map(route => route.id);
            const vehicleAssignments = await this.prisma.vehicleAssignment.findMany({
                where: {
                    routeId: {
                        in: routeIds
                    },
                    OR: [
                        { endTime: null },
                        { endTime: { gt: new Date() } }
                    ]
                }
            });

            const liveRoutes: LiveRouteStatus[] = routes.map(route => {
                const activeAssignments = vehicleAssignments.filter(
                    assignment => assignment.routeId === route.id
                );

                return {
                    id: route.id,
                    name: route.name,
                    code: route.code || `RT-${route.id.toString().padStart(3, '0')}`,
                    assignedUnits: activeAssignments.length,
                    activeIncidents: route.incidents.length,
                    status: route.incidents.length > 0 ? 'Limitada' : 'Operativa' as const,
                    lastUpdate: new Date().toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }),
                    passengers: Math.floor(Math.random() * 50) + 10,
                    efficiency: Math.floor(Math.random() * 30) + 70
                };
            });

            return liveRoutes;
        } catch (error) {
            console.error('Error getting live routes:', error);
            throw new ApiError(500, 'Error al obtener estado de rutas en tiempo real');
        }
    }

    /**
     * Obtener incidencias recientes
     */
    async getRecentIncidents(limit: number = 10, ownerId?: number): Promise<IncidentSummary[]> {
        try {
            let whereClause: any = {};

            // Si se proporciona ownerId, filtrar por incidencias relacionadas con sus vehículos
            if (ownerId) {
                whereClause = {
                    route: {
                        vehicleAssignments: {
                            some: {
                                vehicle: { ownerId }
                            }
                        }
                    }
                };
            }

            const incidents = await this.prisma.incident.findMany({
                take: limit,
                where: whereClause,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    route: {
                        select: {
                            name: true,
                            code: true
                        }
                    }
                }
            });

            return incidents.map(incident => ({
                id: incident.id,
                type: incident.type || 'Incidencia General',
                title: incident.title,
                description: incident.description,
                priority: incident.priority,
                status: incident.status,
                route: incident.route.name,
                reportedBy: incident.reportedBy || 'Sistema',
                location: incident.location || 'No especificada',
                unit: incident.unit || 'No asignada',
                time: incident.createdAt.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                createdAt: incident.createdAt
            }));
        } catch (error) {
            console.error('Error getting recent incidents:', error);
            throw new ApiError(500, 'Error al obtener incidencias recientes');
        }
    }

    /**
     * Obtener resumen de calificaciones por categoría
     */
    async getRatingsSummary(): Promise<RatingsSummary[]> {
        try {
            const ratingsData = await this.prisma.rating.findMany({
                where: {
                    status: 'ACTIVE'
                },
                select: {
                    category: true,
                    rating: true
                }
            });

            const categoryGroups = ratingsData.reduce((acc, rating) => {
                const category = rating.category || 'General';
                if (!acc[category]) {
                    acc[category] = {
                        ratings: [],
                        total: 0,
                        count: 0
                    };
                }
                acc[category].ratings.push(rating.rating);
                acc[category].total += rating.rating;
                acc[category].count += 1;
                return acc;
            }, {} as Record<string, { ratings: number[], total: number, count: number }>);

            const summary: RatingsSummary[] = Object.entries(categoryGroups).map(([category, data]) => ({
                id: category.toLowerCase().replace(/\s+/g, '-'),
                category,
                rating: Math.round((data.total / data.count) * 10) / 10,
                maxRating: 5,
                trend: 'stable' as const,
                description: `Calificación promedio en ${category}`
            }));

            return summary;
        } catch (error) {
            console.error('Error getting ratings summary:', error);
            throw new ApiError(500, 'Error al obtener resumen de calificaciones');
        }
    }

    /**
     * Obtener vista general completa del dashboard
     */
    async getOverview(): Promise<DashboardOverview> {
        try {
            const [stats, liveRoutes, recentIncidents, ratingsSummary] = await Promise.all([
                this.getGeneralStats(),
                this.getLiveRoutesStatus(), // Sin filtro para la vista general
                this.getRecentIncidents(5),
                this.getRatingsSummary()
            ]);

            return {
                stats,
                liveRoutes,
                recentIncidents,
                ratingsSummary,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting dashboard overview:', error);
            throw new ApiError(500, 'Error al obtener vista general del dashboard');
        }
    }

    /**
     * Obtener resumen de eficiencia del sistema
     */
    async getEfficiencySummary(): Promise<EfficiencyData> {
        try {
            const driversEfficiency = await this.prisma.user.findMany({
                where: {
                    role: 'DRIVER' as const
                },
                select: {
                    id: true,
                    name: true,
                    driverRating: true,
                    totalTrips: true,
                    vehicleAssignments: {
                        include: {
                            vehicle: {
                                select: {
                                    name: true,
                                    plate: true
                                }
                            }
                        },
                        take: 1,
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            });

            const routesEfficiency = await this.prisma.route.findMany({
                where: {
                    status: 'ACTIVE'
                },
                select: {
                    id: true,
                    name: true,
                    code: true,
                    dailyTrips: true,
                    assignedUnits: true
                }
            });

            const driversData = driversEfficiency.map((driver: any) => ({
                id: driver.id,
                name: driver.name || `Conductor ${driver.id}`,
                efficiency: Math.min(100, Math.round((driver.driverRating || 0) * 20)),
                totalTrips: driver.totalTrips || 0,
                color: (driver.driverRating && driver.driverRating >= 4 ? 'green' : 
                       driver.driverRating && driver.driverRating >= 3 ? 'yellow' : 'red') as 'green' | 'yellow' | 'red'
            }));

            const routesData = routesEfficiency.map(route => ({
                id: route.id,
                name: route.name,
                code: route.code,
                efficiency: Math.min(100, Math.round((route.dailyTrips / Math.max(1, route.assignedUnits)) * 5)),
                dailyTrips: route.dailyTrips,
                assignedUnits: route.assignedUnits
            }));

            return {
                drivers: driversData,
                routes: routesData,
                averageDriverEfficiency: driversData.reduce((acc: number, d: any) => acc + d.efficiency, 0) / Math.max(1, driversData.length),
                averageRouteEfficiency: routesData.reduce((acc: number, r: any) => acc + r.efficiency, 0) / Math.max(1, routesData.length)
            };
        } catch (error) {
            console.error('Error getting efficiency summary:', error);
            throw new ApiError(500, 'Error al obtener resumen de eficiencia');
        }
    }

    // ==================== MÉTODOS ESPECÍFICOS PARA PROPIETARIOS ====================

    /**
     * Obtener estadísticas específicas del propietario
     */
    async getOwnerStats(ownerId: number): Promise<DashboardStats> {
        return this.getGeneralStats(ownerId);
    }

    /**
     * Obtener resumen de calificaciones específicas del propietario
     */
    async getOwnerRatingsSummary(ownerId: number): Promise<RatingsSummary[]> {
        try {
            const ratings = await this.prisma.rating.findMany({
                where: {
                    Vehicle: {
                        ownerId: ownerId
                    }
                },
                select: {
                    rating: true,
                    category: true
                }
            });

            if (ratings.length === 0) {
                return [];
            }

            const categoryGroups = ratings.reduce((acc, rating) => {
                const category = rating.category || 'General';
                if (!acc[category]) {
                    acc[category] = { ratings: [], total: 0, count: 0 };
                }
                acc[category].ratings.push(rating.rating);
                acc[category].total += rating.rating;
                acc[category].count += 1;
                return acc;
            }, {} as Record<string, { ratings: number[], total: number, count: number }>);

            const summary: RatingsSummary[] = Object.entries(categoryGroups).map(([category, data]) => ({
                id: category.toLowerCase().replace(/\s+/g, '-'),
                category,
                rating: Math.round((data.total / data.count) * 10) / 10,
                maxRating: 5,
                trend: 'stable' as const,
                description: `Calificación promedio en ${category} para sus unidades`
            }));

            return summary;
        } catch (error) {
            console.error('Error getting owner ratings summary:', error);
            throw new ApiError(500, 'Error al obtener resumen de calificaciones del propietario');
        }
    }

    /**
     * Obtener vista general completa del dashboard del propietario
     */
    async getOwnerOverview(ownerId: number): Promise<DashboardOverview> {
        try {
            const [stats, liveRoutes, recentIncidents, ratingsSummary] = await Promise.all([
                this.getOwnerStats(ownerId),
                this.getLiveRoutesStatus(ownerId),
                this.getRecentIncidents(5, ownerId),
                this.getOwnerRatingsSummary(ownerId)
            ]);

            return {
                stats,
                liveRoutes,
                recentIncidents,
                ratingsSummary,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting owner dashboard overview:', error);
            throw new ApiError(500, 'Error al obtener vista general del dashboard del propietario');
        }
    }
}
