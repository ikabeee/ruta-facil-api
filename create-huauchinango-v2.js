const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

// Coordenadas de Huauchinango, Puebla
const HUAUCHINANGO_CENTER = {
    latitude: 20.1743,
    longitude: -98.0474
};

// Paradas principales de Huauchinango basadas en ubicaciones reales
const STOPS_DATA = [
    // Centro de la ciudad
    { name: "Plaza Principal", lat: 20.1743, lng: -98.0474, address: "Centro Histórico" },
    { name: "Palacio Municipal", lat: 20.1748, lng: -98.0469, address: "Av. Juárez" },
    { name: "Mercado Municipal", lat: 20.1738, lng: -98.0481, address: "Calle Hidalgo" },
    { name: "Iglesia Principal", lat: 20.1751, lng: -98.0472, address: "Plaza de Armas" },
    
    // Zona norte
    { name: "Terminal de Autobuses", lat: 20.1789, lng: -98.0445, address: "Carretera Federal" },
    { name: "IMSS Huauchinango", lat: 20.1776, lng: -98.0458, address: "Av. Revolución" },
    { name: "Preparatoria Regional", lat: 20.1763, lng: -98.0433, address: "Col. Centro" },
    { name: "Hospital General", lat: 20.1781, lng: -98.0472, address: "Av. Benito Juárez Norte" },
    
    // Zona sur
    { name: "Estadio Municipal", lat: 20.1699, lng: -98.0489, address: "Col. Deportiva" },
    { name: "Secundaria Técnica", lat: 20.1715, lng: -98.0495, address: "Av. Independencia" },
    { name: "Centro de Salud", lat: 20.1708, lng: -98.0467, address: "Calle Morelos" },
    { name: "Panteón Municipal", lat: 20.1687, lng: -98.0523, address: "Periférico Sur" },
    
    // Zona este
    { name: "Escuela Primaria Benito Juárez", lat: 20.1732, lng: -98.0421, address: "Col. Emiliano Zapata" },
    { name: "Jardín de Niños", lat: 20.1754, lng: -98.0398, address: "Calle Allende" },
    { name: "Tianguis Municipal", lat: 20.1719, lng: -98.0407, address: "Av. 5 de Mayo" },
    
    // Zona oeste
    { name: "Cementerio Viejo", lat: 20.1728, lng: -98.0531, address: "Calle Reforma" },
    { name: "Parque Recreativo", lat: 20.1765, lng: -98.0512, address: "Col. Benito Juárez" },
    { name: "Gasolinera Pemex", lat: 20.1741, lng: -98.0518, address: "Carretera a Tlaola" },
    
    // Colonias periféricas
    { name: "Col. Revolución", lat: 20.1812, lng: -98.0423, address: "Entrada Norte" },
    { name: "Col. Lázaro Cárdenas", lat: 20.1679, lng: -98.0556, address: "Periférico Oeste" },
    { name: "Col. Emiliano Zapata", lat: 20.1695, lng: -98.0398, address: "Zona Este" },
    { name: "Fraccionamiento Las Flores", lat: 20.1664, lng: -98.0445, address: "Salida a Zacatlán" }
];

// Rutas principales de Huauchinango
const ROUTES_DATA = [
    {
        name: "Ruta Centro-Norte",
        code: "HUA-01",
        firstPoint: "Plaza Principal",
        lastPoint: "Terminal de Autobuses",
        description: "Conecta el centro histórico con la terminal y zona norte",
        operatingHours: "05:00 - 22:00",
        estimatedTime: 25,
        distance: 3.2,
        dailyTrips: 48,
        color: "#3B82F6", // Azul
        stops: [
            "Plaza Principal",
            "Palacio Municipal",
            "Iglesia Principal",
            "Preparatoria Regional",
            "IMSS Huauchinango",
            "Hospital General",
            "Terminal de Autobuses"
        ]
    },
    {
        name: "Ruta Centro-Sur",
        code: "HUA-02", 
        firstPoint: "Plaza Principal",
        lastPoint: "Col. Lázaro Cárdenas",
        description: "Recorre el centro hacia las colonias del sur",
        operatingHours: "05:30 - 21:30",
        estimatedTime: 30,
        distance: 4.1,
        dailyTrips: 36,
        color: "#EF4444", // Rojo
        stops: [
            "Plaza Principal",
            "Mercado Municipal",
            "Centro de Salud",
            "Secundaria Técnica",
            "Estadio Municipal",
            "Panteón Municipal",
            "Col. Lázaro Cárdenas"
        ]
    },
    {
        name: "Ruta Centro-Este",
        code: "HUA-03",
        firstPoint: "Plaza Principal", 
        lastPoint: "Col. Emiliano Zapata",
        description: "Conecta el centro con la zona este y tianguis",
        operatingHours: "06:00 - 21:00",
        estimatedTime: 20,
        distance: 2.8,
        dailyTrips: 42,
        color: "#10B981", // Verde
        stops: [
            "Plaza Principal",
            "Iglesia Principal",
            "Jardín de Niños",
            "Escuela Primaria Benito Juárez",
            "Tianguis Municipal",
            "Col. Emiliano Zapata"
        ]
    },
    {
        name: "Ruta Circular",
        code: "HUA-04",
        firstPoint: "Plaza Principal",
        lastPoint: "Plaza Principal", 
        description: "Ruta circular que recorre toda la ciudad",
        operatingHours: "05:00 - 23:00",
        estimatedTime: 45,
        distance: 8.5,
        dailyTrips: 24,
        color: "#F59E0B", // Amarillo
        stops: [
            "Plaza Principal",
            "Terminal de Autobuses",
            "Col. Revolución",
            "Hospital General",
            "Parque Recreativo",
            "Gasolinera Pemex",
            "Cementerio Viejo",
            "Col. Lázaro Cárdenas",
            "Estadio Municipal",
            "Fraccionamiento Las Flores",
            "Col. Emiliano Zapata",
            "Tianguis Municipal",
            "Mercado Municipal",
            "Plaza Principal"
        ]
    }
];

async function createHuauchinangoData() {
    try {
        console.log('🏗️ Creando datos geográficos de Huauchinango, Puebla...');
        
        // 1. Limpiar datos existentes
        console.log('🧹 Limpiando datos existentes...');
        await prisma.incident.deleteMany(); // Eliminar incidentes primero
        await prisma.starredRoute.deleteMany(); // Eliminar rutas favoritas
        await prisma.routeStop.deleteMany();
        await prisma.stop.deleteMany();
        await prisma.route.deleteMany();
        
        // 2. Crear paradas
        console.log('📍 Creando paradas...');
        const createdStops = {};
        
        for (const stopData of STOPS_DATA) {
            const stop = await prisma.stop.create({
                data: {
                    name: stopData.name,
                    address: stopData.address,
                    lat: stopData.lat,
                    lng: stopData.lng,
                    facilities: "Bancas, Techado",
                    accessibility: "Acceso para silla de ruedas",
                    status: "ACTIVE"
                }
            });
            createdStops[stopData.name] = stop;
            console.log(`   ✅ Parada creada: ${stop.name}`);
        }
        
        // 3. Crear rutas
        console.log('🚌 Creando rutas...');
        
        for (const routeData of ROUTES_DATA) {
            const route = await prisma.route.create({
                data: {
                    name: routeData.name,
                    code: routeData.code,
                    firstPoint: routeData.firstPoint,
                    lastPoint: routeData.lastPoint,
                    description: routeData.description,
                    operatingHours: routeData.operatingHours,
                    estimatedTime: routeData.estimatedTime,
                    distance: routeData.distance,
                    dailyTrips: routeData.dailyTrips,
                    status: "ACTIVE",
                    totalStops: routeData.stops.length,
                    assignedUnits: Math.floor(Math.random() * 5) + 2 // 2-6 unidades
                }
            });
            
            console.log(`   ✅ Ruta creada: ${route.name} (${route.code})`);
            
            // 4. Crear RouteStops (paradas de la ruta)
            console.log(`   📌 Asignando paradas a ${route.name}...`);
            
            for (let i = 0; i < routeData.stops.length; i++) {
                const stopName = routeData.stops[i];
                const stop = createdStops[stopName];
                
                if (stop) {
                    await prisma.routeStop.create({
                        data: {
                            routeId: route.id,
                            stopId: stop.id,
                            order: i + 1
                        }
                    });
                    console.log(`      ✅ Parada ${i + 1}: ${stopName}`);
                } else {
                    console.log(`      ❌ Parada no encontrada: ${stopName}`);
                }
            }
        }
        
        // 5. Mostrar resumen
        const totalStops = await prisma.stop.count();
        const totalRoutes = await prisma.route.count();
        const totalRouteStops = await prisma.routeStop.count();
        
        console.log('\n🎉 ¡Datos de Huauchinango creados exitosamente!');
        console.log('📊 Resumen:');
        console.log(`   📍 Paradas creadas: ${totalStops}`);
        console.log(`   🚌 Rutas creadas: ${totalRoutes}`);
        console.log(`   📌 Asignaciones ruta-parada: ${totalRouteStops}`);
        
        // 6. Mostrar ubicación geográfica
        console.log('\n🗺️ Ubicación geográfica:');
        console.log(`   📍 Centro de Huauchinango: ${HUAUCHINANGO_CENTER.latitude}, ${HUAUCHINANGO_CENTER.longitude}`);
        console.log('   🌎 Noroeste de Puebla, México');
        console.log('   🔗 Colinda con: Xicotepec, Juan Galindo, Ahuazotepec, Zacatlán, Tlaola, Naupan e Hidalgo');
        
        // 7. Crear algunas ubicaciones de vehículos en tiempo real
        console.log('\n🚐 Simulando ubicaciones iniciales de vehículos...');
        const routes = await prisma.route.findMany();
        
        for (const route of routes) {
            const routeStops = await prisma.routeStop.findMany({
                where: { routeId: route.id },
                include: { stop: true },
                orderBy: { order: 'asc' }
            });
            
            if (routeStops.length > 0) {
                // Simular 2-3 vehículos por ruta en posiciones aleatorias
                const vehicleCount = Math.floor(Math.random() * 2) + 2; // 2-3 vehículos
                
                for (let v = 0; v < vehicleCount; v++) {
                    const randomStopIndex = Math.floor(Math.random() * routeStops.length);
                    const stop = routeStops[randomStopIndex].stop;
                    
                    // Añadir pequeña variación a la ubicación para simular movimiento
                    const lat = stop.lat + (Math.random() - 0.5) * 0.001; // ±50 metros aprox
                    const lng = stop.lng + (Math.random() - 0.5) * 0.001;
                    
                    console.log(`   🚐 Vehículo ${v + 1} de ${route.code}: cerca de ${stop.name}`);
                    console.log(`       📍 Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error creando datos de Huauchinango:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createHuauchinangoData();
