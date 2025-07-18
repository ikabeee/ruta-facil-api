/**
 * Configuración para el seed de datos
 * 
 * Aquí puedes modificar los valores por defecto que se usan
 * en la generación de datos de prueba
 */

export const SEED_CONFIG = {
  // Contraseña por defecto para todos los usuarios
  DEFAULT_PASSWORD: '123456',
  
  // Cantidad de registros a crear
  COUNTS: {
    USERS: {
      ADMINS: 2,
      OWNERS: 3,
      DRIVERS: 4,
      REGULAR: 6
    },
    VEHICLES: 8,
    STOPS: 12,
    ROUTES: 5,
    SCHEDULES_PER_ROUTE: 2,
    INCIDENTS: 8,
    LOCATIONS_PER_VEHICLE: 3,
    STARRED_ROUTES: 6,
    RATINGS: 12,
    NOTIFICATIONS: 15
  },
  
  // Configuración de ubicaciones (Ciudad de México)
  LOCATION: {
    BASE_LAT: 19.4326,
    BASE_LNG: -99.1332,
    VARIATION: 0.2 // Variación en grados para simular ubicaciones cercanas
  },
  
  // Configuración de vehículos
  VEHICLE_MODELS: [
    'Sprinter', 'Transit', 'Master', 'Daily', 
    'Hiace', 'Urvan', 'H1', 'Ducato'
  ],
  
  VEHICLE_COLORS: [
    'Blanco', 'Azul', 'Rojo', 'Gris', 
    'Negro', 'Verde', 'Amarillo', 'Plata'
  ],
  
  PASSENGER_CAPACITIES: [15, 20, 25, 30, 35],
  
  // Configuración de horarios
  OPERATING_HOURS: {
    START: 5, // 5:00 AM
    END: 23,  // 11:00 PM
    MORNING_SHIFT_START: 6,
    AFTERNOON_SHIFT_START: 14,
    SHIFT_DURATION: 8
  },
  
  // Tipos de incidentes
  INCIDENT_TYPES: [
    'Tráfico',
    'Avería mecánica',
    'Accidente menor',
    'Retraso',
    'Vandalismo'
  ],
  
  // Categorías de calificación
  RATING_CATEGORIES: [
    'Puntualidad',
    'Limpieza',
    'Comodidad',
    'Atención al cliente',
    'Seguridad'
  ],
  
  // Tipos de servicio
  SERVICE_TYPES: [
    'Transporte público',
    'Ruta express',
    'Servicio nocturno'
  ],
  
  // Títulos de notificaciones
  NOTIFICATION_TITLES: [
    'Nuevo horario disponible',
    'Retraso en la ruta',
    'Mantenimiento programado',
    'Nueva ruta agregada',
    'Promoción especial'
  ],
  
  // Mensajes de notificaciones
  NOTIFICATION_MESSAGES: [
    'Se ha agregado un nuevo horario para tu ruta favorita',
    'La ruta presenta retrasos debido al tráfico',
    'Mantenimiento programado para el vehículo',
    'Nueva ruta disponible en tu zona',
    'Aprovecha nuestra promoción de temporada'
  ],
  
  // Nombres de rutas
  ROUTE_NAMES: [
    'Ruta Centro-Universidad',
    'Ruta Norte-Sur',
    'Ruta Periférico Oriente',
    'Ruta Aeropuerto Express',
    'Ruta Turística Colonial'
  ],
  
  // Paradas predefinidas con ubicaciones reales de CDMX
  STOP_LOCATIONS: [
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
  ],
  
  // Configuración de rangos para valores aleatorios
  RANGES: {
    DISTANCE_KM: { min: 5, max: 35 },
    ESTIMATED_TIME_MIN: { min: 30, max: 90 },
    TOTAL_STOPS: { min: 4, max: 12 },
    DAILY_TRIPS: { min: 10, max: 30 },
    VEHICLE_YEAR: { min: 2018, max: 2025 },
    FUEL_PERCENTAGE: { min: 60, max: 100 },
    MILEAGE: { min: 10000, max: 60000 },
    DRIVER_EXPERIENCE_YEARS: { min: 2, max: 17 },
    DRIVER_RATING: { min: 3.0, max: 5.0 },
    DRIVER_TOTAL_TRIPS: { min: 50, max: 550 },
    RATING_SCORE: { min: 3.0, max: 5.0 }
  }
}

export default SEED_CONFIG
