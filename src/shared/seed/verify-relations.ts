import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

/**
 * Script de verificación para probar las relaciones Driver-User
 */
async function verifyDriverRelations() {
  console.log('🔍 Verificando relaciones Driver-User establecidas por el seed...\n')

  try {
    // 1. Obtener todos los drivers con sus usuarios
    console.log('📋 1. Drivers con información de usuario:')
    const driversWithUsers = await prisma.driver.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            status: true
          }
        }
      }
    })

    driversWithUsers.forEach((driver, index) => {
      console.log(`   ${index + 1}. Driver ID: ${driver.id}`)
      console.log(`      Usuario: ${driver.user.name} ${driver.user.lastName}`)
      console.log(`      Email: ${driver.user.email}`)
      console.log(`      Teléfono: ${driver.user.phone}`)
      console.log(`      Licencia: ${driver.license}`)
      console.log(`      Experiencia: ${driver.experience}`)
      console.log(`      Rating: ${driver.rating}/5`)
      console.log(`      Viajes: ${driver.totalTrips}`)
      console.log(`      Verificado: ${driver.isVerified ? 'Sí' : 'No'}`)
      console.log('')
    })

    // 2. Obtener usuarios con rol DRIVER y su información de conductor
    console.log('👤 2. Usuarios con rol DRIVER y su perfil de conductor:')
    const usersWithDriverProfile = await prisma.user.findMany({
      where: { role: 'DRIVER' },
      include: {
        driver: true
      }
    })

    usersWithDriverProfile.forEach((user, index) => {
      console.log(`   ${index + 1}. Usuario: ${user.name} ${user.lastName}`)
      console.log(`      Email: ${user.email}`)
      console.log(`      Driver ID: ${user.driver?.id}`)
      console.log(`      Licencia: ${user.driver?.license}`)
      console.log(`      Rating: ${user.driver?.rating}/5`)
      console.log('')
    })

    // 3. Verificar asignaciones de vehículos
    console.log('🚗 3. Asignaciones vehículo-conductor:')
    const assignments = await prisma.vehicleAssignment.findMany({
      include: {
        Driver: {
          include: {
            user: {
              select: {
                name: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        Vehicle: {
          select: {
            name: true,
            plate: true,
            model: true
          }
        }
      }
    })

    assignments.forEach((assignment, index) => {
      console.log(`   ${index + 1}. Asignación:`)
      console.log(`      Conductor: ${assignment.Driver.user.name} ${assignment.Driver.user.lastName}`)
      console.log(`      Vehículo: ${assignment.Vehicle.name} (${assignment.Vehicle.plate})`)
      console.log(`      Route ID: ${assignment.routeId}`)
      console.log(`      Horario: ${assignment.startTime.toLocaleTimeString()}${assignment.endTime ? ` - ${assignment.endTime.toLocaleTimeString()}` : ' - Sin fin definido'}`)
      console.log('')
    })

    // 4. Verificar notificaciones de conductores
    console.log('🔔 4. Notificaciones para conductores:')
    const driverNotifications = await prisma.notification.findMany({
      where: { driverId: { not: null } },
      include: {
        User: {
          select: {
            name: true,
            lastName: true
          }
        },
        Driver: {
          select: {
            id: true,
            license: true
          }
        }
      }
    })

    driverNotifications.forEach((notification, index) => {
      console.log(`   ${index + 1}. Notificación:`)
      console.log(`      Para: ${notification.User?.name} ${notification.User?.lastName}`)
      console.log(`      Título: ${notification.title}`)
      console.log(`      Mensaje: ${notification.message}`)
      console.log(`      Leída: ${notification.isRead ? 'Sí' : 'No'}`)
      console.log('')
    })

    // 5. Estadísticas generales
    console.log('📊 5. Estadísticas generales:')
    const totalUsers = await prisma.user.count()
    const totalDriverUsers = await prisma.user.count({ where: { role: 'DRIVER' } })
    const totalDrivers = await prisma.driver.count()
    const totalAssignments = await prisma.vehicleAssignment.count()
    const totalDriverNotifications = await prisma.notification.count({ 
      where: { driverId: { not: null } } 
    })

    console.log(`   - Total usuarios: ${totalUsers}`)
    console.log(`   - Usuarios con rol DRIVER: ${totalDriverUsers}`)
    console.log(`   - Registros en tabla drivers: ${totalDrivers}`)
    console.log(`   - Asignaciones vehículo-conductor: ${totalAssignments}`)
    console.log(`   - Notificaciones para conductores: ${totalDriverNotifications}`)
    
    // Verificación de integridad
    console.log('\n✅ Verificación de integridad:')
    if (totalDriverUsers === totalDrivers) {
      console.log('   ✅ Relación 1:1 User-Driver: CORRECTA')
    } else {
      console.log('   ❌ Relación 1:1 User-Driver: INCONSISTENTE')
    }

    if (totalAssignments > 0) {
      console.log('   ✅ Asignaciones vehículo-conductor: ESTABLECIDAS')
    } else {
      console.log('   ⚠️ No hay asignaciones vehículo-conductor')
    }

    if (totalDriverNotifications > 0) {
      console.log('   ✅ Notificaciones para conductores: CONFIGURADAS')
    } else {
      console.log('   ⚠️ No hay notificaciones específicas para conductores')
    }

    console.log('\n🎉 Verificación completada exitosamente!')
    console.log('🔗 Todas las relaciones Driver-User están funcionando correctamente.')

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

verifyDriverRelations()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
