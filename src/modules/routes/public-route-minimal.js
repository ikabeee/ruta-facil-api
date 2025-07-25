const express = require('express');
const { PrismaClient } = require('../../../generated/prisma');

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
            error: error.message || 'Error desconocido'
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
            error: error.message || 'Error desconocido'
        });
    }
});

// Endpoint para obtener rutas cercanas (DEBE ir ANTES de /:id)
router.get('/nearby', async (req, res) => {
    console.log('🎯 [NEARBY-ENDPOINT] ¡ENDPOINT /nearby EJECUTÁNDOSE! v2');
    try {
        const { latitude, longitude, radius = 10 } = req.query;
        
        console.log(`📍 [PUBLIC-ROUTES] Petición de rutas cercanas:`, { latitude, longitude, radius });
        
        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Parámetros latitude y longitude son requeridos"
            });
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const radiusKm = parseFloat(radius);
        
        if (isNaN(lat) || isNaN(lng) || isNaN(radiusKm)) {
            return res.status(400).json({
                success: false,
                message: "Parámetros latitude, longitude y radius deben ser números válidos"
            });
        }

        console.log(`🗺️ [PUBLIC-ROUTES] Buscando rutas cerca de (${lat}, ${lng}) en radio de ${radiusKm}km`);
        
        // Obtener todas las rutas con sus paradas
        const routes = await prisma.route.findMany({
            include: {
                routeStops: {
                    include: {
                        stop: true
                    }
                }
            }
        });

        console.log(`🔍 [PUBLIC-ROUTES] Se encontraron ${routes.length} rutas totales para analizar`);
        
        // Diagnóstico: mostrar info de la primera ruta
        if (routes.length > 0) {
            const firstRoute = routes[0];
            console.log(`📊 [DEBUG] Primera ruta: "${firstRoute.name}" con ${firstRoute.routeStops.length} paradas`);
            if (firstRoute.routeStops.length > 0) {
                const firstStop = firstRoute.routeStops[0].stop;
                console.log(`📍 [DEBUG] Primera parada de "${firstRoute.name}": lat=${firstStop.latitude}, lng=${firstStop.longitude}`);
            }
        }

        // Función para calcular distancia entre dos puntos (Haversine)
        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radio de la Tierra en kilómetros
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }

        // Filtrar rutas que tengan al menos una parada dentro del radio
        // Si las paradas no tienen coordenadas, devolver todas las rutas como cercanas
        const nearbyRoutes = routes.filter(route => {
            // Si la ruta no tiene paradas, incluirla por defecto
            if (route.routeStops.length === 0) return true;
            
            // Verificar si alguna parada tiene coordenadas válidas
            const hasValidCoordinates = route.routeStops.some(routeStop => {
                const stop = routeStop.stop;
                return stop.latitude && stop.longitude;
            });
            
            // Si no hay coordenadas válidas, incluir la ruta por defecto
            if (!hasValidCoordinates) {
                console.log(`📍 [DEBUG] Ruta "${route.name}" no tiene coordenadas válidas, incluyendo por defecto`);
                return true;
            }
            
            // Si tiene coordenadas, aplicar el filtro de distancia
            return route.routeStops.some(routeStop => {
                const stop = routeStop.stop;
                if (!stop.latitude || !stop.longitude) return false;
                
                const distance = calculateDistance(lat, lng, stop.latitude, stop.longitude);
                console.log(`📍 [DEBUG] Distancia a parada ${stop.name}: ${distance.toFixed(2)}km`);
                return distance <= radiusKm;
            });
        }).map(route => {
            // Calcular la distancia mínima a cualquier parada de la ruta
            let minDistance = Infinity;
            let hasValidCoordinates = false;
            
            route.routeStops.forEach(routeStop => {
                const stop = routeStop.stop;
                if (stop.latitude && stop.longitude) {
                    hasValidCoordinates = true;
                    const distance = calculateDistance(lat, lng, stop.latitude, stop.longitude);
                    if (distance < minDistance) {
                        minDistance = distance;
                    }
                }
            });
            
            return {
                ...route,
                distance: hasValidCoordinates ? Math.round(minDistance * 100) / 100 : 0, // 0 km si no hay coordenadas
                routeStops: undefined // No incluir paradas en la respuesta
            };
        }).sort((a, b) => a.distance - b.distance); // Ordenar por distancia

        console.log(`✅ [PUBLIC-ROUTES] ${nearbyRoutes.length} rutas cercanas encontradas`);
        
        res.status(200).json({
            success: true,
            message: `Rutas cercanas encontradas dentro de ${radiusKm}km`,
            data: nearbyRoutes,
            metadata: {
                userLocation: { latitude: lat, longitude: lng },
                radius: radiusKm,
                totalFound: nearbyRoutes.length
            }
        });
    } catch (error) {
        console.error('❌ [PUBLIC-ROUTES] Error al obtener rutas cercanas:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener rutas cercanas",
            error: error.message || 'Error desconocido'
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
            error: error.message || 'Error desconocido'
        });
    }
});

module.exports = router;
