const express = require('express');
const router = express.Router();

// Importar Prisma Client generado
const { PrismaClient } = require('../../../generated/prisma');
const prisma = new PrismaClient();

console.log('🔧 [PUBLIC-ROUTES-DETAILED] Configurando router con rutas completas...');

/**
 * GET /api/v1/public/routes-detailed
 * Obtener todas las rutas con paradas y coordenadas completas
 */
router.get('/', async (req, res) => {
    try {
        console.log('📍 [PUBLIC-ROUTES-DETAILED] Obteniendo rutas completas con paradas...');
        
        const routes = await prisma.route.findMany({
            include: {
                routeStops: {
                    include: {
                        stop: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Transformar datos para incluir información completa de paradas
        const detailedRoutes = routes.map(route => ({
            id: route.id,
            code: route.code,
            name: route.name,
            firstPoint: route.firstPoint,
            lastPoint: route.lastPoint,
            description: route.description,
            distance: route.distance,
            estimatedTime: route.estimatedTime,
            operatingHours: route.operatingHours,
            status: route.status,
            totalStops: route.routeStops.length,
            stops: route.routeStops.map(rs => ({
                id: rs.stop.id,
                order: rs.order,
                name: rs.stop.name,
                address: rs.stop.address,
                lat: rs.stop.lat,
                lng: rs.stop.lng,
                facilities: rs.stop.facilities,
                accessibility: rs.stop.accessibility,
                status: rs.stop.status
            })),
            // Calcular ruta como polyline simple (línea recta entre paradas)
            polyline: route.routeStops.map(rs => ({
                lat: rs.stop.lat,
                lng: rs.stop.lng
            }))
        }));

        console.log(`✅ [PUBLIC-ROUTES-DETAILED] ${detailedRoutes.length} rutas encontradas`);
        
        res.json({
            success: true,
            message: 'Rutas detalladas obtenidas exitosamente',
            data: detailedRoutes,
            total: detailedRoutes.length
        });
    } catch (error) {
        console.error('❌ [PUBLIC-ROUTES-DETAILED] Error al obtener rutas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las rutas detalladas',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/routes-detailed/:id
 * Obtener una ruta específica con paradas y coordenadas
 */
router.get('/:id', async (req, res) => {
    try {
        const routeId = parseInt(req.params.id, 10);
        
        if (isNaN(routeId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de ruta inválido'
            });
        }

        console.log(`📍 [PUBLIC-ROUTES-DETAILED] Obteniendo ruta ${routeId} con paradas...`);
        
        const route = await prisma.route.findUnique({
            where: {
                id: routeId
            },
            include: {
                routeStops: {
                    include: {
                        stop: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        if (!route) {
            console.log(`❌ [PUBLIC-ROUTES-DETAILED] Ruta ${routeId} no encontrada`);
            return res.status(404).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        }

        // Transformar datos
        const detailedRoute = {
            id: route.id,
            code: route.code,
            name: route.name,
            firstPoint: route.firstPoint,
            lastPoint: route.lastPoint,
            description: route.description,
            distance: route.distance,
            estimatedTime: route.estimatedTime,
            operatingHours: route.operatingHours,
            status: route.status,
            totalStops: route.routeStops.length,
            stops: route.routeStops.map(rs => ({
                id: rs.stop.id,
                order: rs.order,
                name: rs.stop.name,
                address: rs.stop.address,
                lat: rs.stop.lat,
                lng: rs.stop.lng,
                facilities: rs.stop.facilities,
                accessibility: rs.stop.accessibility,
                status: rs.stop.status
            })),
            polyline: route.routeStops.map(rs => ({
                lat: rs.stop.lat,
                lng: rs.stop.lng
            }))
        };

        console.log(`✅ [PUBLIC-ROUTES-DETAILED] Ruta ${routeId} encontrada: ${route.name}`);
        
        res.json({
            success: true,
            message: 'Ruta detallada obtenida exitosamente',
            data: detailedRoute
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-ROUTES-DETAILED] Error al obtener ruta:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la ruta detallada',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/routes-detailed/:id/coordinates
 * Obtener coordenadas de polyline interpoladas para una ruta
 */
router.get('/:id/coordinates', async (req, res) => {
    try {
        const routeId = parseInt(req.params.id, 10);
        const points = parseInt(req.query.points) || 50; // Número de puntos a interpolar
        
        if (isNaN(routeId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de ruta inválido'
            });
        }

        console.log(`📍 [PUBLIC-ROUTES-DETAILED] Obteniendo coordenadas interpoladas para ruta ${routeId}...`);
        
        const route = await prisma.route.findUnique({
            where: { id: routeId },
            include: {
                routeStops: {
                    include: { stop: true },
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        }

        // Obtener coordenadas de las paradas
        const stopCoordinates = route.routeStops.map(rs => ({
            lat: rs.stop.lat,
            lng: rs.stop.lng,
            name: rs.stop.name,
            order: rs.order
        }));

        // Función simple para interpolar puntos entre dos coordenadas
        function interpolatePoints(start, end, numPoints) {
            const points = [];
            for (let i = 0; i <= numPoints; i++) {
                const ratio = i / numPoints;
                const lat = start.lat + (end.lat - start.lat) * ratio;
                const lng = start.lng + (end.lng - start.lng) * ratio;
                points.push({ lat, lng });
            }
            return points;
        }

        // Interpolar puntos entre todas las paradas
        let interpolatedRoute = [];
        for (let i = 0; i < stopCoordinates.length - 1; i++) {
            const segmentPoints = interpolatePoints(
                stopCoordinates[i], 
                stopCoordinates[i + 1], 
                Math.floor(points / (stopCoordinates.length - 1))
            );
            interpolatedRoute = interpolatedRoute.concat(segmentPoints);
        }

        console.log(`✅ [PUBLIC-ROUTES-DETAILED] ${interpolatedRoute.length} coordenadas interpoladas generadas`);
        
        res.json({
            success: true,
            message: 'Coordenadas de ruta obtenidas exitosamente',
            data: {
                routeId: route.id,
                routeName: route.name,
                totalPoints: interpolatedRoute.length,
                coordinates: interpolatedRoute,
                stops: stopCoordinates
            }
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-ROUTES-DETAILED] Error al obtener coordenadas:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las coordenadas de la ruta',
            error: error.message
        });
    }
});

console.log('✅ [PUBLIC-ROUTES-DETAILED] Router configurado con rutas:');
console.log('   🚌 GET / - Para obtener todas las rutas con paradas');
console.log('   📍 GET /:id - Para obtener ruta específica con paradas');
console.log('   🗺️ GET /:id/coordinates - Para obtener coordenadas interpoladas');

module.exports = router;
