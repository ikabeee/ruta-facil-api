const express = require('express');
const router = express.Router();

// Importar Prisma Client generado
const { PrismaClient } = require('../../../generated/prisma');
const prisma = new PrismaClient();

console.log('🔧 [PUBLIC-ROUTE-TRACKING] Configurando router con rutas de seguimiento...');

/**
 * GET /api/v1/public/route-tracking/:routeId
 * Obtener información completa de una ruta con paradas para seguimiento en tiempo real
 */
router.get('/:routeId', async (req, res) => {
    try {
        const routeId = parseInt(req.params.routeId, 10);
        
        if (isNaN(routeId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de ruta inválido'
            });
        }

        console.log(`📍 [PUBLIC-ROUTE-TRACKING] Obteniendo información de seguimiento para ruta ${routeId}...`);
        
        // Obtener ruta con todas sus paradas
        const route = await prisma.route.findUnique({
            where: { id: routeId },
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
            console.log(`❌ [PUBLIC-ROUTE-TRACKING] Ruta ${routeId} no encontrada`);
            return res.status(404).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        }

        // Formatear las paradas con información completa
        const stops = route.routeStops.map(rs => ({
            id: rs.stop.id,
            name: rs.stop.name,
            address: rs.stop.address,
            latitude: rs.stop.lat,
            longitude: rs.stop.lng,
            facilities: rs.stop.facilities,
            accessibility: rs.stop.accessibility,
            order: rs.order
        }));

        // Generar coordenadas de la ruta (polyline) conectando las paradas
        const routeCoordinates = stops.map(stop => ({
            latitude: stop.latitude,
            longitude: stop.longitude,
            stopName: stop.name,
            order: stop.order
        }));

        // Simular ubicaciones de vehículos en tiempo real
        const vehicles = generateVehicleLocations(route, routeCoordinates);

        const trackingData = {
            route: {
                id: route.id,
                name: route.name,
                code: route.code,
                description: route.description,
                firstPoint: route.firstPoint,
                lastPoint: route.lastPoint,
                estimatedTime: route.estimatedTime,
                distance: route.distance,
                operatingHours: route.operatingHours,
                status: route.status
            },
            stops: route.routeStops.map(routeStop => ({
                id: routeStop.stop.id,
                name: routeStop.stop.name,
                address: routeStop.stop.address,
                latitude: routeStop.stop.lat,
                longitude: routeStop.stop.lng,
                order: routeStop.order,
                facilities: routeStop.stop.facilities,
                accessibility: routeStop.stop.accessibility
            })),
            routeCoordinates: routeCoordinates,
            vehicles: vehicles,
            totalStops: route.routeStops.length
        };

        console.log(`✅ [PUBLIC-ROUTE-TRACKING] Información de seguimiento obtenida para ${route.name}`);
        console.log(`   📍 ${trackingData.totalStops} paradas en la ruta`);
        console.log(`   🚐 ${vehicles.length} vehículos activos`);
        
        res.json({
            success: true,
            message: 'Información de seguimiento obtenida exitosamente',
            data: trackingData
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-ROUTE-TRACKING] Error obteniendo información de seguimiento:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener información de seguimiento',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/route-tracking/:routeId/vehicles
 * Obtener ubicaciones en tiempo real de vehículos de una ruta
 */
router.get('/:routeId/vehicles', async (req, res) => {
    try {
        const routeId = parseInt(req.params.routeId, 10);
        
        if (isNaN(routeId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de ruta inválido'
            });
        }

        console.log(`🚐 [PUBLIC-ROUTE-TRACKING] Obteniendo vehículos en tiempo real para ruta ${routeId}...`);
        
        // Obtener ruta con paradas
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

        const routeCoordinates = route.routeStops.map(routeStop => ({
            latitude: routeStop.stop.lat,
            longitude: routeStop.stop.lng
        }));

        // Generar ubicaciones de vehículos en tiempo real
        const vehicles = generateVehicleLocations(route, routeCoordinates);

        console.log(`✅ [PUBLIC-ROUTE-TRACKING] ${vehicles.length} vehículos obtenidos para ${route.name}`);
        
        res.json({
            success: true,
            message: 'Ubicaciones de vehículos obtenidas exitosamente',
            data: {
                routeId: routeId,
                routeName: route.name,
                vehicles: vehicles,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-ROUTE-TRACKING] Error obteniendo vehículos:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener ubicaciones de vehículos',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/route-tracking/:routeId/path
 * Obtener el trazado completo de la ruta (polyline)
 */
router.get('/:routeId/path', async (req, res) => {
    try {
        const routeId = parseInt(req.params.routeId, 10);
        
        if (isNaN(routeId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de ruta inválido'
            });
        }

        console.log(`🗺️ [PUBLIC-ROUTE-TRACKING] Obteniendo trazado de la ruta ${routeId}...`);
        
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

        // Generar puntos intermedios entre paradas para suavizar la ruta
        const pathCoordinates = generateSmoothPath(route.routeStops);

        console.log(`✅ [PUBLIC-ROUTE-TRACKING] Trazado obtenido con ${pathCoordinates.length} puntos`);
        
        res.json({
            success: true,
            message: 'Trazado de ruta obtenido exitosamente',
            data: {
                routeId: routeId,
                routeName: route.name,
                pathCoordinates: pathCoordinates,
                totalPoints: pathCoordinates.length
            }
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-ROUTE-TRACKING] Error obteniendo trazado:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener trazado de la ruta',
            error: error.message
        });
    }
});

// Función para generar ubicaciones simuladas de vehículos
function generateVehicleLocations(route, routeCoordinates) {
    const vehicles = [];
    const vehicleCount = Math.floor(Math.random() * 3) + 2; // 2-4 vehículos por ruta

    for (let i = 0; i < vehicleCount; i++) {
        // Seleccionar una posición aleatoria en la ruta
        const progress = Math.random(); // 0 a 1 (0% a 100% de la ruta)
        const position = interpolatePosition(routeCoordinates, progress);
        
        // Generar información del vehículo
        const vehicle = {
            id: `${route.code}-V${i + 1}`,
            routeId: route.id,
            unitNumber: `Unidad ${100 + i + 1}`,
            latitude: position.latitude,
            longitude: position.longitude,
            heading: Math.floor(Math.random() * 360), // Dirección en grados
            speed: Math.floor(Math.random() * 20) + 20, // 20-40 km/h
            passengers: Math.floor(Math.random() * 30) + 5, // 5-35 pasajeros
            capacity: 40,
            status: 'active',
            lastUpdate: new Date().toISOString(),
            nextStop: getNextStop(routeCoordinates, progress),
            estimatedArrival: getEstimatedArrival(),
            routeProgress: Math.floor(progress * 100) // Porcentaje de progreso
        };

        vehicles.push(vehicle);
    }

    return vehicles;
}

// Función para interpolar posición en la ruta
function interpolatePosition(coordinates, progress) {
    if (coordinates.length === 0) return { latitude: 20.1743, longitude: -98.0474 };
    if (progress <= 0) return coordinates[0];
    if (progress >= 1) return coordinates[coordinates.length - 1];

    const totalSegments = coordinates.length - 1;
    const segmentProgress = progress * totalSegments;
    const segmentIndex = Math.floor(segmentProgress);
    const segmentOffset = segmentProgress - segmentIndex;

    if (segmentIndex >= coordinates.length - 1) {
        return coordinates[coordinates.length - 1];
    }

    const start = coordinates[segmentIndex];
    const end = coordinates[segmentIndex + 1];

    return {
        latitude: start.latitude + (end.latitude - start.latitude) * segmentOffset,
        longitude: start.longitude + (end.longitude - start.longitude) * segmentOffset
    };
}

// Función para obtener la siguiente parada
function getNextStop(coordinates, progress) {
    const totalStops = coordinates.length;
    const currentStopIndex = Math.floor(progress * totalStops);
    
    if (currentStopIndex >= totalStops - 1) {
        return coordinates[0]; // Regresar al inicio si es circular
    }
    
    return coordinates[currentStopIndex + 1];
}

// Función para calcular tiempo estimado de llegada
function getEstimatedArrival() {
    const minutes = Math.floor(Math.random() * 15) + 2; // 2-17 minutos
    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + minutes);
    return arrivalTime.toISOString();
}

// Función para generar un trazado suave entre paradas
function generateSmoothPath(routeStops) {
    const path = [];
    
    for (let i = 0; i < routeStops.length; i++) {
        const currentStop = routeStops[i].stop;
        path.push({
            latitude: currentStop.lat,
            longitude: currentStop.lng,
            isStop: true,
            stopName: currentStop.name
        });

        // Agregar puntos intermedios hacia la siguiente parada
        if (i < routeStops.length - 1) {
            const nextStop = routeStops[i + 1].stop;
            const intermediatePoints = generateIntermediatePoints(
                currentStop.lat, currentStop.lng,
                nextStop.lat, nextStop.lng,
                5 // 5 puntos intermedios
            );
            
            path.push(...intermediatePoints);
        }
    }

    return path;
}

// Función para generar puntos intermedios entre dos coordenadas
function generateIntermediatePoints(lat1, lng1, lat2, lng2, numPoints) {
    const points = [];
    
    for (let i = 1; i <= numPoints; i++) {
        const ratio = i / (numPoints + 1);
        points.push({
            latitude: lat1 + (lat2 - lat1) * ratio,
            longitude: lng1 + (lng2 - lng1) * ratio,
            isStop: false
        });
    }
    
    return points;
}

console.log('✅ [PUBLIC-ROUTE-TRACKING] Router configurado con rutas:');
console.log('   🗺️ GET /:routeId - Para obtener información completa de seguimiento');
console.log('   🚐 GET /:routeId/vehicles - Para ubicaciones en tiempo real');
console.log('   📍 GET /:routeId/path - Para trazado de la ruta');

module.exports = router;
