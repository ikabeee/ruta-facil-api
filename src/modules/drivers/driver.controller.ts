import { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma';
import { DriverRepository } from './driver.repository';
import type { CreateDriverDto } from './dto/create-driver.dto';
import type { CreateDriverWithUserDto } from './dto/create-driver-with-user.dto';
import type { UpdateDriverDto } from './dto/update-driver.dto';

export class DriverController {
    private driverRepository: DriverRepository;

    constructor() {
        const prisma = new PrismaClient();
        this.driverRepository = new DriverRepository(prisma);
    }

    /**
     * Obtener todos los drivers
     * GET /api/v1/drivers
     */
    async getAllDrivers(req: Request, res: Response): Promise<void> {
        try {
            console.log('🔍 [DRIVER CONTROLLER] Obteniendo todos los drivers');
            
            // Obtener el usuario actual del middleware de autenticación
            const currentUser = (req as any).user;
            let ownerId: number | undefined;

            console.log('👤 [DRIVER CONTROLLER] Usuario actual:', currentUser);

            // Si el usuario es OWNER_VEHICLE, filtrar por sus drivers
            if (currentUser?.role === 'OWNER_VEHICLE') {
                ownerId = currentUser.id;
                console.log(`🏢 [DRIVER CONTROLLER] Usuario es OWNER_VEHICLE con ID: ${ownerId}`);
            }
            
            const drivers = await this.driverRepository.findAll(ownerId);
            console.log(`✅ [DRIVER CONTROLLER] Encontrados ${drivers.length} drivers`);
            
            res.status(200).json({
                success: true,
                message: 'Drivers obtenidos exitosamente',
                data: drivers,
                count: drivers.length
            });
        } catch (error) {
            console.error('❌ [DRIVER CONTROLLER] Error al obtener drivers:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al obtener drivers',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    /**
     * Obtener driver por ID
     * GET /api/v1/drivers/:id
     */
    async getDriverById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const driverId = parseInt(id);

            if (isNaN(driverId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de driver inválido'
                });
                return;
            }

            console.log(`🔍 [DRIVER CONTROLLER] Obteniendo driver con ID: ${driverId}`);
            
            const driver = await this.driverRepository.findById(driverId);
            
            if (!driver) {
                res.status(404).json({
                    success: false,
                    message: 'Driver no encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Driver obtenido exitosamente',
                data: driver
            });
        } catch (error) {
            console.error('❌ [DRIVER CONTROLLER] Error al obtener driver por ID:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al obtener driver',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    /**
     * Obtener driver por User ID
     * GET /api/v1/drivers/user/:userId
     */
    async getDriverByUserId(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const userIdInt = parseInt(userId);

            if (isNaN(userIdInt)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                });
                return;
            }

            console.log(`🔍 [DRIVER CONTROLLER] Obteniendo driver con User ID: ${userIdInt}`);
            
            const driver = await this.driverRepository.findByUserId(userIdInt);
            
            if (!driver) {
                res.status(404).json({
                    success: false,
                    message: 'Driver no encontrado para este usuario'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Driver obtenido exitosamente',
                data: driver
            });
        } catch (error) {
            console.error('❌ [DRIVER CONTROLLER] Error al obtener driver por User ID:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al obtener driver',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    /**
     * Crear nuevo driver
     * POST /api/v1/drivers/create
     */
    async createDriver(req: Request, res: Response): Promise<void> {
        try {
            const driverData = req.body;
            const currentUser = (req as any).user;

            console.log('➕ [DRIVER CONTROLLER] Creando nuevo driver:', driverData);
            console.log('👤 [DRIVER CONTROLLER] Usuario que crea:', currentUser);
            
            let newDriver;
            
            // Si se proporciona userId, convertir usuario existente a driver
            if (driverData.userId) {
                const createDriverDto: CreateDriverDto = driverData;
                console.log('🔄 [DRIVER CONTROLLER] Convirtiendo usuario existente a driver');
                newDriver = await this.driverRepository.create(createDriverDto);
            } else {
                // Si no hay userId, crear nuevo usuario como driver
                console.log('🆕 [DRIVER CONTROLLER] Creando nuevo usuario como driver');
                newDriver = await this.driverRepository.createWithUserData(driverData);
            }
            
            console.log('✅ [DRIVER CONTROLLER] Driver creado exitosamente:', newDriver);
            
            res.status(201).json({
                success: true,
                message: 'Driver creado exitosamente',
                data: newDriver
            });
        } catch (error) {
            console.error('❌ [DRIVER CONTROLLER] Error al crear driver:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al crear driver',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    /**
     * Actualizar driver
     * PUT /api/v1/drivers/update/:id
     */
    async updateDriver(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const driverId = parseInt(id);
            const updateData: UpdateDriverDto = req.body;

            if (isNaN(driverId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de driver inválido'
                });
                return;
            }

            console.log(`✏️ [DRIVER CONTROLLER] Actualizando driver ID: ${driverId}`, updateData);
            
            const updatedDriver = await this.driverRepository.update(driverId, updateData);
            
            if (!updatedDriver) {
                res.status(404).json({
                    success: false,
                    message: 'Driver no encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Driver actualizado exitosamente',
                data: updatedDriver
            });
        } catch (error) {
            console.error('❌ [DRIVER CONTROLLER] Error al actualizar driver:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al actualizar driver',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    /**
     * Eliminar driver
     * DELETE /api/v1/drivers/delete/:id
     */
    async deleteDriver(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const driverId = parseInt(id);

            if (isNaN(driverId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de driver inválido'
                });
                return;
            }

            console.log(`🗑️ [DRIVER CONTROLLER] Eliminando driver ID: ${driverId}`);
            
            await this.driverRepository.delete(driverId);
            
            res.status(200).json({
                success: true,
                message: 'Driver eliminado exitosamente'
            });
        } catch (error) {
            console.error('❌ [DRIVER CONTROLLER] Error al eliminar driver:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al eliminar driver',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    /**
     * Obtener estadísticas de drivers
     * GET /api/v1/drivers/stats
     */
    async getDriverStats(req: Request, res: Response): Promise<void> {
        try {
            console.log('📊 [DRIVER CONTROLLER] Obteniendo estadísticas de drivers');
            
            // Obtener el usuario actual del middleware de autenticación
            const currentUser = (req as any).user;
            let ownerId: number | undefined;

            // Si el usuario es OWNER_VEHICLE, filtrar por sus drivers
            if (currentUser?.role === 'OWNER_VEHICLE') {
                ownerId = currentUser.id;
            }
            
            const stats = await this.driverRepository.getStats(ownerId);
            
            res.status(200).json({
                success: true,
                message: 'Estadísticas de drivers obtenidas exitosamente',
                data: stats
            });
        } catch (error) {
            console.error('❌ [DRIVER CONTROLLER] Error al obtener estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al obtener estadísticas',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
}
