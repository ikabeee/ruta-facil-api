const express = require('express');
const router = express.Router();

// Importar Prisma Client generado
const { PrismaClient } = require('../../../generated/prisma');
const prisma = new PrismaClient();

console.log('🔧 [PUBLIC-TRACKING] Configurando router de seguimiento en tiempo real...');

// Simulación de ubicaciones de autobuses en tiempo real
const busLocations = new Map();

/**
 * Función para simular movimiento de autobús a lo largo de una ruta
 */
function simulateBusMovement(routeId, coordinates) {
    let currentIndex = 0;
    let progress = 0;
    
    const busData = {
        routeId,
        currentStopIndex: 0,
        coordinates,
        totalPoints: coordinates.length,
        currentPosition: coordinates[0],
        speed: 1, // Puntos por actualización
        direction: 1, // 1 = adelante, -1 = atrás
        lastUpdate: Date.now(),
        passengers: Math.floor(Math.random() * 30) + 5, // 5-35 pasajeros
        capacity: 40,
        driverId: Math.floor(Math.random() * 100) + 1,
        vehicleId: `BUS-${routeId}-${Math.floor(Math.random() * 10) + 1}`,
        status: 'EN_RUTA'
    };
    
    busLocations.set(routeId, busData);
    
    // Actualizar posición cada 2 segundos
    const interval = setInterval(() => {
        const bus = busLocations.get(routeId);
        if (!bus) {
            clearInterval(interval);
            return;
        }
        
        // Mover el autobús
        currentIndex += bus.speed * bus.direction;
        
        // Verificar límites y cambiar dirección si es necesario
        if (currentIndex >= coordinates.length - 1) {
            currentIndex = coordinates.length - 1;
            bus.direction = -1; // Cambiar dirección
        } else if (currentIndex <= 0) {
            currentIndex = 0;
            bus.direction = 1; // Cambiar dirección
        }
        
        // Actualizar posición
        bus.currentPosition = coordinates[currentIndex];
        bus.currentStopIndex = Math.floor((currentIndex / coordinates.length) * bus.coordinates.length);
        bus.lastUpdate = Date.now();
        bus.progress = (currentIndex / (coordinates.length - 1)) * 100;
        
        // Simular cambios aleatorios
        if (Math.random() < 0.1) { // 10% de probabilidad
            bus.passengers = Math.max(0, Math.min(bus.capacity, 
                bus.passengers + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)
            ));
        }
        
        busLocations.set(routeId, bus);
    }, 2000); // Actualizar cada 2 segundos
    
    return interval;
}

/**
 * GET /api/v1/public/tracking/routes/:id/start
 * Iniciar seguimiento de una ruta específica
 */
router.get('/routes/:id/start', async (req, res) => {
    try {
        const routeId = parseInt(req.params.id, 10);
        
        if (isNaN(routeId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de ruta inválido'
            });
        }

        console.log(`📍 [PUBLIC-TRACKING] Iniciando seguimiento de ruta ${routeId}...`);
        
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

        // Obtener coordenadas de la ruta
        const coordinates = route.routeStops.map(rs => ({
            lat: rs.stop.lat,
            lng: rs.stop.lng,
            stopId: rs.stop.id,
            stopName: rs.stop.name,
            order: rs.order
        }));

        // Interpolar más puntos para movimiento suave
        function interpolateRoute(coords, pointsPerSegment = 20) {
            let interpolated = [];
            for (let i = 0; i < coords.length - 1; i++) {
                const start = coords[i];
                const end = coords[i + 1];
                
                for (let j = 0; j <= pointsPerSegment; j++) {
                    const ratio = j / pointsPerSegment;
                    interpolated.push({
                        lat: start.lat + (end.lat - start.lat) * ratio,
                        lng: start.lng + (end.lng - start.lng) * ratio,
                        stopId: j === pointsPerSegment ? end.stopId : start.stopId,
                        stopName: j === pointsPerSegment ? end.stopName : start.stopName,
                        order: start.order
                    });
                }
            }
            return interpolated;
        }

        const interpolatedCoords = interpolateRoute(coordinates);
        
        // Iniciar simulación si no existe
        if (!busLocations.has(routeId)) {
            simulateBusMovement(routeId, interpolatedCoords);
        }

        const busData = busLocations.get(routeId);

        console.log(`✅ [PUBLIC-TRACKING] Seguimiento iniciado para ruta ${route.name}`);
        
        res.json({
            success: true,
            message: 'Seguimiento de ruta iniciado exitosamente',
            data: {
                route: {
                    id: route.id,
                    code: route.code,
                    name: route.name,
                    description: route.description,
                    estimatedTime: route.estimatedTime,
                    totalStops: route.routeStops.length
                },
                stops: coordinates,
                tracking: {
                    isActive: true,
                    updateInterval: 2000, // milisegundos
                    totalPoints: interpolatedCoords.length
                },
                currentBus: busData
            }
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-TRACKING] Error al iniciar seguimiento:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar el seguimiento',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/tracking/routes/:id/location
 * Obtener ubicación actual del autobús
 */
router.get('/routes/:id/location', async (req, res) => {
    try {
        const routeId = parseInt(req.params.id, 10);
        
        if (isNaN(routeId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de ruta inválido'
            });
        }

        const busData = busLocations.get(routeId);
        
        if (!busData) {
            return res.status(404).json({
                success: false,
                message: 'No hay seguimiento activo para esta ruta'
            });
        }

        console.log(`📍 [PUBLIC-TRACKING] Ubicación actual de ruta ${routeId}`);
        
        res.json({
            success: true,
            message: 'Ubicación del autobús obtenida exitosamente',
            data: {
                routeId: routeId,
                position: busData.currentPosition,
                currentStopIndex: busData.currentStopIndex,
                progress: busData.progress,
                passengers: busData.passengers,
                capacity: busData.capacity,
                vehicleId: busData.vehicleId,
                status: busData.status,
                lastUpdate: busData.lastUpdate,
                eta: Math.floor(Math.random() * 15) + 2 // ETA simulado 2-17 minutos
            }
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-TRACKING] Error al obtener ubicación:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la ubicación',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/tracking/routes/:id/stop
 * Detener seguimiento de una ruta
 */
router.get('/routes/:id/stop', async (req, res) => {
    try {
        const routeId = parseInt(req.params.id, 10);
        
        if (isNaN(routeId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de ruta inválido'
            });
        }

        if (busLocations.has(routeId)) {
            busLocations.delete(routeId);
            console.log(`🛑 [PUBLIC-TRACKING] Seguimiento detenido para ruta ${routeId}`);
        }
        
        res.json({
            success: true,
            message: 'Seguimiento de ruta detenido exitosamente',
            data: {
                routeId: routeId,
                trackingActive: false
            }
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-TRACKING] Error al detener seguimiento:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al detener el seguimiento',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/tracking/active
 * Obtener todas las rutas con seguimiento activo
 */
router.get('/active', async (req, res) => {
    try {
        console.log(`📍 [PUBLIC-TRACKING] Obteniendo rutas con seguimiento activo...`);
        
        const activeRoutes = [];
        for (const [routeId, busData] of busLocations.entries()) {
            activeRoutes.push({
                routeId: parseInt(routeId),
                position: busData.currentPosition,
                progress: busData.progress,
                passengers: busData.passengers,
                vehicleId: busData.vehicleId,
                status: busData.status,
                lastUpdate: busData.lastUpdate
            });
        }
        
        res.json({
            success: true,
            message: 'Rutas activas obtenidas exitosamente',
            data: {
                totalActive: activeRoutes.length,
                routes: activeRoutes
            }
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-TRACKING] Error al obtener rutas activas:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las rutas activas',
            error: error.message
        });
    }
});

console.log('✅ [PUBLIC-TRACKING] Router configurado con rutas:');
console.log('   🚀 GET /routes/:id/start - Para iniciar seguimiento');
console.log('   📍 GET /routes/:id/location - Para obtener ubicación actual');
console.log('   🛑 GET /routes/:id/stop - Para detener seguimiento');
console.log('   📊 GET /active - Para obtener rutas activas');

module.exports = router;
