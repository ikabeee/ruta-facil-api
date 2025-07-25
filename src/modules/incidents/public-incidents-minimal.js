const express = require('express');
const router = express.Router();

// Importar Prisma Client generado
const { PrismaClient } = require('../../../generated/prisma');
const prisma = new PrismaClient();

console.log('🔧 [PUBLIC-INCIDENTS] Configurando router con rutas públicas...');

/**
 * GET /api/v1/public/incidents
 * Obtener todos los incidentes con información de la ruta
 */
router.get('/', async (req, res) => {
    try {
        console.log('📍 [PUBLIC-INCIDENTS] Obteniendo todos los incidentes...');
        
        const incidents = await prisma.incident.findMany({
            include: {
                route: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        firstPoint: true,
                        lastPoint: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50 // Limitar a 50 incidentes más recientes
        });

        console.log(`✅ [PUBLIC-INCIDENTS] ${incidents.length} incidentes encontrados`);
        
        res.json({
            success: true,
            message: 'Incidentes obtenidos exitosamente',
            data: incidents,
            total: incidents.length
        });
    } catch (error) {
        console.error('❌ [PUBLIC-INCIDENTS] Error al obtener incidentes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los incidentes',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/incidents/active
 * Obtener solo los incidentes activos (PENDING e IN_PROGRESS)
 */
router.get('/active', async (req, res) => {
    try {
        console.log('📍 [PUBLIC-INCIDENTS] Obteniendo incidentes activos...');
        
        const activeIncidents = await prisma.incident.findMany({
            where: {
                status: {
                    in: ['PENDING', 'IN_PROGRESS']
                }
            },
            include: {
                route: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        firstPoint: true,
                        lastPoint: true
                    }
                }
            },
            orderBy: [
                { priority: 'desc' }, // CRITICAL primero
                { createdAt: 'desc' }
            ]
        });

        console.log(`✅ [PUBLIC-INCIDENTS] ${activeIncidents.length} incidentes activos encontrados`);
        
        res.json({
            success: true,
            message: 'Incidentes activos obtenidos exitosamente',
            data: activeIncidents,
            total: activeIncidents.length
        });
    } catch (error) {
        console.error('❌ [PUBLIC-INCIDENTS] Error al obtener incidentes activos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los incidentes activos',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/incidents/route/:routeId
 * Obtener incidentes de una ruta específica
 */
router.get('/route/:routeId', async (req, res) => {
    try {
        const routeId = parseInt(req.params.routeId, 10);
        
        if (isNaN(routeId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de ruta inválido'
            });
        }

        console.log(`📍 [PUBLIC-INCIDENTS] Obteniendo incidentes de la ruta ${routeId}...`);
        
        const routeIncidents = await prisma.incident.findMany({
            where: {
                routeId: routeId
            },
            include: {
                route: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        firstPoint: true,
                        lastPoint: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`✅ [PUBLIC-INCIDENTS] ${routeIncidents.length} incidentes encontrados para la ruta ${routeId}`);
        
        res.json({
            success: true,
            message: `Incidentes de la ruta obtenidos exitosamente`,
            data: routeIncidents,
            total: routeIncidents.length,
            routeId: routeId
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-INCIDENTS] Error al obtener incidentes de la ruta:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los incidentes de la ruta',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/incidents/priority/:priority
 * Obtener incidentes por prioridad (LOW, MEDIUM, HIGH, CRITICAL)
 */
router.get('/priority/:priority', async (req, res) => {
    try {
        const priority = req.params.priority.toUpperCase();
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: 'Prioridad inválida. Debe ser: LOW, MEDIUM, HIGH, CRITICAL'
            });
        }

        console.log(`📍 [PUBLIC-INCIDENTS] Obteniendo incidentes con prioridad ${priority}...`);
        
        const priorityIncidents = await prisma.incident.findMany({
            where: {
                priority: priority
            },
            include: {
                route: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        firstPoint: true,
                        lastPoint: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`✅ [PUBLIC-INCIDENTS] ${priorityIncidents.length} incidentes encontrados con prioridad ${priority}`);
        
        res.json({
            success: true,
            message: `Incidentes con prioridad ${priority} obtenidos exitosamente`,
            data: priorityIncidents,
            total: priorityIncidents.length,
            priority: priority
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-INCIDENTS] Error al obtener incidentes por prioridad:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los incidentes por prioridad',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/incidents/stats
 * Obtener estadísticas básicas de incidentes
 */
router.get('/stats', async (req, res) => {
    try {
        console.log('📍 [PUBLIC-INCIDENTS] Obteniendo estadísticas de incidentes...');
        
        const [
            total,
            pending,
            inProgress,
            resolved,
            cancelled,
            critical,
            high,
            medium,
            low
        ] = await Promise.all([
            prisma.incident.count(),
            prisma.incident.count({ where: { status: 'PENDING' } }),
            prisma.incident.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.incident.count({ where: { status: 'RESOLVED' } }),
            prisma.incident.count({ where: { status: 'CANCELLED' } }),
            prisma.incident.count({ where: { priority: 'CRITICAL' } }),
            prisma.incident.count({ where: { priority: 'HIGH' } }),
            prisma.incident.count({ where: { priority: 'MEDIUM' } }),
            prisma.incident.count({ where: { priority: 'LOW' } })
        ]);

        const stats = {
            total,
            byStatus: {
                pending,
                inProgress,
                resolved,
                cancelled
            },
            byPriority: {
                critical,
                high,
                medium,
                low
            },
            active: pending + inProgress
        };

        console.log(`✅ [PUBLIC-INCIDENTS] Estadísticas obtenidas - Total: ${total}, Activos: ${stats.active}`);
        
        res.json({
            success: true,
            message: 'Estadísticas de incidentes obtenidas exitosamente',
            data: stats
        });
    } catch (error) {
        console.error('❌ [PUBLIC-INCIDENTS] Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las estadísticas de incidentes',
            error: error.message
        });
    }
});

/**
 * GET /api/v1/public/incidents/:id
 * Obtener un incidente específico por ID
 */
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de incidente inválido'
            });
        }

        console.log(`📍 [PUBLIC-INCIDENTS] Obteniendo incidente con ID ${id}...`);
        
        const incident = await prisma.incident.findUnique({
            where: {
                id: id
            },
            include: {
                route: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        firstPoint: true,
                        lastPoint: true,
                        description: true
                    }
                }
            }
        });

        if (!incident) {
            console.log(`❌ [PUBLIC-INCIDENTS] Incidente con ID ${id} no encontrado`);
            return res.status(404).json({
                success: false,
                message: 'Incidente no encontrado'
            });
        }

        console.log(`✅ [PUBLIC-INCIDENTS] Incidente ${id} encontrado: ${incident.title}`);
        
        res.json({
            success: true,
            message: 'Incidente obtenido exitosamente',
            data: incident
        });
    } catch (error) {
        console.error(`❌ [PUBLIC-INCIDENTS] Error al obtener incidente:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el incidente',
            error: error.message
        });
    }
});

console.log('✅ [PUBLIC-INCIDENTS] Router configurado con rutas:');
console.log('   📋 GET / - Para obtener todos los incidentes');
console.log('   🚨 GET /active - Para obtener incidentes activos');
console.log('   🛣️ GET /route/:routeId - Para incidentes de una ruta');
console.log('   ⚠️ GET /priority/:priority - Para incidentes por prioridad');
console.log('   📊 GET /stats - Para estadísticas');
console.log('   📄 GET /:id - Para obtener incidente por ID');

module.exports = router;
