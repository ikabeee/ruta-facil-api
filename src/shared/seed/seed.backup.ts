import { PrismaClient } from '../../../generated/prisma'
import { UserRole, UserStatus, RouteStatus, StopStatus, ScheduleStatus, IncidentStatus, IncidentPriority, RatingStatus } from '../../../generated/prisma'
import * as bcrypt from 'bcrypt'
import { SEED_CONFIG } from './seed.config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  try {
    // Limpiar datos existentes
    await prisma.notification.deleteMany()
    await prisma.vehicleLocation.deleteMany()
    await prisma.vehicleAssignment.deleteMany()
    await prisma.rating.deleteMany()
    await prisma.incident.deleteMany()
    await prisma.schedule.deleteMany()
    await prisma.routeStop.deleteMany()
    await prisma.starredRoute.deleteMany()
    await prisma.stop.deleteMany()
    await prisma.route.deleteMany()
    await prisma.vehicle.deleteMany()
    await prisma.user.deleteMany()

    console.log('🧹 Datos existentes eliminados')

    // Hashear contraseña por defecto
    const hashedPassword = await bcrypt.hash(SEED_CONFIG.DEFAULT_PASSWORD, 10)

    // 1. Crear usuarios (15 registros)
    const users = await prisma.user.createMany({
      data: [
        // Administradores
        {
          name: 'Carlos',
          lastName: 'González',
          email: 'carlglz30@gmail.com',
          password: hashedPassword,
          phone: '+52 55 1234 5678',
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          permissions: ['MANAGE_USERS', 'MANAGE_ROUTES', 'MANAGE_VEHICLES', 'VIEW_REPORTS']
        },
        {
          name: 'Ana',
          lastName: 'Martínez',
          email: 'ana.admin@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 2345 6789',
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          permissions: ['MANAGE_USERS', 'MANAGE_ROUTES', 'VIEW_REPORTS']
        },
        // Propietarios de vehículos
        {
          name: 'Miguel',
          lastName: 'Rodríguez',
          email: 'middle606@gmail.com',
          password: hashedPassword,
          phone: '+52 55 3456 7890',
          role: UserRole.OWNER_VEHICLE,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Laura',
          lastName: 'Hernández',
          email: 'laura.owner@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 4567 8901',
          role: UserRole.OWNER_VEHICLE,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Roberto',
          lastName: 'López',
          email: 'roberto.owner@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 5678 9012',
          role: UserRole.OWNER_VEHICLE,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        // Conductores
        {
          name: 'José',
          lastName: 'García',
          email: 'jose.driver@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 6789 0123',
          role: UserRole.DRIVER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'María',
          lastName: 'Pérez',
          email: 'maria.driver@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 7890 1234',
          role: UserRole.DRIVER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Antonio',
          lastName: 'Sánchez',
          email: 'antonio.driver@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 8901 2345',
          role: UserRole.DRIVER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Carmen',
          lastName: 'Morales',
          email: 'carmen.driver@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 9012 3456',
          role: UserRole.DRIVER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        // Usuarios regulares
        {
          name: 'Pedro',
          lastName: 'Jiménez',
          email: 'pedro.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 0123 4567',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Lucía',
          lastName: 'Torres',
          email: 'lucia.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 1357 2468',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Fernando',
          lastName: 'Ramírez',
          email: 'fernando.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 2468 1357',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Isabella',
          lastName: 'Vargas',
          email: 'isabella.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 3579 4680',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Daniel',
          lastName: 'Castro',
          email: 'daniel.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 4680 3579',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Sofía',
          lastName: 'Mendoza',
          email: 'sofia.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 5791 6802',
          role: UserRole.USER,
          status: UserStatus.PENDING,
          emailVerified: false
        }
      ]
    })

    console.log('👥 Usuarios creados')

    // Obtener IDs de usuarios creados
    const createdUsers = await prisma.user.findMany()
    const adminUsers = createdUsers.filter(u => u.role === UserRole.ADMIN)
    const ownerUsers = createdUsers.filter(u => u.role === UserRole.OWNER_VEHICLE)
    const driverUsers = createdUsers.filter(u => u.role === UserRole.DRIVER)
    const regularUsers = createdUsers.filter(u => u.role === UserRole.USER)

    // 2. Crear propietarios de vehículos (3 registros)
    const ownerVehicles = []
    for (let i = 0; i < ownerUsers.length; i++) {
      const owner = await prisma.ownerVehicle.create({
        data: {
          userId: ownerUsers[i].id,
          company: `Transportes ${ownerUsers[i].name} S.A. de C.V.`,
          contact: ownerUsers[i].phone || '+52 55 0000 0000',
          rfc: `${ownerUsers[i].name.substring(0, 4).toUpperCase()}${(new Date().getFullYear() - 20).toString().substring(2)}${String(Math.floor(Math.random() * 90) + 10)}ABC${Math.floor(Math.random() * 10)}`,
          address: `Av. Principal ${100 + i * 50}, Col. Centro, Ciudad de México`,
          totalVehicles: Math.floor(Math.random() * 5) + 2,
          lastPayment: new Date(2025, 6, Math.floor(Math.random() * 15) + 1),
          isVerified: true
        }
      })
      ownerVehicles.push(owner)
    }

    console.log('🏢 Propietarios de vehículos creados')

    // 3. Crear conductores con datos realistas (4 registros)
    const driverProfiles = [
      {
        license: 'CDL001234567',
        experience: '8 años',
        specialties: 'Transporte urbano, rutas largas',
        rating: 4.8,
        totalTrips: 420,
        emergencyContact: '+52 55 1111 2222'
      },
      {
        license: 'CDL009876543',
        experience: '5 años',
        specialties: 'Transporte escolar, rutas cortas',
        rating: 4.6,
        totalTrips: 320,
        emergencyContact: '+52 55 3333 4444'
      },
      {
        license: 'CDL555666777',
        experience: '12 años',
        specialties: 'Transporte nocturno, rutas express',
        rating: 4.9,
        totalTrips: 680,
        emergencyContact: '+52 55 5555 6666'
      },
      {
        license: 'CDL888999000',
        experience: '3 años',
        specialties: 'Transporte diurno, atención al cliente',
        rating: 4.4,
        totalTrips: 180,
        emergencyContact: '+52 55 7777 8888'
      }
    ]

    const drivers = []
    for (let i = 0; i < driverUsers.length; i++) {
      const profile = driverProfiles[i]
      const licenseExpiration = new Date()
      licenseExpiration.setFullYear(licenseExpiration.getFullYear() + Math.floor(Math.random() * 3) + 1) // 1-3 años en el futuro
      
      const driver = await prisma.driver.create({
        data: {
          userId: driverUsers[i].id,
          license: profile.license,
          licenseExpiration: licenseExpiration,
          experience: profile.experience,
          rating: profile.rating,
          totalTrips: profile.totalTrips,
          isVerified: true
        }
      })
      drivers.push(driver)
    }

    console.log(`🚗 ${drivers.length} conductores creados con relaciones User establecidas`)

    // 4. Crear vehículos (8 registros)
    const vehicleModels = ['Sprinter', 'Transit', 'Master', 'Daily', 'Hiace', 'Urvan', 'H1', 'Ducato']
    const vehicleColors = ['Blanco', 'Azul', 'Rojo', 'Gris', 'Negro', 'Verde', 'Amarillo', 'Plata']
    const vehicles = []

    for (let i = 0; i < 8; i++) {
      const plateNumbers = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
      const plateLetters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                          String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                          String.fromCharCode(65 + Math.floor(Math.random() * 26))
      
      const vehicle = await prisma.vehicle.create({
        data: {
          name: `Unidad ${i + 1}`,
          plate: `${plateNumbers}-${plateLetters}`,
          model: vehicleModels[i],
          color: vehicleColors[i],
          year: 2018 + Math.floor(Math.random() * 7),
          passengers: [15, 20, 25, 30, 35][Math.floor(Math.random() * 5)],
          fuel: Math.round((Math.random() * 40 + 60) * 10) / 10, // Entre 60% y 100%
          mileage: Math.floor(Math.random() * 50000) + 10000,
          nextMaintenance: new Date(2025, 7 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1),
          ownerId: ownerVehicles[Math.floor(Math.random() * ownerVehicles.length)].id,
          ownerVehicleId: ownerVehicles[Math.floor(Math.random() * ownerVehicles.length)].id
        }
      })
      vehicles.push(vehicle)
    }

    console.log('🚌 Vehículos creados')

    // 5. Crear paradas (12 registros)
    const stopLocations = [
      { name: 'Terminal Central', lat: 19.4326, lng: -99.1332, address: 'Av. Central 100, Centro' },
      { name: 'Plaza Universidad', lat: 19.3319, lng: -99.1844, address: 'Ciudad Universitaria s/n' },
      { name: 'Metro Insurgentes', lat: 19.4214, lng: -99.1625, address: 'Av. Insurgentes Sur 421' },
      { name: 'Mercado San Juan', lat: 19.4278, lng: -99.1419, address: 'Calle Ernesto Pugibet 21' },
      { name: 'Hospital General', lat: 19.4119, lng: -99.1519, address: 'Dr. Balmis 148' },
      { name: 'Parque México', lat: 19.4103, lng: -99.1687, address: 'Av. México s/n, Condesa' },
      { name: 'Centro Comercial', lat: 19.3762, lng: -99.1728, address: 'Av. Universidad 1321' },
      { name: 'Estadio Azteca', lat: 19.3030, lng: -99.1506, address: 'Calz. de Tlalpan 3465' },
      { name: 'Aeropuerto CDMX', lat: 19.4363, lng: -99.0721, address: 'Aeropuerto Internacional' },
      { name: 'Basílica de Guadalupe', lat: 19.4847, lng: -99.1175, address: 'Plaza de las Américas 1' },
      { name: 'Xochimilco Centro', lat: 19.2647, lng: -99.1031, address: 'Jardín Juárez s/n' },
      { name: 'Polanco Museo', lat: 19.4260, lng: -99.1915, address: 'Av. Presidente Masaryk 515' }
    ]

    const stops = []
    for (let i = 0; i < stopLocations.length; i++) {
      const stop = await prisma.stop.create({
        data: {
          name: stopLocations[i].name,
          address: stopLocations[i].address,
          lat: stopLocations[i].lat,
          lng: stopLocations[i].lng,
          facilities: ['Bancas', 'Techo', 'Iluminación'][Math.floor(Math.random() * 3)] + ', ' + 
                     ['WiFi', 'Baños', 'Comercios'][Math.floor(Math.random() * 3)],
          accessibility: Math.random() > 0.5 ? 'Accesible para sillas de ruedas' : 'Sin accesibilidad especial',
          status: StopStatus.ACTIVE
        }
      })
      stops.push(stop)
    }

    console.log('🚏 Paradas creadas')

    // 6. Crear rutas (5 registros)
    const routeNames = [
      'Ruta Centro-Universidad',
      'Ruta Norte-Sur',
      'Ruta Periférico Oriente',
      'Ruta Aeropuerto Express',
      'Ruta Turística Colonial'
    ]

    const routes = []
    for (let i = 0; i < routeNames.length; i++) {
      const firstStop = stops[Math.floor(Math.random() * stops.length)]
      const lastStop = stops[Math.floor(Math.random() * stops.length)]
      
      const route = await prisma.route.create({
        data: {
          code: `RT${String(i + 1).padStart(3, '0')}`,
          name: routeNames[i],
          firstPoint: firstStop.name,
          lastPoint: lastStop.name,
          description: `Ruta que conecta ${firstStop.name} con ${lastStop.name} y puntos intermedios`,
          distance: Math.round((Math.random() * 30 + 5) * 10) / 10, // Entre 5 y 35 km
          estimatedTime: Math.floor(Math.random() * 60) + 30, // Entre 30 y 90 minutos
          totalStops: Math.floor(Math.random() * 8) + 4, // Entre 4 y 12 paradas
          assignedUnits: Math.floor(Math.random() * 3) + 1, // Entre 1 y 3 unidades
          dailyTrips: Math.floor(Math.random() * 20) + 10, // Entre 10 y 30 viajes diarios
          operatingHours: '05:00 - 23:00',
          status: RouteStatus.ACTIVE,
          vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)].id
        }
      })
      routes.push(route)
    }

    console.log('🛣️ Rutas creadas')

    // 7. Crear relaciones ruta-parada (15 registros)
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      const routeStops = Math.floor(Math.random() * 4) + 3 // Entre 3 y 6 paradas por ruta
      const usedStops = new Set()
      
      for (let j = 0; j < routeStops; j++) {
        let randomStop
        do {
          randomStop = stops[Math.floor(Math.random() * stops.length)]
        } while (usedStops.has(randomStop.id))
        
        usedStops.add(randomStop.id)
        
        await prisma.routeStop.create({
          data: {
            routeId: route.id,
            stopId: randomStop.id,
            order: j + 1
          }
        })
      }
    }

    console.log('🔗 Relaciones ruta-parada creadas')

    // 8. Crear horarios (10 registros)
    const schedules = []
    for (let i = 0; i < routes.length; i++) {
      // Crear 2 horarios por ruta
      for (let j = 0; j < 2; j++) {
        const startHour = j === 0 ? 6 : 14 // Mañana o tarde
        const endHour = startHour + 8
        
        const schedule = await prisma.schedule.create({
          data: {
            routeId: routes[i].id,
            startTime: `${String(startHour).padStart(2, '0')}:00`,
            endTime: `${String(endHour).padStart(2, '0')}:00`,
            frequency: j === 0 ? '15 minutos' : '20 minutos',
            days: 'Lunes a Domingo',
            totalTrips: Math.floor(Math.random() * 15) + 5,
            status: ScheduleStatus.ACTIVE
          }
        })
        schedules.push(schedule)
      }
    }

    console.log('⏰ Horarios creados')

    // 9. Crear asignaciones de vehículos (6 registros)
    for (let i = 0; i < Math.min(vehicles.length, drivers.length); i++) {
      await prisma.vehicleAssignment.create({
        data: {
          vehicleId: vehicles[i].id,
          routeId: routes[i % routes.length].id,
          driverId: drivers[i].id,
          startTime: new Date(2025, 6, 15, 6, 0),
          endTime: new Date(2025, 6, 15, 22, 0)
        }
      })
    }

    console.log('📋 Asignaciones de vehículos creadas')

    // 10. Crear incidentes (8 registros)
    const incidentTypes = ['Tráfico', 'Avería mecánica', 'Accidente menor', 'Retraso', 'Vandalismo']
    const incidents = []
    
    for (let i = 0; i < 8; i++) {
      const incident = await prisma.incident.create({
        data: {
          type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
          title: `Incidente ${i + 1}`,
          description: `Descripción detallada del incidente ${i + 1} ocurrido en la ruta`,
          priority: Object.values(IncidentPriority)[Math.floor(Math.random() * Object.values(IncidentPriority).length)],
          location: stops[Math.floor(Math.random() * stops.length)].name,
          unit: vehicles[Math.floor(Math.random() * vehicles.length)].name,
          reportedBy: `${regularUsers[Math.floor(Math.random() * regularUsers.length)].name}`,
          status: Math.random() > 0.3 ? IncidentStatus.RESOLVED : IncidentStatus.PENDING,
          routeId: routes[Math.floor(Math.random() * routes.length)].id
        }
      })
      incidents.push(incident)
    }

    console.log('🚨 Incidentes creados')

    // 11. Crear ubicaciones de vehículos (20 registros)
    for (let i = 0; i < vehicles.length; i++) {
      // Crear 2-3 ubicaciones por vehículo para simular movimiento
      const locationsPerVehicle = Math.floor(Math.random() * 2) + 2
      for (let j = 0; j < locationsPerVehicle; j++) {
        await prisma.vehicleLocation.create({
          data: {
            lat: 19.4326 + (Math.random() - 0.5) * 0.2, // Variación alrededor de CDMX
            lng: -99.1332 + (Math.random() - 0.5) * 0.2,
            recordedAt: new Date(Date.now() - Math.random() * 3600000), // Última hora
            vehicleId: vehicles[i].id
          }
        })
      }
    }

    console.log('📍 Ubicaciones de vehículos creadas')

    // 12. Crear rutas favoritas (6 registros)
    for (let i = 0; i < Math.min(regularUsers.length, 6); i++) {
      await prisma.starredRoute.create({
        data: {
          name: `Mi ruta ${i + 1}`,
          description: `Ruta favorita del usuario ${regularUsers[i].name}`,
          routeId: routes[Math.floor(Math.random() * routes.length)].id,
          userId: regularUsers[i].id
        }
      })
    }

    console.log('⭐ Rutas favoritas creadas')

    // 13. Crear calificaciones (12 registros)
    const ratingCategories = ['Puntualidad', 'Limpieza', 'Comodidad', 'Atención al cliente', 'Seguridad']
    const services = ['Transporte público', 'Ruta express', 'Servicio nocturno']
    
    for (let i = 0; i < 12; i++) {
      await prisma.rating.create({
        data: {
          title: `Calificación ${i + 1}`,
          description: `Experiencia de viaje en la ruta`,
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Entre 3.0 y 5.0
          maxRating: 5,
          category: ratingCategories[Math.floor(Math.random() * ratingCategories.length)],
          comment: `Comentario sobre la experiencia de viaje número ${i + 1}`,
          userType: 'Pasajero',
          service: services[Math.floor(Math.random() * services.length)],
          route: routes[Math.floor(Math.random() * routes.length)].name,
          driver: drivers[Math.floor(Math.random() * drivers.length)] ? `Conductor ${Math.floor(Math.random() * drivers.length) + 1}` : null,
          unit: vehicles[Math.floor(Math.random() * vehicles.length)].name,
          status: RatingStatus.ACTIVE,
          userId: regularUsers[Math.floor(Math.random() * regularUsers.length)].id,
          vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)].id
        }
      })
    }

    console.log('⭐ Calificaciones creadas')

    // 14. Crear notificaciones (15 registros)
    const notificationTitles = [
      'Nuevo horario disponible',
      'Retraso en la ruta',
      'Mantenimiento programado',
      'Nueva ruta agregada',
      'Promoción especial'
    ]
    
    const notificationMessages = [
      'Se ha agregado un nuevo horario para tu ruta favorita',
      'La ruta presenta retrasos debido al tráfico',
      'Mantenimiento programado para el vehículo',
      'Nueva ruta disponible en tu zona',
      'Aprovecha nuestra promoción de temporada'
    ]

    for (let i = 0; i < 15; i++) {
      const randomUser = [...regularUsers, ...driverUsers][Math.floor(Math.random() * (regularUsers.length + driverUsers.length))]
      
      await prisma.notification.create({
        data: {
          title: notificationTitles[Math.floor(Math.random() * notificationTitles.length)],
          message: notificationMessages[Math.floor(Math.random() * notificationMessages.length)],
          isRead: Math.random() > 0.6, // 40% leídas
          userId: randomUser.id,
          driverId: randomUser.role === UserRole.DRIVER ? drivers.find(d => d.userId === randomUser.id)?.id : null,
          ownerVehicleId: randomUser.role === UserRole.OWNER_VEHICLE ? ownerVehicles.find(o => o.userId === randomUser.id)?.id : null
        }
      })
    }

    console.log('🔔 Notificaciones creadas')

    console.log('✅ Seed completado exitosamente!')
    console.log('📊 Resumen de registros creados:')
    console.log('   - 15 Usuarios')
    console.log('   - 3 Propietarios de vehículos')
    console.log('   - 4 Conductores')
    console.log('   - 8 Vehículos')
    console.log('   - 12 Paradas')
    console.log('   - 5 Rutas')
    console.log('   - 15+ Relaciones ruta-parada')
    console.log('   - 10 Horarios')
    console.log('   - 6 Asignaciones de vehículos')
    console.log('   - 8 Incidentes')
    console.log('   - 20+ Ubicaciones de vehículos')
    console.log('   - 6 Rutas favoritas')
    console.log('   - 12 Calificaciones')
    console.log('   - 15 Notificaciones')
    console.log('   TOTAL: 130+ registros')

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
