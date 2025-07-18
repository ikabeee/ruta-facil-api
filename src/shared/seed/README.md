# Seed de Datos para Ruta Fácil API

Este archivo contiene el seed de datos para poblar la base de datos con información de prueba.

## Contenido del Seed

El seed crea más de **130 registros** distribuidos en las siguientes entidades:

### Usuarios (15 registros)
- **2 Administradores**: Con permisos completos del sistema
- **3 Propietarios de vehículos**: Para gestionar flotas de transporte
- **4 Conductores**: Con licencias y experiencia
- **6 Usuarios regulares**: Pasajeros del sistema

### Datos de Transporte
- **8 Vehículos**: Diferentes modelos, años y capacidades
- **12 Paradas**: Ubicaciones estratégicas en la Ciudad de México
- **5 Rutas**: Conectando diferentes puntos de la ciudad
- **10 Horarios**: Programación matutina y vespertina
- **15+ Relaciones ruta-parada**: Configuración de recorridos

### Datos Operacionales
- **6 Asignaciones de vehículos**: Conductores asignados a rutas
- **8 Incidentes**: Reportes de tráfico, averías y otros eventos
- **20+ Ubicaciones de vehículos**: Simulación de GPS en tiempo real
- **12 Calificaciones**: Evaluaciones de usuarios sobre el servicio
- **15 Notificaciones**: Mensajes para usuarios y conductores
- **6 Rutas favoritas**: Preferencias de usuarios

## Credenciales de Acceso

Todos los usuarios tienen la contraseña: `123456`

### Administradores
- admin@rutafacil.com
- ana.admin@rutafacil.com

### Propietarios de Vehículos
- miguel.owner@rutafacil.com
- laura.owner@rutafacil.com
- roberto.owner@rutafacil.com

### Conductores
- jose.driver@rutafacil.com
- maria.driver@rutafacil.com
- antonio.driver@rutafacil.com
- carmen.driver@rutafacil.com

### Usuarios Regulares
- pedro.user@rutafacil.com
- lucia.user@rutafacil.com
- fernando.user@rutafacil.com
- isabella.user@rutafacil.com
- daniel.user@rutafacil.com
- sofia.user@rutafacil.com (pendiente de verificación)

## Cómo Ejecutar el Seed

### Opción 1: Comando directo
```bash
npm run seed
```

### Opción 2: Comando de Prisma
```bash
npm run db:seed
```

### Opción 3: Comando de Prisma directo
```bash
npx prisma db seed
```

### Opción 4: Con ts-node directamente
```bash
npx ts-node src/shared/seed/seed.ts
```

## Importante

⚠️ **El seed limpia todos los datos existentes antes de insertar los nuevos datos**

Asegúrate de:
1. Tener configurada la variable `DATABASE_URL` en tu archivo `.env`
2. Que la base de datos esté corriendo
3. Haber ejecutado las migraciones con `npx prisma migrate dev`

## Verificar los Datos

Después de ejecutar el seed, puedes verificar los datos usando:

1. **Prisma Studio**:
   ```bash
   npx prisma studio
   ```

2. **Consultas directas a la base de datos**

3. **A través de tu API** haciendo requests a los endpoints correspondientes

## Estructura de Datos Generados

### Ubicaciones (Ciudad de México)
- Terminal Central
- Plaza Universidad  
- Metro Insurgentes
- Mercado San Juan
- Hospital General
- Parque México
- Centro Comercial
- Estadio Azteca
- Aeropuerto CDMX
- Basílica de Guadalupe
- Xochimilco Centro
- Polanco Museo

### Rutas Configuradas
1. **Ruta Centro-Universidad** (RT001)
2. **Ruta Norte-Sur** (RT002)
3. **Ruta Periférico Oriente** (RT003)
4. **Ruta Aeropuerto Express** (RT004)
5. **Ruta Turística Colonial** (RT005)

### Tipos de Incidentes
- Tráfico
- Avería mecánica
- Accidente menor
- Retraso
- Vandalismo

Cada registro contiene datos realistas y coherentes para simular un entorno de producción completo.
