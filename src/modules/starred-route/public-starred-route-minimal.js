const express = require('express');
const { PrismaClient } = require('../../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

console.log('🔧 [PUBLIC-STARRED-ROUTE] Configurando router con rutas públicas...');

// Verificar si una ruta es favorita para un usuario
router.get('/check/:userId/:routeId', async (req, res) => {
    try {
        const { userId, routeId } = req.params;
        console.log(`📍 [PUBLIC-STARRED-ROUTE] GET request para verificar favorito:`, { userId, routeId });
        
        if (!userId || !routeId || isNaN(parseInt(userId)) || isNaN(parseInt(routeId))) {
            return res.status(400).json({
                success: false,
                message: "Se requieren userId y routeId válidos"
            });
        }

        // Verificar si existe
        const existing = await prisma.starredRoute.findFirst({
            where: {
                userId: parseInt(userId),
                routeId: parseInt(routeId)
            }
        });

        console.log(`✅ [PUBLIC-STARRED-ROUTE] Verificación completada: ${existing ? 'Es favorito' : 'No es favorito'}`);
        
        res.status(200).json({
            success: true,
            message: "Verificación completada",
            data: {
                isFavorite: !!existing,
                starredRoute: existing || null
            }
        });
    } catch (error) {
        console.error('❌ [PUBLIC-STARRED-ROUTE] Error al verificar favorito:', error);
        res.status(500).json({
            success: false,
            message: "Error al verificar el favorito",
            error: error.message || 'Error desconocido'
        });
    }
});

// Obtener favoritos por userId
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`📍 [PUBLIC-STARRED-ROUTE] GET request para favoritos del usuario: ${userId}`);
        
        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({
                success: false,
                message: "Se requiere un userId válido"
            });
        }

        // Obtener favoritos del usuario con información de la ruta
        const favorites = await prisma.starredRoute.findMany({
            where: { 
                userId: parseInt(userId)
            },
            include: {
                routes: {
                    select: {
                        id: true,
                        name: true,
                        firstPoint: true,
                        lastPoint: true,
                        description: true,
                        distance: true,
                        estimatedTime: true,
                        totalStops: true,
                        assignedUnits: true,
                        dailyTrips: true,
                        status: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        console.log(`✅ [PUBLIC-STARRED-ROUTE] ${favorites.length} favoritos encontrados para usuario ${userId}`);
        
        res.status(200).json({
            success: true,
            message: "Favoritos obtenidos exitosamente",
            data: favorites
        });
    } catch (error) {
        console.error('❌ [PUBLIC-STARRED-ROUTE] Error al obtener favoritos:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los favoritos",
            error: error.message || 'Error desconocido'
        });
    }
});

// Agregar ruta a favoritos
router.post('/toggle', async (req, res) => {
    try {
        const { userId, routeId, name } = req.body;
        console.log(`📍 [PUBLIC-STARRED-ROUTE] POST request para toggle favorito:`, { userId, routeId, name });
        
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
            
            console.log(`✅ [PUBLIC-STARRED-ROUTE] Favorito eliminado para usuario ${userId}, ruta ${routeId}`);
            
            res.status(200).json({
                success: true,
                message: "Ruta eliminada de favoritos",
                data: { action: 'removed' }
            });
        } else {
            // Si no existe, crear
            const starredRoute = await prisma.starredRoute.create({
                data: {
                    name: name || 'Mi ruta favorita',
                    routeId: parseInt(routeId),
                    userId: parseInt(userId)
                },
                include: {
                    routes: true
                }
            });
            
            console.log(`✅ [PUBLIC-STARRED-ROUTE] Favorito agregado para usuario ${userId}, ruta ${routeId}`);
            
            res.status(201).json({
                success: true,
                message: "Ruta agregada a favoritos",
                data: { action: 'added', starredRoute }
            });
        }
    } catch (error) {
        console.error('❌ [PUBLIC-STARRED-ROUTE] Error al toggle favorito:', error);
        res.status(500).json({
            success: false,
            message: "Error al procesar el favorito",
            error: error.message || 'Error desconocido'
        });
    }
});

// Eliminar favorito por ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📍 [PUBLIC-STARRED-ROUTE] DELETE request para favorito: ${id}`);
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "Se requiere un ID válido"
            });
        }

        // Verificar si existe
        const existing = await prisma.starredRoute.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Favorito no encontrado"
            });
        }

        // Eliminar
        await prisma.starredRoute.delete({
            where: { id: parseInt(id) }
        });
        
        console.log(`✅ [PUBLIC-STARRED-ROUTE] Favorito eliminado: ${id}`);
        
        res.status(200).json({
            success: true,
            message: "Favorito eliminado exitosamente"
        });
    } catch (error) {
        console.error('❌ [PUBLIC-STARRED-ROUTE] Error al eliminar favorito:', error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar el favorito",
            error: error.message || 'Error desconocido'
        });
    }
});

console.log('✅ [PUBLIC-STARRED-ROUTE] Router configurado con rutas:');
console.log('   ⭐ GET /user/:userId - Para obtener favoritos del usuario');
console.log('   ⭐ GET /check/:userId/:routeId - Para verificar si una ruta es favorita');
console.log('   ⭐ POST /toggle - Para agregar/quitar favoritos');
console.log('   ⭐ DELETE /:id - Para eliminar favorito por ID');

module.exports = router;
