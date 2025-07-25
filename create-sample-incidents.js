const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function createSampleIncidents() {
    try {
        console.log('🚨 Creando incidentes de prueba...');

        // Primero verificamos que existan rutas
        const routes = await prisma.route.findMany({
            select: { id: true, name: true }
        });

        if (routes.length === 0) {
            console.log('❌ No hay rutas disponibles. Créalas primero.');
            return;
        }

        console.log(`✅ Encontradas ${routes.length} rutas disponibles`);
        routes.forEach(route => console.log(`   - ${route.id}: ${route.name}`));

        // Crear incidentes de prueba
        const incidents = [
            {
                title: 'Accidente de tránsito menor',
                description: 'Choque entre dos vehículos en la intersección principal. No hay heridos, pero hay congestión vehicular.',
                priority: 'HIGH',
                status: 'IN_PROGRESS',
                location: 'Av. Principal con Calle 5',
                unit: 'Unidad 101',
                reportedBy: 'Conductor Luis García',
                type: 'ACCIDENTE',
                routeId: routes[0].id
            },
            {
                title: 'Semáforo dañado',
                description: 'El semáforo de la estación central no está funcionando correctamente, causando demoras.',
                priority: 'MEDIUM',
                status: 'PENDING',
                location: 'Estación Central',
                reportedBy: 'Personal de mantenimiento',
                type: 'INFRAESTRUCTURA',
                routeId: routes[0].id
            },
            {
                title: 'Vehículo averiado',
                description: 'Autobús con falla mecánica en la ruta. Pasajeros trasladados a otra unidad.',
                priority: 'HIGH',
                status: 'RESOLVED',
                location: 'Parada El Centro',
                unit: 'Unidad 205',
                reportedBy: 'Conductor María Rodríguez',
                type: 'VEHICULAR',
                routeId: routes.length > 1 ? routes[1].id : routes[0].id
            },
            {
                title: 'Manifestación en la vía',
                description: 'Grupo de manifestantes bloqueando parcialmente el tráfico. Se recomienda ruta alternativa.',
                priority: 'CRITICAL',
                status: 'IN_PROGRESS',
                location: 'Plaza Principal',
                reportedBy: 'Policía Municipal',
                type: 'EVENTOS',
                routeId: routes.length > 2 ? routes[2].id : routes[0].id
            },
            {
                title: 'Obras en la carretera',
                description: 'Trabajos de mantenimiento vial programados. Carril derecho cerrado.',
                priority: 'LOW',
                status: 'PENDING',
                location: 'Km 15 Carretera Nacional',
                reportedBy: 'Ministerio de Obras Públicas',
                type: 'MANTENIMIENTO',
                routeId: routes[0].id
            },
            {
                title: 'Condiciones climáticas adversas',
                description: 'Lluvia intensa causando reducción de visibilidad y velocidad en toda la ruta.',
                priority: 'MEDIUM',
                status: 'IN_PROGRESS',
                location: 'Toda la ruta',
                reportedBy: 'Centro Meteorológico',
                type: 'CLIMA',
                routeId: routes.length > 1 ? routes[1].id : routes[0].id
            }
        ];

        // Insertar los incidentes
        for (const incident of incidents) {
            const createdIncident = await prisma.incident.create({
                data: incident
            });
            console.log(`✅ Incidente creado: ${createdIncident.id} - ${createdIncident.title}`);
        }

        console.log('🎉 ¡Incidentes de prueba creados exitosamente!');

        // Mostrar estadísticas
        const total = await prisma.incident.count();
        const pending = await prisma.incident.count({ where: { status: 'PENDING' } });
        const inProgress = await prisma.incident.count({ where: { status: 'IN_PROGRESS' } });
        const resolved = await prisma.incident.count({ where: { status: 'RESOLVED' } });

        console.log('\n📊 Estadísticas de incidentes:');
        console.log(`   Total: ${total}`);
        console.log(`   Pendientes: ${pending}`);
        console.log(`   En progreso: ${inProgress}`);
        console.log(`   Resueltos: ${resolved}`);

    } catch (error) {
        console.error('❌ Error creando incidentes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createSampleIncidents();
