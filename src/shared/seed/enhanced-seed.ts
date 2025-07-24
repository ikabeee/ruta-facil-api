import { PrismaClient } from '../../../generated/prisma'
import { UserRole, UserStatus, RouteStatus, StopStatus, ScheduleStatus, IncidentStatus, IncidentPriority, RatingStatus } from '../../../generated/prisma'
import * as bcrypt from 'bcrypt'
import { SEED_CONFIG } from './seed.config'

const prisma = new PrismaClient()

/**
 * Seed mejorado con relaciones Driver-User optimizadas
 * Incluye datos realistas y todas las relaciones necesarias
 */
async function enhancedSeed() {
  console.log('🌱 Iniciando seed mejorado con relaciones Driver-User...')

  try {
    // Limpiar datos existentes en orden correcto
    console.log('🧹 Limpiando datos existentes...')
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
    await prisma.driver.deleteMany() // Importante: eliminar drivers antes que users
    await prisma.ownerVehicle.deleteMany()
    await prisma.user.deleteMany()

    // Hashear contraseña por defecto
    const hashedPassword = await bcrypt.hash(SEED_CONFIG.DEFAULT_PASSWORD, 10)

    // 1. Crear usuarios con datos específicos para conductores
    console.log('👥 Creando usuarios...')
    const usersData = [
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
      // Conductores con datos específicos
      {
        name: 'José Manuel',
        lastName: 'García Rodríguez',
        email: 'jose.driver@rutafacil.com',
        password: hashedPassword,
        phone: '+52 55 6789 0123',
        role: UserRole.DRIVER,
        status: UserStatus.ACTIVE,
        emailVerified: true
      },
      {
        name: 'María Elena',
        lastName: 'Pérez Sánchez',
        email: 'maria.driver@rutafacil.com',
        password: hashedPassword,
        phone: '+52 55 7890 1234',
        role: UserRole.DRIVER,
        status: UserStatus.ACTIVE,
        emailVerified: true
      },
      {
        name: 'Antonio',
        lastName: 'Sánchez López',
        email: 'antonio.driver@rutafacil.com',
        password: hashedPassword,
        phone: '+52 55 8901 2345',
        role: UserRole.DRIVER,
        status: UserStatus.ACTIVE,
        emailVerified: true
      },
      {
        name: 'Carmen Rosa',
        lastName: 'Morales Jiménez',
        email: 'carmen.driver@rutafacil.com',
        password: hashedPassword,
        phone: '+52 55 9012 3456',
        role: UserRole.DRIVER,
        status: UserStatus.ACTIVE,
        emailVerified: true
      },
      {
        name: 'Fernando',
        lastName: 'Ruiz Mendoza',
        email: 'fernando.driver@rutafacil.com',
        password: hashedPassword,
        phone: '+52 55 0123 4567',
        role: UserRole.DRIVER,
        status: UserStatus.ACTIVE,
        emailVerified: true
      },
      {
        name: 'Patricia',
        lastName: 'González Herrera',
        email: 'patricia.driver@rutafacil.com',
        password: hashedPassword,
        phone: '+52 55 1357 2468',
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
        phone: '+52 55 2468 1357',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true
      },
      {
        name: 'Lucía',
        lastName: 'Torres',
        email: 'lucia.user@rutafacil.com',
        password: hashedPassword,
        phone: '+52 55 3579 4680',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true
      },
      {
        name: 'Ricardo',
        lastName: 'Vargas',
        email: 'ricardo.user@rutafacil.com',
        password: hashedPassword,
        phone: '+52 55 4680 5791',
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

    await prisma.user.createMany({ data: usersData })

    // Obtener usuarios creados
    const createdUsers = await prisma.user.findMany()
    const adminUsers = createdUsers.filter(u => u.role === UserRole.ADMIN)
    const ownerUsers = createdUsers.filter(u => u.role === UserRole.OWNER_VEHICLE)
    const driverUsers = createdUsers.filter(u => u.role === UserRole.DRIVER)
    const regularUsers = createdUsers.filter(u => u.role === UserRole.USER)

    console.log(`✅ ${createdUsers.length} usuarios creados (${driverUsers.length} conductores)`)

    // 2. Crear propietarios de vehículos
    console.log('🏢 Creando propietarios de vehículos...')
    const ownerVehicles = []
    const companyNames = ['Transportes del Valle', 'Rutas Seguras', 'Movilidad Urbana']
    
    for (let i = 0; i < ownerUsers.length; i++) {
      const owner = await prisma.ownerVehicle.create({
        data: {
          userId: ownerUsers[i].id,
          company: `${companyNames[i]} S.A. de C.V.`,
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

    console.log(`✅ ${ownerVehicles.length} propietarios creados`)

    // 3. Crear conductores con perfiles detallados
    console.log('🚗 Creando perfiles de conductores...')
    const driverProfiles = [
      {
        license: 'CDMX001234567',
        experience: '8 años',
        rating: 4.8,
        totalTrips: 1420,
        specialization: 'Rutas urbanas y suburbanas'
      },
      {
        license: 'CDMX009876543',
        experience: '5 años',
        rating: 4.6,
        totalTrips: 980,
        specialization: 'Transporte escolar y ejecutivo'
      },
      {
        license: 'CDMX555666777',
        experience: '12 años',
        rating: 4.9,
        totalTrips: 2180,
        specialization: 'Rutas nocturnas y express'
      },
      {
        license: 'CDMX888999000',
        experience: '3 años',
        rating: 4.4,
        totalTrips: 580,
        specialization: 'Atención al cliente y rutas turísticas'
      },
      {
        license: 'CDMX111222333',
        experience: '7 años',
        rating: 4.7,
        totalTrips: 1350,
        specialization: 'Transporte de carga ligera'
      },
      {
        license: 'CDMX444555666',
        experience: '4 años',
        rating: 4.5,
        totalTrips: 720,
        specialization: 'Rutas metropolitanas'
      }
    ]

    const drivers = []
    for (let i = 0; i < driverUsers.length; i++) {
      const profile = driverProfiles[i] || driverProfiles[driverProfiles.length - 1]
      
      // Generar fecha de expiración de licencia (1-3 años en el futuro)
      const licenseExpiration = new Date()
      licenseExpiration.setFullYear(licenseExpiration.getFullYear() + Math.floor(Math.random() * 3) + 1)
      
      const driver = await prisma.driver.create({
        data: {
          userId: driverUsers[i].id,
          license: profile.license + (i > 5 ? `_${i}` : ''), // Evitar duplicados
          licenseExpiration: licenseExpiration,
          experience: profile.experience,
          rating: profile.rating,
          totalTrips: profile.totalTrips,
          isVerified: true
        }
      })
      drivers.push(driver)
    }

    console.log(`✅ ${drivers.length} conductores creados con relaciones User establecidas`)

    // Verificar relaciones Driver-User
    console.log('🔍 Verificando relaciones Driver-User...')
    const driversWithUsers = await prisma.driver.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            phone: true,
            role: true
          }
        }
      }
    })

    driversWithUsers.forEach(driver => {
      console.log(`   Driver ${driver.id} -> User: ${driver.user.name} ${driver.user.lastName} (${driver.user.email})`)
    })

    // 4. Crear vehículos
    console.log('🚌 Creando vehículos...')
    const vehicleData = [
      { name: 'Unidad Norte 1', model: 'Mercedes Sprinter', color: 'Blanco', year: 2022, passengers: 20 },
      { name: 'Unidad Sur 2', model: 'Ford Transit', color: 'Azul', year: 2021, passengers: 15 },
      { name: 'Unidad Este 3', model: 'Renault Master', color: 'Gris', year: 2023, passengers: 25 },
      { name: 'Unidad Oeste 4', model: 'Iveco Daily', color: 'Blanco', year: 2022, passengers: 18 },
      { name: 'Unidad Centro 5', model: 'Toyota Hiace', color: 'Plata', year: 2021, passengers: 14 },
      { name: 'Unidad Express 6', model: 'Nissan Urvan', color: 'Negro', year: 2023, passengers: 12 },
      { name: 'Unidad Nocturna 7', model: 'Hyundai H1', color: 'Azul', year: 2022, passengers: 16 },
      { name: 'Unidad Especial 8', model: 'Fiat Ducato', color: 'Rojo', year: 2021, passengers: 22 }
    ]

    const vehicles = []
    for (let i = 0; i < vehicleData.length; i++) {
      const data = vehicleData[i]
      const plateNumbers = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
      const plateLetters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                          String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                          String.fromCharCode(65 + Math.floor(Math.random() * 26))
      
      const vehicle = await prisma.vehicle.create({
        data: {
          name: data.name,
          plate: `${plateNumbers}-${plateLetters}`,
          model: data.model,
          color: data.color,
          year: data.year,
          passengers: data.passengers,
          fuel: Math.round((Math.random() * 40 + 60) * 10) / 10,
          mileage: Math.floor(Math.random() * 50000) + 10000,
          nextMaintenance: new Date(2025, 7 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1),
          ownerId: ownerVehicles[Math.floor(Math.random() * ownerVehicles.length)].id,
          ownerVehicleId: ownerVehicles[Math.floor(Math.random() * ownerVehicles.length)].id
        }
      })
      vehicles.push(vehicle)
    }

    console.log(`✅ ${vehicles.length} vehículos creados`)

    // 5. Crear paradas estratégicas
    console.log('📍 Creando paradas...')
    const stopLocations = [
      { name: 'Terminal Central CDMX', lat: 19.4326, lng: -99.1332, address: 'Av. Central 100, Centro Histórico' },
      { name: 'Ciudad Universitaria', lat: 19.3319, lng: -99.1844, address: 'Universidad Nacional s/n, Coyoacán' },
      { name: 'Metro Insurgentes Sur', lat: 19.4214, lng: -99.1625, address: 'Av. Insurgentes Sur 421, Roma Norte' },
      { name: 'Mercado de San Juan', lat: 19.4278, lng: -99.1419, address: 'Calle Ernesto Pugibet 21, Centro' },
      { name: 'Hospital General', lat: 19.4119, lng: -99.1519, address: 'Dr. Balmis 148, Doctores' },
      { name: 'Parque México Condesa', lat: 19.4103, lng: -99.1687, address: 'Av. México s/n, Condesa' },
      { name: 'Plaza Universidad', lat: 19.3762, lng: -99.1728, address: 'Av. Universidad 1321, Del Valle' },
      { name: 'Estadio Azteca', lat: 19.3030, lng: -99.1506, address: 'Calz. de Tlalpan 3465, Santa Úrsula' },
      { name: 'Terminal Aérea', lat: 19.4363, lng: -99.0721, address: 'Aeropuerto Internacional CDMX' },
      { name: 'Basílica de Guadalupe', lat: 19.4847, lng: -99.1175, address: 'Plaza de las Américas 1, Villa de Guadalupe' },
      { name: 'Embarcadero Xochimilco', lat: 19.2647, lng: -99.1031, address: 'Jardín Juárez s/n, Xochimilco' },
      { name: 'Polanco Reforma', lat: 19.4260, lng: -99.1915, address: 'Av. Presidente Masaryk 515, Polanco' }
    ]

    const stops = []
    for (let i = 0; i < stopLocations.length; i++) {
      const location = stopLocations[i]
      const stop = await prisma.stop.create({
        data: {
          name: location.name,
          address: location.address,
          lat: location.lat,
          lng: location.lng,
          facilities: 'Bancas, Techo, Iluminación LED, WiFi gratuito',
          accessibility: Math.random() > 0.3 ? 'Accesible para sillas de ruedas' : 'Accesibilidad limitada',
          status: StopStatus.ACTIVE
        }
      })
      stops.push(stop)
    }

    console.log(`✅ ${stops.length} paradas creadas`)

    // 6. Crear rutas principales
    console.log('🛣️ Creando rutas...')
    const routeData = [
      { name: 'Ruta Norte-Sur', code: 'RNS-001', description: 'Conecta la zona norte con el sur de la ciudad' },
      { name: 'Ruta Este-Oeste', code: 'REO-002', description: 'Ruta transversal que cruza la ciudad de este a oeste' },
      { name: 'Ruta Universitaria', code: 'RU-003', description: 'Conecta principales centros educativos' },
      { name: 'Ruta Turística', code: 'RT-004', description: 'Recorre los principales puntos turísticos' },
      { name: 'Ruta Nocturna', code: 'RN-005', description: 'Servicio nocturno para trabajadores de turno' }
    ]

    const routes = []
    for (let i = 0; i < routeData.length; i++) {
      const data = routeData[i]
      const route = await prisma.route.create({
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          firstPoint: 'Inicio de ruta',
          lastPoint: 'Final de ruta',
          distance: Math.round((Math.random() * 30 + 10) * 100) / 100,
          estimatedTime: Math.floor(Math.random() * 60) + 30,
          totalStops: Math.floor(Math.random() * 8) + 5,
          assignedUnits: Math.floor(Math.random() * 3) + 1,
          dailyTrips: Math.floor(Math.random() * 20) + 10,
          operatingHours: '06:00 - 22:00',
          status: RouteStatus.ACTIVE
        }
      })
      routes.push(route)
    }

    console.log(`✅ ${routes.length} rutas creadas`)

    // 7. Crear asignaciones de vehículo-conductor-ruta
    console.log('📋 Creando asignaciones vehículo-conductor-ruta...')
    const assignments = []
    
    for (let i = 0; i < Math.min(vehicles.length, drivers.length, routes.length); i++) {
      const assignment = await prisma.vehicleAssignment.create({
        data: {
          vehicleId: vehicles[i].id,
          routeId: routes[i % routes.length].id,
          driverId: drivers[i].id,
          startTime: new Date(2025, 6, 15, 6 + (i * 2), 0), // Escalonar horarios
          endTime: new Date(2025, 6, 15, 22 - (i * 1), 0)
        }
      })
      assignments.push(assignment)
    }

    console.log(`✅ ${assignments.length} asignaciones creadas`)

    // 8. Crear notificaciones específicas para conductores
    console.log('🔔 Creando notificaciones para conductores...')
    const driverNotifications = [
      {
        title: 'Nuevo horario asignado',
        message: 'Se te ha asignado un nuevo horario para la ruta matutina. Revisa tu cronograma.',
        category: 'schedule'
      },
      {
        title: 'Mantenimiento vehicular',
        message: 'Tu vehículo asignado requiere mantenimiento preventivo. Programa tu cita.',
        category: 'maintenance'
      },
      {
        title: 'Evaluación de desempeño',
        message: 'Tu calificación promedio del mes es excelente. ¡Sigue así!',
        category: 'performance'
      },
      {
        title: 'Capacitación disponible',
        message: 'Nueva capacitación en atención al cliente disponible. Inscríbete ya.',
        category: 'training'
      },
      {
        title: 'Bonificación especial',
        message: 'Has calificado para una bonificación por puntualidad. Felicidades.',
        category: 'bonus'
      }
    ]

    for (let i = 0; i < drivers.length; i++) {
      const driver = drivers[i]
      const notification = driverNotifications[i % driverNotifications.length]
      
      await prisma.notification.create({
        data: {
          title: notification.title,
          message: notification.message,
          isRead: Math.random() > 0.5,
          userId: driver.userId,
          driverId: driver.id
        }
      })
    }

    // Crear algunas notificaciones generales
    for (let i = 0; i < 10; i++) {
      const randomUser = [...regularUsers, ...adminUsers][Math.floor(Math.random() * (regularUsers.length + adminUsers.length))]
      
      await prisma.notification.create({
        data: {
          title: 'Actualización del sistema',
          message: 'Nueva versión de la aplicación disponible con mejoras en el seguimiento de rutas.',
          isRead: Math.random() > 0.6,
          userId: randomUser.id
        }
      })
    }

    console.log('✅ Notificaciones creadas')

    // Resumen final con verificación de relaciones
    console.log('\n🎉 Seed mejorado completado exitosamente!')
    console.log('📊 Resumen detallado:')
    console.log(`   - ${createdUsers.length} Usuarios totales`)
    console.log(`   - ${adminUsers.length} Administradores`)
    console.log(`   - ${ownerVehicles.length} Propietarios de vehículos`)
    console.log(`   - ${drivers.length} Conductores (con relación User)`)
    console.log(`   - ${regularUsers.length} Usuarios regulares`)
    console.log(`   - ${vehicles.length} Vehículos`)
    console.log(`   - ${stops.length} Paradas`)
    console.log(`   - ${routes.length} Rutas`)
    console.log(`   - ${assignments.length} Asignaciones vehículo-conductor`)
    console.log(`   - ${drivers.length + 10} Notificaciones`)

    // Verificación final de integridad
    const driversCount = await prisma.driver.count()
    const usersWithDriverRole = await prisma.user.count({ where: { role: UserRole.DRIVER } })
    
    console.log('\n🔍 Verificación de integridad:')
    console.log(`   - Drivers en BD: ${driversCount}`)
    console.log(`   - Users con rol DRIVER: ${usersWithDriverRole}`)
    console.log(`   - Relación 1:1 verificada: ${driversCount === usersWithDriverRole ? '✅' : '❌'}`)

    if (driversCount === usersWithDriverRole) {
      console.log('✅ Todas las relaciones Driver-User están correctamente establecidas')
    } else {
      console.log('⚠️ Advertencia: Inconsistencia en relaciones Driver-User')
    }

  } catch (error) {
    console.error('❌ Error durante el seed mejorado:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

enhancedSeed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
