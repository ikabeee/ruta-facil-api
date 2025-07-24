import { PrismaClient } from '../../../generated/prisma';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver, DriverStats } from './interfaces/driver.interface';
import { ApiError } from '../../shared/errors/ApiError';

export class DriverRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findAll(ownerId?: number): Promise<Driver[]> {
        try {
            const whereClause: any = {
                role: 'DRIVER'
            };

            // Si se proporciona ownerId, filtrar por drivers asignados a vehículos de ese propietario
            if (ownerId) {
                whereClause.vehicleAssignments = {
                    some: {
                        vehicle: {
                            ownerId: ownerId
                        }
                    }
                };
            }

            const drivers = await this.prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    status: true,
                    // Campos específicos de conductor que están en el modelo User
                    license: true,
                    licenseExpiration: true,
                    driverExperience: true,
                    driverRating: true,
                    totalTrips: true,
                    isDriverVerified: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: {
                    name: 'asc'
                }
            });

            // Mapear la respuesta al formato esperado por el frontend
            return drivers.map(driver => ({
                id: driver.id,
                userId: driver.id, // Para mantener compatibilidad
                license: driver.license,
                licenseExpiration: driver.licenseExpiration,
                experience: driver.driverExperience,
                rating: driver.driverRating,
                totalTrips: driver.totalTrips || 0,
                isVerified: driver.isDriverVerified || false,
                createdAt: driver.createdAt,
                updatedAt: driver.updatedAt || new Date(),
                user: {
                    id: driver.id,
                    name: driver.name,
                    email: driver.email,
                    phone: driver.phone,
                    status: driver.status
                }
            }));
        } catch (error) {
            console.error('Error in DriverRepository.findAll:', error);
            throw new ApiError(500, 'Error al obtener conductores');
        }
    }

    async findById(id: number): Promise<Driver | null> {
        try {
            const driver = await this.prisma.user.findUnique({
                where: {
                    id: id,
                    role: 'DRIVER'
                },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    status: true,
                    license: true,
                    licenseExpiration: true,
                    driverExperience: true,
                    driverRating: true,
                    totalTrips: true,
                    isDriverVerified: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!driver) {
                return null;
            }

            return {
                id: driver.id,
                userId: driver.id,
                license: driver.license,
                licenseExpiration: driver.licenseExpiration,
                experience: driver.driverExperience,
                rating: driver.driverRating,
                totalTrips: driver.totalTrips || 0,
                isVerified: driver.isDriverVerified || false,
                createdAt: driver.createdAt,
                updatedAt: driver.updatedAt || new Date(),
                user: {
                    id: driver.id,
                    name: driver.name,
                    email: driver.email,
                    phone: driver.phone,
                    status: driver.status
                }
            };
        } catch (error) {
            console.error('Error in DriverRepository.findById:', error);
            throw new ApiError(500, 'Error al obtener conductor');
        }
    }

    async findByUserId(userId: number): Promise<Driver | null> {
        return this.findById(userId);
    }

    async create(createDriverDto: CreateDriverDto): Promise<Driver> {
        try {
            // Verificar que el usuario existe y no es ya un conductor
            const existingUser = await this.prisma.user.findUnique({
                where: { id: createDriverDto.userId }
            });

            if (!existingUser) {
                throw new ApiError(404, 'Usuario no encontrado');
            }

            if (existingUser.role === 'DRIVER') {
                throw new ApiError(400, 'El usuario ya es un conductor');
            }

            // Actualizar el usuario para convertirlo en conductor
            const updatedUser = await this.prisma.user.update({
                where: { id: createDriverDto.userId },
                data: {
                    role: 'DRIVER',
                    license: createDriverDto.license,
                    licenseExpiration: createDriverDto.licenseExpiration ? new Date(createDriverDto.licenseExpiration) : null,
                    driverExperience: createDriverDto.experience,
                    driverRating: createDriverDto.rating,
                    totalTrips: createDriverDto.totalTrips || 0,
                    isDriverVerified: createDriverDto.isVerified || false,
                    updatedAt: new Date()
                },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    status: true,
                    license: true,
                    licenseExpiration: true,
                    driverExperience: true,
                    driverRating: true,
                    totalTrips: true,
                    isDriverVerified: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return {
                id: updatedUser.id,
                userId: updatedUser.id,
                license: updatedUser.license,
                licenseExpiration: updatedUser.licenseExpiration,
                experience: updatedUser.driverExperience,
                rating: updatedUser.driverRating,
                totalTrips: updatedUser.totalTrips || 0,
                isVerified: updatedUser.isDriverVerified || false,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt || new Date(),
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    status: updatedUser.status
                }
            };
        } catch (error) {
            console.error('Error in DriverRepository.create:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error al crear conductor');
        }
    }

    async update(id: number, updateDriverDto: UpdateDriverDto): Promise<Driver> {
        try {
            const existingDriver = await this.findById(id);
            if (!existingDriver) {
                throw new ApiError(404, 'Conductor no encontrado');
            }

            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    license: updateDriverDto.license,
                    licenseExpiration: updateDriverDto.licenseExpiration ? new Date(updateDriverDto.licenseExpiration) : undefined,
                    driverExperience: updateDriverDto.experience,
                    driverRating: updateDriverDto.rating,
                    totalTrips: updateDriverDto.totalTrips,
                    isDriverVerified: updateDriverDto.isVerified,
                    updatedAt: new Date()
                },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    status: true,
                    license: true,
                    licenseExpiration: true,
                    driverExperience: true,
                    driverRating: true,
                    totalTrips: true,
                    isDriverVerified: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return {
                id: updatedUser.id,
                userId: updatedUser.id,
                license: updatedUser.license,
                licenseExpiration: updatedUser.licenseExpiration,
                experience: updatedUser.driverExperience,
                rating: updatedUser.driverRating,
                totalTrips: updatedUser.totalTrips || 0,
                isVerified: updatedUser.isDriverVerified || false,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt || new Date(),
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    status: updatedUser.status
                }
            };
        } catch (error) {
            console.error('Error in DriverRepository.update:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error al actualizar conductor');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const existingDriver = await this.findById(id);
            if (!existingDriver) {
                throw new ApiError(404, 'Conductor no encontrado');
            }

            // Cambiar el rol del usuario en lugar de eliminarlo
            await this.prisma.user.update({
                where: { id },
                data: {
                    role: 'USER',
                    license: null,
                    licenseExpiration: null,
                    driverExperience: null,
                    driverRating: null,
                    totalTrips: 0,
                    isDriverVerified: false,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error in DriverRepository.delete:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error al eliminar conductor');
        }
    }

    async getStats(ownerId?: number): Promise<DriverStats> {
        try {
            const whereClause: any = { role: 'DRIVER' };

            // Si se proporciona ownerId, filtrar por drivers asignados a vehículos de ese propietario
            if (ownerId) {
                whereClause.vehicleAssignments = {
                    some: {
                        vehicle: {
                            ownerId: ownerId
                        }
                    }
                };
            }

            const total = await this.prisma.user.count({
                where: whereClause
            });

            const active = await this.prisma.user.count({
                where: { 
                    ...whereClause,
                    status: 'ACTIVE'
                }
            });

            const inactive = total - active;

            const verified = await this.prisma.user.count({
                where: { 
                    ...whereClause,
                    isDriverVerified: true
                }
            });

            const drivers = await this.prisma.user.findMany({
                where: whereClause,
                select: {
                    driverRating: true,
                    totalTrips: true,
                    licenseExpiration: true
                }
            });

            const totalRating = drivers.reduce((sum, driver) => sum + (driver.driverRating || 0), 0);
            const averageRating = total > 0 ? totalRating / total : 0;

            const totalTripsSum = drivers.reduce((sum, driver) => sum + (driver.totalTrips || 0), 0);

            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

            const expiringLicenses = drivers.filter(driver => 
                driver.licenseExpiration && 
                driver.licenseExpiration <= oneMonthFromNow
            ).length;

            return {
                total,
                active,
                inactive,
                verified,
                averageRating: Math.round(averageRating * 10) / 10,
                totalTrips: totalTripsSum,
                expiringLicenses
            };
        } catch (error) {
            console.error('Error in DriverRepository.getStats:', error);
            throw new ApiError(500, 'Error al obtener estadísticas de conductores');
        }
    }
}
