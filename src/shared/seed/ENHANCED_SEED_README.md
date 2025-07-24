# 🌱 Seed Mejorado con Relaciones Driver-User

Este archivo documenta el seed mejorado que incluye todas las nuevas relaciones de Prisma, especialmente la relación Driver-User.

## 🎯 Características del Seed Mejorado

### ✅ Relaciones Implementadas

1. **User ↔ Driver (1:1)**
   - Cada conductor tiene un usuario asociado
   - Relación bidireccional verificada
   - Integridad referencial garantizada

2. **Driver ↔ VehicleAssignment (1:N)**
   - Conductores asignados a vehículos específicos
   - Horarios y rutas definidos

3. **Driver ↔ Notification (1:N)**
   - Notificaciones específicas para conductores
   - Mensajes relacionados con horarios, mantenimiento, evaluaciones

4. **User ↔ Notification (1:N)**
   - Notificaciones generales para todos los usuarios
   - Sistema de notificaciones unificado

### 📊 Datos Creados

#### Usuarios (15 total)
- **2 Administradores**: Gestión completa del sistema
- **3 Propietarios**: Dueños de flotas de vehículos
- **6 Conductores**: Operadores con perfiles detallados
- **4 Usuarios**: Pasajeros regulares

#### Conductores (6 perfiles detallados)
```javascript
{
  license: 'CDMX001234567',
  experience: '8 años',
  rating: 4.8,
  totalTrips: 1420,
  specialization: 'Rutas urbanas y suburbanas',
  user: {
    name: 'José Manuel',
    lastName: 'García Rodríguez',
    email: 'jose.driver@rutafacil.com',
    phone: '+52 55 6789 0123'
  }
}
```

#### Vehículos (8 unidades)
- Mercedes Sprinter, Ford Transit, Renault Master, etc.
- Capacidades de 12-25 pasajeros
- Estados de mantenimiento realistas

#### Rutas (5 principales)
- Ruta Norte-Sur, Este-Oeste, Universitaria, Turística, Nocturna
- Códigos únicos y descripciones detalladas
- Distancias y tiempos estimados

#### Paradas (12 estratégicas)
- Ubicaciones reales de CDMX
- Coordenadas GPS precisas
- Facilidades y accesibilidad definidas

## 🚀 Cómo Ejecutar

### Opción 1: Script NPM (Recomendado)
```bash
npm run seed:enhanced
```

### Opción 2: Script de drivers específico
```bash
npm run seed:drivers
```

### Opción 3: Ejecutar directamente
```bash
npx ts-node src/shared/seed/enhanced-seed.ts
```

## 📋 Verificaciones Incluidas

El seed incluye verificaciones automáticas de integridad:

1. **Conteo de relaciones**: Verifica que cada conductor tenga un usuario
2. **Datos de relación**: Muestra la información del usuario asociado a cada conductor
3. **Integridad referencial**: Confirma que todas las foreign keys son válidas

### Ejemplo de salida de verificación:
```
🔍 Verificando relaciones Driver-User...
   Driver 1 -> User: José Manuel García Rodríguez (jose.driver@rutafacil.com)
   Driver 2 -> User: María Elena Pérez Sánchez (maria.driver@rutafacil.com)
   ...

🔍 Verificación de integridad:
   - Drivers en BD: 6
   - Users con rol DRIVER: 6
   - Relación 1:1 verificada: ✅
```

## 🔧 Estructura de Datos

### Relación User-Driver
```prisma
model User {
  id     Int     @id @default(autoincrement())
  name   String
  email  String  @unique
  role   UserRole
  driver Driver? // Relación uno a uno
}

model Driver {
  id               Int      @id @default(autoincrement())
  userId           Int      @unique
  license          String?
  licenseExpiration DateTime?
  experience       String?
  rating           Float?
  totalTrips       Int      @default(0)
  isVerified       Boolean  @default(false)
  user             User     @relation(fields: [userId], references: [id])
}
```

## 🎯 Casos de Uso Cubiertos

1. **Gestión de Conductores**: CRUD completo con relaciones
2. **Asignación de Vehículos**: Conductores asignados a vehículos específicos
3. **Sistema de Notificaciones**: Mensajes dirigidos a conductores
4. **Evaluación de Desempeño**: Ratings y estadísticas de viajes
5. **Gestión de Licencias**: Control de vigencia y verificación

## 🚨 Importante

- **Orden de eliminación**: El seed elimina datos en el orden correcto para evitar conflictos de foreign keys
- **Datos realistas**: Todas las licencias, nombres y ubicaciones son realistas
- **Verificación automática**: Se verifica la integridad al finalizar
- **Logs detallados**: Información completa del proceso de creación

## 🔄 Migración desde Seed Anterior

Si ya tienes datos del seed anterior, el seed mejorado:
1. Limpia todos los datos existentes
2. Crea las nuevas relaciones correctamente
3. Mantiene la compatibilidad con el sistema existente

## 📞 Soporte

Si encuentras problemas:
1. Verifica que las migraciones estén aplicadas: `npx prisma migrate dev`
2. Regenera el cliente Prisma: `npx prisma generate`
3. Revisa los logs de verificación de integridad
4. Confirma que no hay datos residuales: el seed hace limpieza completa

---

**Resultado**: Base de datos completamente poblada con relaciones Driver-User funcionales y datos realistas para pruebas y desarrollo.
