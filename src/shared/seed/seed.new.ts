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

    // 1. Crear usuarios con roles integrados (15 registros)
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
          emailVerified: true,
          company: 'Transportes Rodríguez S.A. de C.V.',
          contact: '+52 55 3456 7890',
          rfc: 'RODM750815ABC1',
          address: 'Av. Principal 50, Col. Centro, Ciudad de México',
          totalVehicles: 4,
          lastPayment: new Date(2025, 6, 20),
          isOwnerVerified: true
        },
        {
          name: 'Laura',
          lastName: 'Hernández',
          email: 'laura.owner@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 4567 8901',
          role: UserRole.OWNER_VEHICLE,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          company: 'Transportes Hernández S.A. de C.V.',
          contact: '+52 55 4567 8901',
          rfc: 'HERL850101ABC1',
          address: 'Av. Principal 100, Col. Centro, Ciudad de México',
          totalVehicles: 3,
          lastPayment: new Date(2025, 6, 15),
          isOwnerVerified: true
        },
        {
          name: 'Roberto',
          lastName: 'López',
          email: 'roberto.owner@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 5678 9012',
          role: UserRole.OWNER_VEHICLE,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          company: 'Transportes López S.A. de C.V.',
          contact: '+52 55 5678 9012',
          rfc: 'LOPR800525XYZ2',
          address: 'Av. Principal 150, Col. Centro, Ciudad de México',
          totalVehicles: 5,
          lastPayment: new Date(2025, 6, 10),
          isOwnerVerified: true
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
          emailVerified: true,
          license: 'CDL001234567',
          licenseExpiration: new Date(2027, 11, 31),
          driverExperience: '8 años',
          driverRating: 4.8,
          totalTrips: 420,
          isDriverVerified: true
        },
        {
          name: 'María',
          lastName: 'Pérez',
          email: 'maria.driver@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 7890 1234',
          role: UserRole.DRIVER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          license: 'CDL001234568',
          licenseExpiration: new Date(2026, 8, 15),
          driverExperience: '5 años',
          driverRating: 4.6,
          totalTrips: 310,
          isDriverVerified: true
        },
        {
          name: 'Antonio',
          lastName: 'Sánchez',
          email: 'antonio.driver@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 8901 2345',
          role: UserRole.DRIVER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          license: 'CDL001234569',
          licenseExpiration: new Date(2026, 5, 20),
          driverExperience: '6 años',
          driverRating: 4.7,
          totalTrips: 290,
          isDriverVerified: true
        },
        {
          name: 'Carmen',
          lastName: 'Morales',
          email: 'carmen.driver@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 9012 3456',
          role: UserRole.DRIVER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          license: 'CDL001234570',
          licenseExpiration: new Date(2027, 3, 10),
          driverExperience: '3 años',
          driverRating: 4.4,
          totalTrips: 180,
          isDriverVerified: true
        },
        // Usuarios regulares
        {
          name: 'Pedro',
          lastName: 'Ramírez',
          email: 'pedro.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 0123 4567',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Isabel',
          lastName: 'Torres',
          email: 'isabel.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 1234 5678',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Francisco',
          lastName: 'Vega',
          email: 'francisco.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 2345 6789',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Elena',
          lastName: 'Castro',
          email: 'elena.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 3456 7890',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Diego',
          lastName: 'Ruiz',
          email: 'diego.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 4567 8901',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        },
        {
          name: 'Sofía',
          lastName: 'Jiménez',
          email: 'sofia.user@rutafacil.com',
          password: hashedPassword,
          phone: '+52 55 5678 9012',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        }
      ]
    })

    console.log('👥 Usuarios creados con roles integrados')

    // Obtener IDs de usuarios creados
    const createdUsers = await prisma.user.findMany()
    const adminUsers = createdUsers.filter(u => u.role === UserRole.ADMIN)
    const ownerUsers = createdUsers.filter(u => u.role === UserRole.OWNER_VEHICLE)
    const driverUsers = createdUsers.filter(u => u.role === UserRole.DRIVER)
    const regularUsers = createdUsers.filter(u => u.role === UserRole.USER)

    console.log(`📊 Usuarios distribuidos: ${adminUsers.length} admins, ${ownerUsers.length} propietarios, ${driverUsers.length} conductores, ${regularUsers.length} usuarios`)

    // 2. Crear vehículos (8 registros) - ahora asignados directamente a usuarios propietarios
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
          name: `${vehicleModels[i % vehicleModels.length]} ${i + 1}`,
          plate: `${plateNumbers}-${plateLetters}`,
          model: vehicleModels[i % vehicleModels.length],
          color: vehicleColors[i % vehicleColors.length],
          year: 2018 + Math.floor(Math.random() * 7),
          passengers: [12, 15, 20, 25, 30][Math.floor(Math.random() * 5)],
          fuel: Math.floor(Math.random() * 30) + 70, // 70-100%
          mileage: Math.floor(Math.random() * 100000) + 50000,
          nextMaintenance: new Date(2025, 7 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1),
          ownerId: ownerUsers[Math.floor(Math.random() * ownerUsers.length)].id
        }
      })
      vehicles.push(vehicle)
    }

    console.log(`🚐 ${vehicles.length} vehículos creados con propietarios asignados`)

    // 3. Crear rutas (6 registros)
    const routeData = [
      {
        code: 'RTA-001',
        name: 'Centro - Universidad',
        firstPoint: 'Centro Histórico',
        lastPoint: 'Ciudad Universitaria',
        description: 'Ruta principal que conecta el centro histórico con la zona universitaria',
        distance: 25.5,
        estimatedTime: 45,
        operatingHours: '05:30 - 22:00'
      },
      {
        code: 'RTA-002',
        name: 'Aeropuerto - Santa Fe',
        firstPoint: 'Terminal Aérea',
        lastPoint: 'Santa Fe Business District',
        description: 'Conexión directa entre el aeropuerto y la zona comercial de Santa Fe',
        distance: 32.8,
        estimatedTime: 55,
        operatingHours: '04:00 - 23:30'
      },
      {
        code: 'RTA-003',
        name: 'Polanco - Satélite',
        firstPoint: 'Polanco',
        lastPoint: 'Ciudad Satélite',
        description: 'Ruta que conecta la zona residencial de Polanco con Ciudad Satélite',
        distance: 28.2,
        estimatedTime: 50,
        operatingHours: '05:00 - 21:30'
      },
      {
        code: 'RTA-004',
        name: 'Xochimilco - Coyoacán',
        firstPoint: 'Xochimilco Centro',
        lastPoint: 'Coyoacán Centro',
        description: 'Ruta turística que conecta dos zonas históricas importantes',
        distance: 18.7,
        estimatedTime: 35,
        operatingHours: '06:00 - 20:00'
      },
      {
        code: 'RTA-005',
        name: 'Indios Verdes - Pantitlán',
        firstPoint: 'Indios Verdes',
        lastPoint: 'Pantitlán',
        description: 'Ruta metropolitana que conecta el norte con el oriente de la ciudad',
        distance: 45.3,
        estimatedTime: 75,
        operatingHours: '04:30 - 23:00'
      },
      {
        code: 'RTA-006',
        name: 'Reforma - Interlomas',
        firstPoint: 'Paseo de la Reforma',
        lastPoint: 'Interlomas Shopping',
        description: 'Conexión ejecutiva entre el corredor financiero y zona comercial',
        distance: 22.1,
        estimatedTime: 40,
        operatingHours: '05:30 - 22:30'
      }
    ]

    const routes = []
    for (const routeInfo of routeData) {
      const route = await prisma.route.create({
        data: {
          ...routeInfo,
          totalStops: Math.floor(Math.random() * 8) + 5, // 5-12 paradas
          assignedUnits: Math.floor(Math.random() * 3) + 2, // 2-4 unidades
          dailyTrips: Math.floor(Math.random() * 20) + 15, // 15-34 viajes diarios
          status: RouteStatus.ACTIVE,
          vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)].id
        }
      })
      routes.push(route)
    }

    console.log(`🗺️ ${routes.length} rutas creadas`)

    // 4. Crear paradas (30 registros)
    const stopNames = [
      'Metro Insurgentes', 'Hospital General', 'Plaza Mayor', 'Mercado Central',
      'Escuela Primaria Benito Juárez', 'Centro Comercial Plaza', 'Clínica del IMSS',
      'Parque de la Ciudad', 'Terminal de Autobuses', 'Universidad Tecnológica',
      'Biblioteca Municipal', 'Centro Deportivo', 'Iglesia San José',
      'Farmacia Guadalupe', 'Banco Azteca', 'Oxxo Centro', 'Gasolinera Pemex',
      'Taller Mecánico López', 'Restaurante La Cocina', 'Hotel Colonial',
      'Oficinas Municipales', 'Centro de Salud', 'Kínder Montessori',
      'Súper Che', 'Lavandería Express', 'Cyber Café Net', 'Tortillería La Esperanza',
      'Carnicería San Antonio', 'Papelería Escolar', 'Ferretería El Martillo'
    ]

    const stops = []
    for (let i = 0; i < 30; i++) {
      const stop = await prisma.stop.create({
        data: {
          name: stopNames[i],
          address: `Calle ${i + 1} #${Math.floor(Math.random() * 500) + 100}, Colonia ${['Centro', 'Norte', 'Sur', 'Oriente', 'Poniente'][Math.floor(Math.random() * 5)]}`,
          lat: 19.4326 + (Math.random() - 0.5) * 0.1, // Ciudad de México ± variación
          lng: -99.1332 + (Math.random() - 0.5) * 0.1,
          facilities: ['Bancas', 'Techado', 'Iluminación', 'Seguridad'][Math.floor(Math.random() * 4)] || null,
          accessibility: Math.random() > 0.3 ? 'Acceso para personas con discapacidad' : null,
          status: StopStatus.ACTIVE
        }
      })
      stops.push(stop)
    }

    console.log(`🚏 ${stops.length} paradas creadas`)

    // 5. Crear relaciones ruta-parada
    const routeStops = []
    for (const route of routes) {
      const numStops = Math.floor(Math.random() * 6) + 4 // 4-9 paradas por ruta
      const selectedStops = stops.sort(() => 0.5 - Math.random()).slice(0, numStops)
      
      for (let i = 0; i < selectedStops.length; i++) {
        const routeStop = await prisma.routeStop.create({
          data: {
            routeId: route.id,
            stopId: selectedStops[i].id,
            order: i + 1
          }
        })
        routeStops.push(routeStop)
      }
    }

    console.log(`🔗 ${routeStops.length} relaciones ruta-parada creadas`)

    // 6. Crear horarios (18 registros - 3 por ruta)
    const schedules = []
    for (const route of routes) {
      const timeSlots = [
        { start: '05:30', end: '09:00', freq: 'Cada 15 minutos', days: 'Lunes a Viernes' },
        { start: '09:00', end: '17:00', freq: 'Cada 20 minutos', days: 'Lunes a Viernes' },
        { start: '17:00', end: '21:00', freq: 'Cada 12 minutos', days: 'Lunes a Viernes' }
      ]

      for (const slot of timeSlots) {
        const schedule = await prisma.schedule.create({
          data: {
            routeId: route.id,
            startTime: slot.start,
            endTime: slot.end,
            frequency: slot.freq,
            days: slot.days,
            totalTrips: Math.floor(Math.random() * 15) + 8, // 8-22 viajes
            status: ScheduleStatus.ACTIVE
          }
        })
        schedules.push(schedule)
      }
    }

    console.log(`⏰ ${schedules.length} horarios creados`)

    // 7. Crear asignaciones de vehículo (12 registros)
    const vehicleAssignments = []
    for (let i = 0; i < 12; i++) {
      const startTime = new Date()
      startTime.setHours(Math.floor(Math.random() * 8) + 5, 0, 0, 0) // 5:00 - 12:00

      const endTime = new Date(startTime)
      endTime.setHours(startTime.getHours() + Math.floor(Math.random() * 8) + 4) // +4 a +11 horas

      const assignment = await prisma.vehicleAssignment.create({
        data: {
          vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)].id,
          routeId: routes[Math.floor(Math.random() * routes.length)].id,
          driverId: driverUsers[Math.floor(Math.random() * driverUsers.length)].id,
          startTime: startTime,
          endTime: Math.random() > 0.3 ? endTime : null // 70% tienen hora de fin
        }
      })
      vehicleAssignments.push(assignment)
    }

    console.log(`🔄 ${vehicleAssignments.length} asignaciones de vehículo creadas`)

    // 8. Crear incidentes (15 registros)
    const incidentTypes = ['Retraso', 'Avería mecánica', 'Tráfico', 'Accidente menor', 'Mantenimiento']
    const incidentTitles = [
      'Retraso por tráfico intenso',
      'Falla en el motor',
      'Embotellamiento en Reforma',
      'Ponchadura de llanta',
      'Mantenimiento preventivo',
      'Retraso por manifestación',
      'Problema con frenos',
      'Accidente vial menor',
      'Falla eléctrica',
      'Limpieza de unidad'
    ]

    const incidents = []
    for (let i = 0; i < 15; i++) {
      const incident = await prisma.incident.create({
        data: {
          type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
          title: incidentTitles[Math.floor(Math.random() * incidentTitles.length)],
          description: `Descripción detallada del incidente #${i + 1}. Se requiere atención ${['inmediata', 'urgente', 'normal', 'programada'][Math.floor(Math.random() * 4)]}.`,
          priority: [IncidentPriority.LOW, IncidentPriority.MEDIUM, IncidentPriority.HIGH][Math.floor(Math.random() * 3)],
          location: `KM ${Math.floor(Math.random() * 50) + 1} de la ruta`,
          unit: vehicles[Math.floor(Math.random() * vehicles.length)].plate,
          reportedBy: driverUsers[Math.floor(Math.random() * driverUsers.length)].name,
          status: [IncidentStatus.PENDING, IncidentStatus.IN_PROGRESS, IncidentStatus.RESOLVED][Math.floor(Math.random() * 3)],
          routeId: routes[Math.floor(Math.random() * routes.length)].id
        }
      })
      incidents.push(incident)
    }

    console.log(`🚨 ${incidents.length} incidentes creados`)

    // 9. Crear calificaciones (25 registros)
    const ratingCategories = ['Puntualidad', 'Limpieza', 'Servicio al cliente', 'Seguridad', 'Comodidad']
    const ratingComments = [
      'Excelente servicio, muy puntual',
      'La unidad estaba muy limpia',
      'El conductor fue muy amable',
      'Viaje seguro y cómodo',
      'Buena experiencia en general',
      'Podría mejorar la puntualidad',
      'Excelente atención al cliente',
      'Unidad en buen estado',
      'Conductor profesional',
      'Recomiendo este servicio'
    ]

    const ratings = []
    for (let i = 0; i < 25; i++) {
      const rating = await prisma.rating.create({
        data: {
          title: `Calificación ${i + 1}`,
          description: 'Calificación del servicio de transporte',
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
          maxRating: 5,
          category: ratingCategories[Math.floor(Math.random() * ratingCategories.length)],
          comment: ratingComments[Math.floor(Math.random() * ratingComments.length)],
          userType: 'passenger',
          service: 'transport',
          route: routes[Math.floor(Math.random() * routes.length)].name,
          driver: driverUsers[Math.floor(Math.random() * driverUsers.length)].name,
          unit: vehicles[Math.floor(Math.random() * vehicles.length)].plate,
          status: RatingStatus.ACTIVE,
          userId: regularUsers[Math.floor(Math.random() * regularUsers.length)].id,
          vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)].id
        }
      })
      ratings.push(rating)
    }

    console.log(`⭐ ${ratings.length} calificaciones creadas`)

    // 10. Crear rutas favoritas (20 registros)
    const starredRoutes = []
    for (let i = 0; i < 20; i++) {
      const starredRoute = await prisma.starredRoute.create({
        data: {
          name: `Favorita ${i + 1}`,
          description: `Ruta favorita del usuario para ${['trabajo', 'escuela', 'casa', 'compras'][Math.floor(Math.random() * 4)]}`,
          routeId: routes[Math.floor(Math.random() * routes.length)].id,
          userId: [...regularUsers, ...driverUsers][Math.floor(Math.random() * (regularUsers.length + driverUsers.length))].id
        }
      })
      starredRoutes.push(starredRoute)
    }

    console.log(`⭐ ${starredRoutes.length} rutas favoritas creadas`)

    // 11. Crear ubicaciones de vehículos (40 registros)
    const vehicleLocations = []
    for (let i = 0; i < 40; i++) {
      const recordTime = new Date()
      recordTime.setMinutes(recordTime.getMinutes() - Math.floor(Math.random() * 120)) // Últimas 2 horas

      const vehicleLocation = await prisma.vehicleLocation.create({
        data: {
          lat: 19.4326 + (Math.random() - 0.5) * 0.2,
          lng: -99.1332 + (Math.random() - 0.5) * 0.2,
          recordedAt: recordTime,
          vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)].id
        }
      })
      vehicleLocations.push(vehicleLocation)
    }

    console.log(`📍 ${vehicleLocations.length} ubicaciones de vehículos creadas`)

    // 12. Crear notificaciones (30 registros)
    const notificationTitles = [
      'Nuevo mensaje del sistema',
      'Actualización de ruta',
      'Mantenimiento programado',
      'Cambio de horario',
      'Incidente reportado',
      'Calificación recibida',
      'Recordatorio de pago',
      'Nueva asignación de vehículo',
      'Actualización de perfil',
      'Mensaje del administrador'
    ]

    const notificationMessages = [
      'Se ha actualizado la información de tu perfil',
      'Tu ruta favorita tiene cambios de horario',
      'Mantenimiento programado para tu vehículo',
      'Nuevo horario disponible en tu ruta',
      'Se reportó un incidente en tu ruta',
      'Has recibido una nueva calificación',
      'Recordatorio: pago pendiente',
      'Nueva asignación de vehículo disponible',
      'Tu perfil ha sido actualizado correctamente',
      'Mensaje importante del administrador'
    ]

    const notifications = []
    for (let i = 0; i < 30; i++) {
      const randomUser = [...adminUsers, ...ownerUsers, ...driverUsers, ...regularUsers][Math.floor(Math.random() * (adminUsers.length + ownerUsers.length + driverUsers.length + regularUsers.length))]
      
      const notification = await prisma.notification.create({
        data: {
          title: notificationTitles[Math.floor(Math.random() * notificationTitles.length)],
          message: notificationMessages[Math.floor(Math.random() * notificationMessages.length)],
          isRead: Math.random() > 0.4, // 60% leídas, 40% no leídas
          userId: randomUser.id
        }
      })
      notifications.push(notification)
    }

    console.log(`🔔 ${notifications.length} notificaciones creadas`)

    // Estadísticas finales
    const finalStats = {
      users: await prisma.user.count(),
      vehicles: await prisma.vehicle.count(),
      routes: await prisma.route.count(),
      stops: await prisma.stop.count(),
      schedules: await prisma.schedule.count(),
      vehicleAssignments: await prisma.vehicleAssignment.count(),
      incidents: await prisma.incident.count(),
      ratings: await prisma.rating.count(),
      starredRoutes: await prisma.starredRoute.count(),
      vehicleLocations: await prisma.vehicleLocation.count(),
      notifications: await prisma.notification.count(),
      routeStops: await prisma.routeStop.count()
    }

    console.log('\n📊 ESTADÍSTICAS FINALES:')
    console.log('========================')
    console.log(`👥 Usuarios: ${finalStats.users}`)
    console.log(`🚐 Vehículos: ${finalStats.vehicles}`)
    console.log(`🗺️ Rutas: ${finalStats.routes}`)
    console.log(`🚏 Paradas: ${finalStats.stops}`)
    console.log(`🔗 Ruta-Paradas: ${finalStats.routeStops}`)
    console.log(`⏰ Horarios: ${finalStats.schedules}`)
    console.log(`🔄 Asignaciones: ${finalStats.vehicleAssignments}`)
    console.log(`🚨 Incidentes: ${finalStats.incidents}`)
    console.log(`⭐ Calificaciones: ${finalStats.ratings}`)
    console.log(`⭐ Rutas favoritas: ${finalStats.starredRoutes}`)
    console.log(`📍 Ubicaciones: ${finalStats.vehicleLocations}`)
    console.log(`🔔 Notificaciones: ${finalStats.notifications}`)
    console.log('========================')
    console.log(`🎉 Total de registros: ${Object.values(finalStats).reduce((a, b) => a + b, 0)}`)

    console.log('\n✅ Seed completado exitosamente!')

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal en el seed:', e)
    process.exit(1)
  })
