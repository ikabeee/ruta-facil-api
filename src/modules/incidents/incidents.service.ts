import { PrismaClient, IncidentPriority, IncidentStatus } from '../../../generated/prisma';
import { 
    IncidentServiceInterface, 
    IncidentWithRoute, 
    IncidentStats, 
    IncidentFilters 
} from './interfaces/IncidentService.interface';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { ApiError } from '../../shared/errors/ApiError';

export class IncidentService implements IncidentServiceInterface {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Crear una nueva incidencia
     */
    async create(incidentData: CreateIncidentDto): Promise<IncidentWithRoute> {
        try {
            // Verificar que la ruta existe
            const routeExists = await this.prisma.route.findUnique({
                where: { id: incidentData.routeId }
            });

            if (!routeExists) {
                throw new ApiError(404, 'La ruta especificada no existe');
            }

            const incident = await this.prisma.incident.create({
                data: {
                    title: incidentData.title,
                    description: incidentData.description,
                    type: incidentData.type,
                    priority: (incidentData.priority as IncidentPriority) || IncidentPriority.MEDIUM,
                    location: incidentData.location,
                    unit: incidentData.unit,
                    reportedBy: incidentData.reportedBy,
                    status: (incidentData.status as IncidentStatus) || IncidentStatus.PENDING,
                    routeId: incidentData.routeId
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

            return incident as IncidentWithRoute;
        } catch (error) {
            console.error('Error creating incident:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error al crear la incidencia');
        }
    }

    /**
     * Obtener todas las incidencias con filtros opcionales
     */
    async findAll(filters?: IncidentFilters): Promise<IncidentWithRoute[]> {
        try {
            const where: any = {};

            if (filters?.status) {
                where.status = filters.status;
            }

            if (filters?.priority) {
                where.priority = filters.priority;
            }

            if (filters?.routeId) {
                where.routeId = filters.routeId;
            }

            if (filters?.type) {
                where.type = { contains: filters.type, mode: 'insensitive' };
            }

            if (filters?.startDate || filters?.endDate) {
                where.createdAt = {};
                if (filters.startDate) {
                    where.createdAt.gte = filters.startDate;
                }
                if (filters.endDate) {
                    where.createdAt.lte = filters.endDate;
                }
            }

            const incidents = await this.prisma.incident.findMany({
                where,
                include: {
                    route: {
                        select: {
                            name: true,
                            code: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: filters?.limit || 50,
                skip: filters?.offset || 0
            });

            return incidents;
        } catch (error) {
            console.error('Error finding incidents:', error);
            throw new ApiError(500, 'Error al obtener las incidencias');
        }
    }

    /**
     * Obtener una incidencia por ID
     */
    async findOne(id: number): Promise<IncidentWithRoute> {
        try {
            const incident = await this.prisma.incident.findUnique({
                where: { id },
                include: {
                    route: {
                        select: {
                            name: true,
                            code: true
                        }
                    }
                }
            });

            if (!incident) {
                throw new ApiError(404, 'Incidencia no encontrada');
            }

            return incident;
        } catch (error) {
            console.error('Error finding incident:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error al obtener la incidencia');
        }
    }

    /**
     * Actualizar una incidencia
     */
    async update(id: number, updateData: UpdateIncidentDto): Promise<IncidentWithRoute> {
        try {
            // Verificar que la incidencia existe
            const existingIncident = await this.prisma.incident.findUnique({
                where: { id }
            });

            if (!existingIncident) {
                throw new ApiError(404, 'Incidencia no encontrada');
            }

            // Si se cambia la ruta, verificar que existe
            if (updateData.routeId && updateData.routeId !== existingIncident.routeId) {
                const routeExists = await this.prisma.route.findUnique({
                    where: { id: updateData.routeId }
                });

                if (!routeExists) {
                    throw new ApiError(404, 'La ruta especificada no existe');
                }
            }

            const incident = await this.prisma.incident.update({
                where: { id },
                data: {
                    title: updateData.title,
                    description: updateData.description,
                    type: updateData.type,
                    priority: updateData.priority as IncidentPriority,
                    location: updateData.location,
                    unit: updateData.unit,
                    reportedBy: updateData.reportedBy,
                    status: updateData.status as IncidentStatus,
                    routeId: updateData.routeId
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

            return incident as IncidentWithRoute;
        } catch (error) {
            console.error('Error updating incident:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error al actualizar la incidencia');
        }
    }

    /**
     * Eliminar una incidencia
     */
    async remove(id: number): Promise<boolean> {
        try {
            const incident = await this.prisma.incident.findUnique({
                where: { id }
            });

            if (!incident) {
                throw new ApiError(404, 'Incidencia no encontrada');
            }

            await this.prisma.incident.delete({
                where: { id }
            });

            return true;
        } catch (error) {
            console.error('Error deleting incident:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error al eliminar la incidencia');
        }
    }

    /**
     * Obtener estadísticas de incidencias
     */
    async getStats(): Promise<IncidentStats> {
        try {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const [
                total,
                pending,
                inProgress,
                resolved,
                cancelled,
                low,
                medium,
                high,
                critical,
                today,
                thisWeek,
                thisMonth,
                routeStats
            ] = await Promise.all([
                this.prisma.incident.count(),
                this.prisma.incident.count({ where: { status: 'PENDING' } }),
                this.prisma.incident.count({ where: { status: 'IN_PROGRESS' } }),
                this.prisma.incident.count({ where: { status: 'RESOLVED' } }),
                this.prisma.incident.count({ where: { status: 'CANCELLED' } }),
                this.prisma.incident.count({ where: { priority: 'LOW' } }),
                this.prisma.incident.count({ where: { priority: 'MEDIUM' } }),
                this.prisma.incident.count({ where: { priority: 'HIGH' } }),
                this.prisma.incident.count({ where: { priority: 'CRITICAL' } }),
                this.prisma.incident.count({ where: { createdAt: { gte: startOfDay } } }),
                this.prisma.incident.count({ where: { createdAt: { gte: startOfWeek } } }),
                this.prisma.incident.count({ where: { createdAt: { gte: startOfMonth } } }),
                this.prisma.incident.groupBy({
                    by: ['routeId'],
                    _count: {
                        routeId: true
                    },
                    orderBy: {
                        _count: {
                            routeId: 'desc'
                        }
                    },
                    take: 5
                })
            ]);

            // Obtener nombres de las rutas más afectadas
            const routeIds = routeStats.map(stat => stat.routeId);
            const routes = await this.prisma.route.findMany({
                where: { id: { in: routeIds } },
                select: { id: true, name: true }
            });

            const mostAffectedRoutes = routeStats.map(stat => {
                const route = routes.find(r => r.id === stat.routeId);
                return {
                    routeId: stat.routeId,
                    routeName: route?.name || 'Ruta desconocida',
                    incidentCount: stat._count.routeId
                };
            });

            return {
                total,
                pending,
                inProgress,
                resolved,
                cancelled,
                byPriority: {
                    low,
                    medium,
                    high,
                    critical
                },
                byTimeRange: {
                    today,
                    thisWeek,
                    thisMonth
                },
                mostAffectedRoutes
            };
        } catch (error) {
            console.error('Error getting incident stats:', error);
            throw new ApiError(500, 'Error al obtener estadísticas de incidencias');
        }
    }

    /**
     * Obtener incidencias por estado
     */
    async getByStatus(status: string): Promise<IncidentWithRoute[]> {
        return this.findAll({ status });
    }

    /**
     * Obtener incidencias por prioridad
     */
    async getByPriority(priority: string): Promise<IncidentWithRoute[]> {
        return this.findAll({ priority });
    }

    /**
     * Obtener incidencias por ruta
     */
    async getByRoute(routeId: number): Promise<IncidentWithRoute[]> {
        return this.findAll({ routeId });
    }
}
