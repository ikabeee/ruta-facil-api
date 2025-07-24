import { PrismaClient, UserRole, UserStatus } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed con las nuevas relaciones...');

    // Limpiar datos existentes
    await prisma.vehicleAssignment.deleteMany();
    await prisma.vehicleLocation.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.starredRoute.deleteMany();
    await prisma.incident.deleteMany();
    await prisma.routeStop.deleteMany();
    await prisma.schedule.deleteMany();
    await prisma.route.deleteMany();
    await prisma.stop.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Datos existentes eliminados');

    // Generar hashes de contraseñas
    console.log('🔐 Generando hashes de contraseñas...');
    const adminPassword = await bcrypt.hash('admin123', 10); // Contraseña: admin123
    const userPassword = await bcrypt.hash('user123', 10);   // Contraseña: user123
    
    console.log('✅ Contraseñas hasheadas correctamente');

    // Crear usuarios admin
    const admin = await prisma.user.create({
        data: {
            name: 'Administrador',
            lastName: 'Sistema',
            email: 'carlglz30@gmail.com',
            password: adminPassword,
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            phone: '+52 123 456 7890'
        }
    });

    // Crear usuarios regulares
    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Juan Carlos',
                lastName: 'Pérez García',
                email: 'juan.perez@email.com',
                password: userPassword,
                role: UserRole.USER,
                status: UserStatus.ACTIVE,
                emailVerified: true,
                phone: '+52 123 456 7891'
            }
        }),
        prisma.user.create({
            data: {
                name: 'María Elena',
                lastName: 'Rodríguez López',
                email: 'maria.rodriguez@email.com',
                password: userPassword,
                role: UserRole.USER,
                status: UserStatus.ACTIVE,
                emailVerified: true,
                phone: '+52 123 456 7892'
            }
        })
    ]);

    // Crear conductores (usuarios con rol DRIVER y campos específicos)
    const drivers = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Pedro',
                lastName: 'Martínez Sánchez',
                email: 'middle606@gmail.com',
                password: userPassword,
                role: UserRole.OWNER_VEHICLE,
                status: UserStatus.ACTIVE,
                emailVerified: true,
                phone: '+52 123 456 7893',
                // Campos específicos de conductor
                license: 'CDMX-12345678',
                licenseExpiration: new Date('2026-12-31'),
                driverExperience: '5 años',
                driverRating: 4.8,
                totalTrips: 156,
                isDriverVerified: true
            }
        }),
        prisma.user.create({
            data: {
                name: 'Ana',
                lastName: 'González Fernández',
                email: 'ana.gonzalez@email.com',
                password: userPassword,
                role: UserRole.DRIVER,
                status: UserStatus.ACTIVE,
                emailVerified: true,
                phone: '+52 123 456 7894',
                // Campos específicos de conductor
                license: 'CDMX-87654321',
                licenseExpiration: new Date('2025-06-30'),
                driverExperience: '3 años',
                driverRating: 4.5,
                totalTrips: 89,
                isDriverVerified: true
            }
        }),
        prisma.user.create({
            data: {
                name: 'Carlos',
                lastName: 'Ramírez Morales',
                email: 'carlos.ramirez@email.com',
                password: userPassword,
                role: UserRole.DRIVER,
                status: UserStatus.ACTIVE,
                emailVerified: true,
                phone: '+52 123 456 7895',
                // Campos específicos de conductor
                license: 'CDMX-11223344',
                licenseExpiration: new Date('2027-03-15'),
                driverExperience: '8 años',
                driverRating: 4.9,
                totalTrips: 234,
                isDriverVerified: true
            }
        })
    ]);

    // Crear propietarios de vehículos (usuarios con rol OWNER_VEHICLE y campos específicos)
    const owners = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Roberto',
                lastName: 'Hernández Silva',
                email: 'roberto.hernandez@email.com',
                password: userPassword,
                role: UserRole.OWNER_VEHICLE,
                status: UserStatus.ACTIVE,
                emailVerified: true,
                phone: '+52 123 456 7896',
                // Campos específicos de propietario
                company: 'Transportes Hernández S.A. de C.V.',
                contact: 'roberto.hernandez@transporteshernandez.com',
                rfc: 'THE850101ABC',
                address: 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX',
                totalVehicles: 5,
                lastPayment: new Date('2025-01-15'),
                isOwnerVerified: true
            }
        }),
        prisma.user.create({
            data: {
                name: 'Laura',
                lastName: 'Jiménez Vargas',
                email: 'laura.jimenez@email.com',
                password: userPassword,
                role: UserRole.OWNER_VEHICLE,
                status: UserStatus.ACTIVE,
                emailVerified: true,
                phone: '+52 123 456 7897',
                // Campos específicos de propietario
                company: 'Flota Jiménez Ltda.',
                contact: 'laura@flotajimenez.mx',
                rfc: 'FJL920301XYZ',
                address: 'Calle Reforma 567, Col. Centro, CDMX',
                totalVehicles: 3,
                lastPayment: new Date('2025-01-10'),
                isOwnerVerified: true
            }
        })
    ]);

    // Crear vehículos asociados a los propietarios
    const vehicles = await Promise.all([
        // Vehículos de Roberto Hernández
        prisma.vehicle.create({
            data: {
                name: 'Autobús Urbano 001',
                plate: 'ABC-1234',
                model: 'Mercedes-Benz Citaro',
                color: 'Azul',
                year: 2022,
                passengers: 50,
                fuel: 85.5,
                mileage: 45000,
                nextMaintenance: new Date('2025-02-15'),
                ownerId: owners[0].id
            }
        }),
        prisma.vehicle.create({
            data: {
                name: 'Autobús Urbano 002',
                plate: 'ABC-5678',
                model: 'Volvo 7900',
                color: 'Rojo',
                year: 2021,
                passengers: 45,
                fuel: 92.0,
                mileage: 52000,
                nextMaintenance: new Date('2025-03-01'),
                ownerId: owners[0].id
            }
        }),
        prisma.vehicle.create({
            data: {
                name: 'Microbus Express 001',
                plate: 'DEF-9876',
                model: 'Ford Transit',
                color: 'Blanco',
                year: 2023,
                passengers: 20,
                fuel: 78.3,
                mileage: 15000,
                nextMaintenance: new Date('2025-02-28'),
                ownerId: owners[0].id
            }
        }),
        // Vehículos de Laura Jiménez
        prisma.vehicle.create({
            data: {
                name: 'Van Ejecutiva 001',
                plate: 'GHI-1357',
                model: 'Mercedes Sprinter',
                color: 'Negro',
                year: 2023,
                passengers: 15,
                fuel: 65.7,
                mileage: 8000,
                nextMaintenance: new Date('2025-04-15'),
                ownerId: owners[1].id
            }
        }),
        prisma.vehicle.create({
            data: {
                name: 'Minibús Turístico 001',
                plate: 'JKL-2468',
                model: 'Iveco Daily',
                color: 'Verde',
                year: 2022,
                passengers: 25,
                fuel: 88.9,
                mileage: 32000,
                nextMaintenance: new Date('2025-03-20'),
                ownerId: owners[1].id
            }
        })
    ]);

    // Crear paradas
    const stops = await Promise.all([
        prisma.stop.create({
            data: {
                name: 'Terminal Central',
                address: 'Av. Central 123, Col. Centro',
                lat: 19.4326,
                lng: -99.1332,
                facilities: 'Baños, Cafetería, Wifi',
                accessibility: 'Acceso para sillas de ruedas'
            }
        }),
        prisma.stop.create({
            data: {
                name: 'Plaza Comercial Norte',
                address: 'Blvd. Norte 456, Col. Norte',
                lat: 19.4500,
                lng: -99.1400,
                facilities: 'Tienda, Estacionamiento',
                accessibility: 'Rampa de acceso'
            }
        }),
        prisma.stop.create({
            data: {
                name: 'Universidad Metropolitana',
                address: 'Ciudad Universitaria, Col. Copilco',
                lat: 19.3200,
                lng: -99.1800,
                facilities: 'Biblioteca, Cafetería estudiantil',
                accessibility: 'Totalmente accesible'
            }
        }),
        prisma.stop.create({
            data: {
                name: 'Hospital General',
                address: 'Av. Salud 789, Col. Médica',
                lat: 19.4100,
                lng: -99.1500,
                facilities: 'Farmacia, Cafetería',
                accessibility: 'Acceso prioritario'
            }
        })
    ]);

    // Crear rutas
    const routes = await Promise.all([
        prisma.route.create({
            data: {
                code: 'RUT-001',
                name: 'Centro - Norte',
                firstPoint: 'Terminal Central',
                lastPoint: 'Plaza Comercial Norte',
                description: 'Ruta principal que conecta el centro con la zona norte',
                distance: 15.5,
                estimatedTime: 45,
                totalStops: 8,
                assignedUnits: 3,
                dailyTrips: 24,
                operatingHours: '05:00 - 23:00',
                vehicleId: vehicles[0].id
            }
        }),
        prisma.route.create({
            data: {
                code: 'RUT-002',
                name: 'Universidad - Hospital',
                firstPoint: 'Universidad Metropolitana',
                lastPoint: 'Hospital General',
                description: 'Ruta especial para estudiantes y personal médico',
                distance: 12.3,
                estimatedTime: 35,
                totalStops: 6,
                assignedUnits: 2,
                dailyTrips: 18,
                operatingHours: '06:00 - 22:00',
                vehicleId: vehicles[1].id
            }
        }),
        prisma.route.create({
            data: {
                code: 'RUT-003',
                name: 'Circuito Urbano',
                firstPoint: 'Terminal Central',
                lastPoint: 'Terminal Central',
                description: 'Ruta circular que conecta los principales puntos de la ciudad',
                distance: 25.8,
                estimatedTime: 90,
                totalStops: 12,
                assignedUnits: 4,
                dailyTrips: 16,
                operatingHours: '05:30 - 23:30',
                vehicleId: vehicles[2].id
            }
        })
    ]);

    // Crear relaciones entre rutas y paradas
    await Promise.all([
        // Ruta Centro - Norte
        prisma.routeStop.create({
            data: {
                routeId: routes[0].id,
                stopId: stops[0].id,
                order: 1
            }
        }),
        prisma.routeStop.create({
            data: {
                routeId: routes[0].id,
                stopId: stops[1].id,
                order: 2
            }
        }),
        // Ruta Universidad - Hospital
        prisma.routeStop.create({
            data: {
                routeId: routes[1].id,
                stopId: stops[2].id,
                order: 1
            }
        }),
        prisma.routeStop.create({
            data: {
                routeId: routes[1].id,
                stopId: stops[3].id,
                order: 2
            }
        }),
        // Ruta Circuito Urbano (incluye todas las paradas)
        ...stops.map((stop, index) => 
            prisma.routeStop.create({
                data: {
                    routeId: routes[2].id,
                    stopId: stop.id,
                    order: index + 1
                }
            })
        )
    ]);

    // Crear asignaciones de vehículos a conductores
    await Promise.all([
        prisma.vehicleAssignment.create({
            data: {
                vehicleId: vehicles[0].id,
                routeId: routes[0].id,
                driverId: drivers[0].id,
                startTime: new Date('2025-01-23T05:00:00Z'),
                endTime: new Date('2025-01-23T13:00:00Z')
            }
        }),
        prisma.vehicleAssignment.create({
            data: {
                vehicleId: vehicles[1].id,
                routeId: routes[1].id,
                driverId: drivers[1].id,
                startTime: new Date('2025-01-23T06:00:00Z'),
                endTime: new Date('2025-01-23T14:00:00Z')
            }
        }),
        prisma.vehicleAssignment.create({
            data: {
                vehicleId: vehicles[2].id,
                routeId: routes[2].id,
                driverId: drivers[2].id,
                startTime: new Date('2025-01-23T05:30:00Z'),
                endTime: new Date('2025-01-23T15:30:00Z')
            }
        })
    ]);

    // Crear algunos ratings
    await Promise.all([
        prisma.rating.create({
            data: {
                title: 'Excelente servicio',
                description: 'El conductor fue muy amable y el viaje fue cómodo',
                rating: 5.0,
                comment: 'Recomiendo esta ruta',
                userType: 'Pasajero regular',
                service: 'Transporte urbano',
                route: 'Centro - Norte',
                driver: 'Pedro Martínez',
                unit: 'ABC-1234',
                userId: users[0].id,
                vehicleId: vehicles[0].id
            }
        }),
        prisma.rating.create({
            data: {
                title: 'Buen servicio',
                description: 'Puntual y seguro',
                rating: 4.5,
                comment: 'Muy buena experiencia',
                userType: 'Estudiante',
                service: 'Transporte estudiantil',
                route: 'Universidad - Hospital',
                driver: 'Ana González',
                unit: 'ABC-5678',
                userId: users[1].id,
                vehicleId: vehicles[1].id
            }
        })
    ]);

    // Crear notificaciones
    await Promise.all([
        prisma.notification.create({
            data: {
                title: 'Bienvenido al Sistema',
                message: 'Gracias por registrarte en RutaFácil',
                userId: users[0].id
            }
        }),
        prisma.notification.create({
            data: {
                title: 'Mantenimiento Programado',
                message: 'Su vehículo tiene mantenimiento programado para el 15 de febrero',
                userId: owners[0].id
            }
        }),
        prisma.notification.create({
            data: {
                title: 'Asignación de Ruta',
                message: 'Ha sido asignado a la ruta Centro - Norte para mañana',
                userId: drivers[0].id
            }
        })
    ]);

    console.log('✅ Seed completado exitosamente');
    console.log(`👤 Usuarios creados: ${1 + users.length + drivers.length + owners.length}`);
    console.log(`🚗 Vehículos creados: ${vehicles.length}`);
    console.log(`🛣️  Rutas creadas: ${routes.length}`);
    console.log(`📍 Paradas creadas: ${stops.length}`);
    console.log(`📊 Ratings creados: 2`);
    console.log(`📢 Notificaciones creadas: 3`);
    console.log('');
    console.log('👨‍💼 Credenciales de administrador:');
    console.log('   Email: admin@rutafacil.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('👥 Credenciales de usuarios de prueba:');
    console.log('   Usuarios: user123');
    console.log('   Conductores: user123');
    console.log('   Propietarios: user123');
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
