const express = require('express');
const { PrismaClient } = require('../../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

console.log('🔧 [PUBLIC-STARRED-ROUTES] Configurando router con rutas para favoritos...');

// Obtener rutas favoritas por userId
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log(`📍 [PUBLIC-STARRED-ROUTES] GET request para favoritos del usuario: ${userId}`);
        
        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({
                success: false,
                message: "ID de usuario inválido"
            });
        }

        const starredRoutes = await prisma.starredRoute.findMany({
            where: { 
                userId: parseInt(userId)
            },
            include: {
                routes: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        img: true,
                        firstPoint: true,
                        lastPoint: true,
                        description: true,
                        distance: true,
                        estimatedTime: true,
                        totalStops: true,
                        assignedUnits: true,
                        dailyTrips: true,
                        operatingHours: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        console.log(`✅ [PUBLIC-STARRED-ROUTES] ${starredRoutes.length} rutas favoritas encontradas para usuario ${userId}`);
        
        res.status(200).json({
            success: true,
            message: "Rutas favoritas obtenidas exitosamente",
            data: starredRoutes
        });
    } catch (error) {
        console.error('❌ [PUBLIC-STARRED-ROUTES] Error al obtener rutas favoritas:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las rutas favoritas",
            error: error.message || 'Error desconocido'
        });
    }
});

// Verificar si una ruta es favorita para un usuario
router.get('/check/:userId/:routeId', async (req, res) => {
    try {
        const { userId, routeId } = req.params;
        
        console.log(`📍 [PUBLIC-STARRED-ROUTES] Verificando si ruta ${routeId} es favorita para usuario ${userId}`);
        
        if (!userId || isNaN(parseInt(userId)) || !routeId || isNaN(parseInt(routeId))) {
            return res.status(400).json({
                success: false,
                message: "IDs inválidos"
            });
        }

        const starredRoute = await prisma.starredRoute.findFirst({
            where: {
                userId: parseInt(userId),
                routeId: parseInt(routeId)
            }
        });
        
        const isFavorite = !!starredRoute;
        console.log(`✅ [PUBLIC-STARRED-ROUTES] Ruta ${routeId} ${isFavorite ? 'ES' : 'NO ES'} favorita para usuario ${userId}`);
        
        res.status(200).json({
            success: true,
            message: "Verificación completada",
            data: {
                isFavorite,
                starredRoute: starredRoute || null
            }
        });
    } catch (error) {
        console.error('❌ [PUBLIC-STARRED-ROUTES] Error al verificar favorito:', error);
        res.status(500).json({
            success: false,
            message: "Error al verificar favorito",
            error: error.message || 'Error desconocido'
        });
    }
});

// Agregar/quitar de favoritos (toggle)
router.post('/toggle', async (req, res) => {
    try {
        const { userId, routeId, name } = req.body;
        
        console.log(`📍 [PUBLIC-STARRED-ROUTES] POST toggle favorito - Usuario: ${userId}, Ruta: ${routeId}`);
        
        if (!userId || !routeId) {
            return res.status(400).json({
                success: false,
                message: "Se requieren userId y routeId"
            });
        }

        // Verificar si ya existe
        const existing = await prisma.starredRoute.findFirst({
            where: {
                userId: parseInt(userId),
                routeId: parseInt(routeId)
            }
        });

        if (existing) {
            // Si existe, eliminar
            await prisma.starredRoute.delete({
                where: { id: existing.id }
            });
            
            console.log(`✅ [PUBLIC-STARRED-ROUTES] Ruta ${routeId} eliminada de favoritos del usuario ${userId}`);
            
            res.status(200).json({
                success: true,
                message: "Ruta eliminada de favoritos",
                data: {
                    action: 'removed',
                    routeId: parseInt(routeId),
                    userId: parseInt(userId)
                }
            });
        } else {
            // Si no existe, crear
            const starredRoute = await prisma.starredRoute.create({
                data: {
                    name: name || 'Mi ruta favorita',
                    userId: parseInt(userId),
                    routeId: parseInt(routeId)
                },
                include: {
                    routes: true
                }
            });
            
            console.log(`✅ [PUBLIC-STARRED-ROUTES] Ruta ${routeId} agregada a favoritos del usuario ${userId}`);
            
            res.status(201).json({
                success: true,
                message: "Ruta agregada a favoritos",
                data: {
                    action: 'added',
                    starredRoute
                }
            });
        }
    } catch (error) {
        console.error('❌ [PUBLIC-STARRED-ROUTES] Error al hacer toggle de favorito:', error);
        res.status(500).json({
            success: false,
            message: "Error al procesar favorito",
            error: error.message || 'Error desconocido'
        });
    }
});

// Eliminar favorito por ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`📍 [PUBLIC-STARRED-ROUTES] DELETE favorito con ID: ${id}`);
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const starredRoute = await prisma.starredRoute.findUnique({
            where: { id: parseInt(id) }
        });

        if (!starredRoute) {
            return res.status(404).json({
                success: false,
                message: "Ruta favorita no encontrada"
            });
        }

        await prisma.starredRoute.delete({
            where: { id: parseInt(id) }
        });
        
        console.log(`✅ [PUBLIC-STARRED-ROUTES] Favorito ${id} eliminado exitosamente`);
        
        res.status(200).json({
            success: true,
            message: "Ruta favorita eliminada exitosamente",
            data: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('❌ [PUBLIC-STARRED-ROUTES] Error al eliminar favorito:', error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar favorito",
            error: error.message || 'Error desconocido'
        });
    }
});

console.log('✅ [PUBLIC-STARRED-ROUTES] Router configurado con rutas:');
console.log('   📍 GET /user/:userId - Obtener favoritos por usuario');
console.log('   📍 GET /check/:userId/:routeId - Verificar si es favorito');
console.log('   📍 POST /toggle - Agregar/quitar favorito');
console.log('   📍 DELETE /:id - Eliminar favorito por ID');

module.exports = router;
