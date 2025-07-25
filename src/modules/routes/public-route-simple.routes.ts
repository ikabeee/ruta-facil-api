import express from 'express';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const router = express.Router();

// Endpoint para obtener todas las rutas
router.get('/', async (req, res) => {
    try {
        console.log('📍 [PUBLIC-ROUTES] Obteniendo todas las rutas...');
        
        const routes = await prisma.route.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        
        console.log(`✅ [PUBLIC-ROUTES] ${routes.length} rutas encontradas`);
        
        res.status(200).json({
            success: true,
            message: "Rutas obtenidas exitosamente",
            data: routes
        });
    } catch (error) {
        console.error('❌ [PUBLIC-ROUTES] Error al obtener rutas:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las rutas",
            error: error.message
        });
    }
});

// Endpoint para buscar rutas
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || typeof q !== 'string') {
            return res.status(400).json({
                success: false,
                message: "El parámetro 'q' es requerido para la búsqueda"
            });
        }

        console.log(`🔍 [PUBLIC-ROUTES] Buscando rutas con término: "${q}"`);
        
        const routes = await prisma.route.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: q.trim(),
                            mode: 'insensitive'
                        }
                    },
                    {
                        firstPoint: {
                            contains: q.trim(),
                            mode: 'insensitive'
                        }
                    },
                    {
                        lastPoint: {
                            contains: q.trim(),
                            mode: 'insensitive'
                        }
                    },
                    {
                        description: {
                            contains: q.trim(),
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            orderBy: {
                name: 'asc'
            }
        });
        
        console.log(`✅ [PUBLIC-ROUTES] ${routes.length} rutas encontradas para "${q}"`);
        
        res.status(200).json({
            success: true,
            message: `Búsqueda completada para "${q}"`,
            data: routes
        });
    } catch (error) {
        console.error('❌ [PUBLIC-ROUTES] Error en búsqueda:', error);
        res.status(500).json({
            success: false,
            message: "Error al buscar rutas",
            error: error.message
        });
    }
});

// Endpoint para obtener ruta por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const routeId = parseInt(id);
        
        if (isNaN(routeId)) {
            return res.status(400).json({
                success: false,
                message: "ID de ruta inválido"
            });
        }

        console.log(`📍 [PUBLIC-ROUTES] Obteniendo ruta con ID: ${routeId}`);
        
        const route = await prisma.route.findUnique({
            where: {
                id: routeId
            }
        });
        
        if (!route) {
            return res.status(404).json({
                success: false,
                message: `Ruta con ID ${routeId} no encontrada`
            });
        }
        
        console.log(`✅ [PUBLIC-ROUTES] Ruta encontrada: ${route.name}`);
        
        res.status(200).json({
            success: true,
            message: "Ruta obtenida exitosamente",
            data: route
        });
    } catch (error) {
        console.error('❌ [PUBLIC-ROUTES] Error al obtener ruta:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener la ruta",
            error: error.message
        });
    }
});

export default router;
