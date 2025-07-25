const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function createHuauchinangoPueblaData() {
    try {
        console.log('🏙️ Creando datos de Huauchinango, Puebla...');

        // Coordenadas centrales de Huauchinango, Puebla
        // Latitud: 20°10'48"N, Longitud: 98°03'00"W
        const centerLat = 20.18;
        const centerLng = -98.05;

        // Crear paradas principales de Huauchinango
        const stops = [
            {
                name: 'Terminal de Autobuses ADO',
                address: 'Av. Benito Juárez s/n, Centro, Huauchinango',
                lat: 20.1800,
                lng: -98.0520,
                facilities: 'Terminal principal, baños, tienda, sala de espera',
                accessibility: 'Acceso para sillas de ruedas'
            },
            {
                name: 'Zócalo de Huauchinango',
                address: 'Plaza Principal, Centro, Huauchinango',
                lat: 20.1780,
                lng: -98.0500,
                facilities: 'Plaza principal, comercios, restaurantes',
                accessibility: 'Completamente accesible'
            },
            {
                name: 'Mercado Municipal',
                address: 'Calle Aldama, Centro, Huauchinango',
                lat: 20.1770,
                lng: -98.0510,
                facilities: 'Mercado tradicional, comida típica',
                accessibility: 'Acceso limitado'
            },
            {
                name: 'Hospital General',
                address: 'Av. México Norte, Col. Centro, Huauchinango',
                lat: 20.1820,
                lng: -98.0480,
                facilities: 'Hospital, urgencias, farmacia',
                accessibility: 'Acceso completo para discapacitados'
            },
            {
                name: 'Preparatoria Benito Juárez',
                address: 'Av. Revolución, Col. Centro, Huauchinango',
                lat: 20.1760,
                lng: -98.0530,
                facilities: 'Escuela preparatoria, canchas deportivas',
                accessibility: 'Acceso para sillas de ruedas'
            },
            {
                name: 'Universidad Tecnológica',
                address: 'Carretera Huauchinango-Tulancingo Km 2, Huauchinango',
                lat: 20.1650,
                lng: -98.0400,
                facilities: 'Universidad, biblioteca, cafetería',
                accessibility: 'Completamente accesible'
            },
            {
                name: 'Parque Ecológico',
                address: 'Av. Adolfo López Mateos, Col. El Parque, Huauchinango',
                lat: 20.1850,
                lng: -98.0460,
                facilities: 'Parque, áreas verdes, juegos infantiles',
                accessibility: 'Senderos accesibles'
            },
            {
                name: 'Centro Comercial Plaza Norte',
                address: 'Carretera Federal México-Tuxpan Km 165, Huauchinango',
                lat: 20.1900,
                lng: -98.0420,
                facilities: 'Centro comercial, cines, restaurantes',
                accessibility: 'Completamente accesible'
            },
            {
                name: 'Cementerio Municipal',
                address: 'Av. Revolución s/n, Col. El Calvario, Huauchinango',
                lat: 20.1720,
                lng: -98.0580,
                facilities: 'Cementerio municipal, capilla',
                accessibility: 'Acceso parcial'
            },
            {
                name: 'Estadio Municipal',
                address: 'Av. Deportiva, Col. El Deportivo, Huauchinango',
                lat: 20.1690,
                lng: -98.0450,
                facilities: 'Estadio de fútbol, pista de atletismo',
                accessibility: 'Acceso para sillas de ruedas'
            },
            {
                name: 'Cascadas de Huauchinango',
                address: 'Carretera a San Pedro Xicotepec, Huauchinango',
                lat: 20.1950,
                lng: -98.0350,
                facilities: 'Área natural, cascadas, restaurantes',
                accessibility: 'Senderos naturales'
            },
            {
                name: 'Iglesia de San Francisco',
                address: 'Calle Hidalgo, Centro, Huauchinango',
                lat: 20.1785,
                lng: -98.0495,
                facilities: 'Iglesia histórica, plaza atrial',
                accessibility: 'Acceso parcial'
            },
            {
                name: 'Panteón Jardín',
                address: 'Av. Benito Juárez Norte, Col. El Jardín, Huauchinango',
                lat: 20.1830,
                lng: -98.0380,
                facilities: 'Cementerio moderno, capilla, jardines',
                accessibility: 'Completamente accesible'
            },
            {
                name: 'Mirador del Valle',
                address: 'Cerro de la Cruz, Col. El Mirador, Huauchinango',
                lat: 20.1920,
                lng: -98.0480,
                facilities: 'Mirador panorámico, área de descanso',
                accessibility: 'Acceso vehicular limitado'
            },
            {
                name: 'Central de Abastos',
                address: 'Carretera a Tulancingo Km 1, Huauchinango',
                lat: 20.1700,
                lng: -98.0520,
                facilities: 'Mercado mayorista, bodegas',
                accessibility: 'Acceso para carga'
            }
        ];

        // Insertar las paradas
        const createdStops = [];
        for (const stop of stops) {
            const createdStop = await prisma.stop.create({
                data: {
                    ...stop,
                    status: 'ACTIVE'
                }
            });
            createdStops.push(createdStop);
            console.log(`✅ Parada creada: ${createdStop.name}`);
        }

        // Crear rutas principales de Huauchinango
        const routes = [
            {
                code: 'HUA-001',
                name: 'Ruta Centro-Universidad',
                firstPoint: 'Terminal ADO',
                lastPoint: 'Universidad Tecnológica',
                description: 'Conecta el centro de la ciudad con la zona universitaria',
                distance: 4.5,
                estimatedTime: 25,
                operatingHours: '05:30 - 22:00',
                status: 'ACTIVE'
            },
            {
                code: 'HUA-002', 
                name: 'Ruta Circuito Norte',
                firstPoint: 'Terminal ADO',
                lastPoint: 'Plaza Norte',
                description: 'Recorre la zona norte de la ciudad incluyendo hospital y centros comerciales',
                distance: 6.2,
                estimatedTime: 35,
                operatingHours: '06:00 - 21:30',
                status: 'ACTIVE'
            },
            {
                code: 'HUA-003',
                name: 'Ruta Turística',
                firstPoint: 'Zócalo',
                lastPoint: 'Cascadas de Huauchinango',
                description: 'Ruta especial para turistas que visita los principales atractivos',
                distance: 8.0,
                estimatedTime: 45,
                operatingHours: '08:00 - 18:00',
                status: 'ACTIVE'
            }
        ];

        // Insertar las rutas
        const createdRoutes = [];
        for (const route of routes) {
            const createdRoute = await prisma.route.create({
                data: route
            });
            createdRoutes.push(createdRoute);
            console.log(`✅ Ruta creada: ${createdRoute.name}`);
        }

        // Asignar paradas a las rutas
        const routeStopsAssignments = [
            // Ruta Centro-Universidad (HUA-001)
            { routeId: createdRoutes[0].id, stopId: createdStops[0].id, order: 1 }, // Terminal ADO
            { routeId: createdRoutes[0].id, stopId: createdStops[1].id, order: 2 }, // Zócalo
            { routeId: createdRoutes[0].id, stopId: createdStops[2].id, order: 3 }, // Mercado
            { routeId: createdRoutes[0].id, stopId: createdStops[4].id, order: 4 }, // Preparatoria
            { routeId: createdRoutes[0].id, stopId: createdStops[9].id, order: 5 }, // Estadio
            { routeId: createdRoutes[0].id, stopId: createdStops[5].id, order: 6 }, // Universidad

            // Ruta Circuito Norte (HUA-002)
            { routeId: createdRoutes[1].id, stopId: createdStops[0].id, order: 1 }, // Terminal ADO
            { routeId: createdRoutes[1].id, stopId: createdStops[3].id, order: 2 }, // Hospital
            { routeId: createdRoutes[1].id, stopId: createdStops[6].id, order: 3 }, // Parque Ecológico
            { routeId: createdRoutes[1].id, stopId: createdStops[13].id, order: 4 }, // Mirador
            { routeId: createdRoutes[1].id, stopId: createdStops[7].id, order: 5 }, // Plaza Norte
            { routeId: createdRoutes[1].id, stopId: createdStops[12].id, order: 6 }, // Panteón Jardín

            // Ruta Turística (HUA-003)
            { routeId: createdRoutes[2].id, stopId: createdStops[1].id, order: 1 }, // Zócalo
            { routeId: createdRoutes[2].id, stopId: createdStops[11].id, order: 2 }, // Iglesia San Francisco
            { routeId: createdRoutes[2].id, stopId: createdStops[6].id, order: 3 }, // Parque Ecológico
            { routeId: createdRoutes[2].id, stopId: createdStops[13].id, order: 4 }, // Mirador
            { routeId: createdRoutes[2].id, stopId: createdStops[10].id, order: 5 }, // Cascadas
        ];

        // Insertar asignaciones de paradas
        for (const assignment of routeStopsAssignments) {
            await prisma.routeStop.create({
                data: assignment
            });
        }

        console.log('🎉 ¡Datos de Huauchinango, Puebla creados exitosamente!');

        // Mostrar estadísticas
        const totalStops = await prisma.stop.count();
        const totalRoutes = await prisma.route.count();
        const totalRouteStops = await prisma.routeStop.count();

        console.log('\n📊 Estadísticas de Huauchinango:');
        console.log(`   🚏 Paradas totales: ${totalStops}`);
        console.log(`   🚌 Rutas totales: ${totalRoutes}`);
        console.log(`   🔗 Asignaciones parada-ruta: ${totalRouteStops}`);

        console.log('\n🗺️ Rutas creadas:');
        for (const route of createdRoutes) {
            const stopCount = routeStopsAssignments.filter(rs => rs.routeId === route.id).length;
            console.log(`   ${route.code}: ${route.name} (${stopCount} paradas)`);
        }

    } catch (error) {
        console.error('❌ Error creando datos de Huauchinango:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createHuauchinangoPueblaData();
