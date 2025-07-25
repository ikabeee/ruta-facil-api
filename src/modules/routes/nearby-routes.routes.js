const express = require('express');
const { RouteService } = require('./route.service');
const { RouteRepository } = require('./route.repository');
const { PrismaClient } = require('../../../generated/prisma');

const prisma = new PrismaClient();
const routeRepository = new RouteRepository(prisma);
const routeService = new RouteService(routeRepository);
const router = express.Router();

// Función helper para calcular distancia entre dos puntos
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Endpoint para obtener rutas cercanas basadas en ubicación
router.get('/nearby-routes', async (req, res) => {
    try {
        const { latitude, longitude, radius = 5 } = req.query;
        
        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren las coordenadas latitude y longitude',
                data: null
            });
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const radiusKm = parseFloat(radius);

        if (isNaN(lat) || isNaN(lng) || isNaN(radiusKm)) {
            return res.status(400).json({
                success: false,
                message: 'Las coordenadas y el radio deben ser números válidos',
                data: null
            });
        }

        console.log(`🗺️ [ROUTES-NEARBY] Buscando rutas cerca de ${lat}, ${lng} en radio de ${radiusKm}km`);

        // Obtener todas las rutas para calcular distancias
        const allRoutes = await routeService.findAllRoutes();
        
        // Para cada ruta, necesitamos obtener sus paradas para calcular si está cerca
        const nearbyRoutes = [];
        
        for (const route of allRoutes) {
            try {
                // Obtener las paradas de la ruta
                const routeStops = await prisma.routeStop.findMany({
                    where: { routeId: route.id },
                    include: { stop: true },
                    orderBy: { order: 'asc' }
                });

                if (routeStops.length === 0) continue;

                // Calcular si alguna parada está dentro del radio
                let isNearby = false;
                let minDistance = Infinity;

                for (const routeStop of routeStops) {
                    const stop = routeStop.stop;
                    const distance = calculateDistance(lat, lng, stop.lat, stop.lng);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                    }
                    
                    if (distance <= radiusKm) {
                        isNearby = true;
                    }
                }

                if (isNearby) {
                    nearbyRoutes.push({
                        ...route,
                        distanceFromUser: minDistance,
                        nearestStopDistance: minDistance
                    });
                }
            } catch (error) {
                console.error(`❌ Error procesando ruta ${route.id}:`, error);
            }
        }

        // Ordenar por distancia
        nearbyRoutes.sort((a, b) => a.distanceFromUser - b.distanceFromUser);

        console.log(`✅ [ROUTES-NEARBY] Encontradas ${nearbyRoutes.length} rutas cercanas`);

        res.json({
            success: true,
            message: `Encontradas ${nearbyRoutes.length} rutas cercanas`,
            data: nearbyRoutes
        });

    } catch (error) {
        console.error('❌ [ROUTES-NEARBY] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al buscar rutas cercanas',
            data: null
        });
    }
});

module.exports = router;
