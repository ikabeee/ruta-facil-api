import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function verifyData() {
    console.log('🔍 Verificando datos de la base de datos...\n');

    // Verificar usuarios por rol
    const userCounts = await Promise.all([
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.user.count({ where: { role: 'DRIVER' } }),
        prisma.user.count({ where: { role: 'OWNER_VEHICLE' } })
    ]);

    console.log('📊 Usuarios por rol:');
    console.log(`   👨‍💼 Administradores: ${userCounts[0]}`);
    console.log(`   👤 Usuarios: ${userCounts[1]}`);
    console.log(`   🚗 Conductores: ${userCounts[2]}`);
    console.log(`   🏢 Propietarios: ${userCounts[3]}\n`);

    // Verificar conductores con sus campos específicos
    const drivers = await prisma.user.findMany({
        where: { role: 'DRIVER' },
        select: {
            name: true,
            lastName: true,
            license: true,
            driverRating: true,
            totalTrips: true,
            isDriverVerified: true
        }
    });

    console.log('🚗 Conductores registrados:');
    drivers.forEach(driver => {
        console.log(`   • ${driver.name} ${driver.lastName}`);
        console.log(`     Licencia: ${driver.license}`);
        console.log(`     Rating: ${driver.driverRating}/5.0`);
        console.log(`     Viajes: ${driver.totalTrips}`);
        console.log(`     Verificado: ${driver.isDriverVerified ? '✅' : '❌'}`);
        console.log('');
    });

    // Verificar propietarios con sus vehículos
    const owners = await prisma.user.findMany({
        where: { role: 'OWNER_VEHICLE' },
        select: {
            name: true,
            lastName: true,
            company: true,
            totalVehicles: true,
            isOwnerVerified: true,
            vehicles: {
                select: {
                    name: true,
                    plate: true,
                    model: true,
                    passengers: true
                }
            }
        }
    });

    console.log('🏢 Propietarios registrados:');
    owners.forEach(owner => {
        console.log(`   • ${owner.name} ${owner.lastName}`);
        console.log(`     Empresa: ${owner.company}`);
        console.log(`     Total vehículos: ${owner.totalVehicles}`);
        console.log(`     Verificado: ${owner.isOwnerVerified ? '✅' : '❌'}`);
        console.log('     Vehículos:');
        owner.vehicles.forEach(vehicle => {
            console.log(`       - ${vehicle.name} (${vehicle.plate}) - ${vehicle.model} - ${vehicle.passengers} pasajeros`);
        });
        console.log('');
    });

    // Verificar relaciones vehículo-conductor
    const vehicleAssignments = await prisma.vehicleAssignment.findMany({
        include: {
            vehicle: { select: { name: true, plate: true } },
            driver: { select: { name: true, lastName: true } },
            route: { select: { name: true, code: true } }
        }
    });

    console.log('🔗 Asignaciones vehículo-conductor:');
    vehicleAssignments.forEach(assignment => {
        console.log(`   • ${assignment.vehicle.name} (${assignment.vehicle.plate})`);
        console.log(`     Conductor: ${assignment.driver.name} ${assignment.driver.lastName}`);
        console.log(`     Ruta: ${assignment.route.name} (${assignment.route.code})`);
        console.log('');
    });

    // Estadísticas generales
    const stats = await Promise.all([
        prisma.user.count(),
        prisma.vehicle.count(),
        prisma.route.count(),
        prisma.stop.count(),
        prisma.rating.count(),
        prisma.notification.count()
    ]);

    console.log('📈 Estadísticas generales:');
    console.log(`   Total usuarios: ${stats[0]}`);
    console.log(`   Total vehículos: ${stats[1]}`);
    console.log(`   Total rutas: ${stats[2]}`);
    console.log(`   Total paradas: ${stats[3]}`);
    console.log(`   Total ratings: ${stats[4]}`);
    console.log(`   Total notificaciones: ${stats[5]}`);

    console.log('\n✅ Verificación completada exitosamente');
}

verifyData()
    .catch((e) => {
        console.error('❌ Error durante la verificación:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
