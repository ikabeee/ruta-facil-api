/* Dependencias */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';
/* Archivos de configuración */
dotenv.config();
import { corsConfig } from './shared/config/corsConfig';
/* Rutas */
import userRoutes from './modules/users/user.routes';
import driverRoutes from './modules/drivers/driver.routes';
import routesRoutes from './modules/routes/route.routes';
import ratingsRoutes from './modules/ratings/rating.routes';
import starredRoutes from './modules/starred-route/starred-route.routes';
import stopRoutes from './modules/stops/stop.routes';
import routeStopRoutes from './modules/route-stop/route-stop.routes';
import vehicleRoutes from './modules/vehicle/vehicle.routes';
import vehicleLocationRoutes from './modules/vehicle-location/vehicle-location.routes';
import vehicleAssignmentRoutes from './modules/vehicle-assigment/vehicle-assigment.routes';
import notificationRoutes from './modules/notification/notification.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import incidentsRoutes from './modules/incidents/incidents.routes';
import scheduleRoutes from './modules/schedules/schedule.routes';
import { authRoutes } from './modules/auth/auth.routes';
// Usar archivos JavaScript para evitar problemas de TypeScript
const publicRouteRoutes = require('./modules/routes/public-route-minimal.js');
const routeTrackingPublic = require('./modules/routes/public-route-tracking.js');
const locationRoutes = require('./modules/location/public-location-minimal.js');
const starredRoutesPublic = require('./modules/starred-route/public-starred-route-minimal.js');
const incidentsPublic = require('./modules/incidents/public-incidents-minimal.js');
const trackingPublic = require('./modules/tracking/public-tracking.js');
const { routeTracker } = require('./modules/tracking/websocket-tracker.js');
import { setupSwagger } from './shared/config/swagger.config';

const app = express();

/* Middlewares */
app.use(cors(corsConfig));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser()); // Middleware para parsear cookies
app.use(passport.initialize());
/* */

/* Rutas */
console.log('🔗 Registrando rutas de autenticación...');
app.use('/api/v1/auth', authRoutes);
console.log('✅ Rutas de auth registradas en /api/v1/auth');

app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/incidents', incidentsRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/routes', routesRoutes);
app.use('/api/v1/ratings', ratingsRoutes);
app.use('/api/v1/starred-routes', starredRoutes);
app.use('/api/v1/stops', stopRoutes);
app.use('/api/v1/route-stops', routeStopRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/vehicle-locations', vehicleLocationRoutes);
app.use('/api/v1/vehicle-assignments', vehicleAssignmentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/schedules', scheduleRoutes);

// Rutas públicas sin autenticación para desarrollo
console.log('🔗 Registrando rutas públicas...');
app.use('/api/v1/public/routes', publicRouteRoutes);
console.log('✅ Rutas públicas de routes registradas en /api/v1/public/routes');
app.use('/api/v1/public/route-tracking', routeTrackingPublic);
console.log('✅ Rutas públicas de route-tracking registradas en /api/v1/public/route-tracking');
app.use('/api/v1/public/location', locationRoutes);
console.log('✅ Rutas públicas de location registradas en /api/v1/public/location');
app.use('/api/v1/public/starred-routes', starredRoutesPublic);
console.log('✅ Rutas públicas de starred-routes registradas en /api/v1/public/starred-routes');
app.use('/api/v1/public/incidents', incidentsPublic);
console.log('✅ Rutas públicas de incidents registradas en /api/v1/public/incidents');
app.use('/api/v1/public/tracking', trackingPublic);
console.log('✅ Rutas públicas de tracking registradas en /api/v1/public/tracking');
/* */

// Configurar Swagger
setupSwagger(app);

// Ruta de debug para verificar que el servidor esté funcionando
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        routes: {
            auth: '/api/v1/auth',
            googleOAuth: '/api/v1/auth/google',
            googleCallback: '/api/v1/auth/google/callback'
        }
    });
});

dotenv.config();
const PORT = Number(process.env.PORT) || 7000; // Convertir a número

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 El servidor está corriendo en el puerto: ${PORT}`);
    console.log(`📚 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
    console.log(`🔍 Health check disponible en: http://localhost:${PORT}/health`);
    console.log(`🔐 Google OAuth disponible en: http://localhost:${PORT}/api/v1/auth/google`);
    console.log(`🌐 Frontend URL configurada: ${process.env.FRONTEND_URL}`);
    console.log(`🌐 Servidor accesible desde: http://192.168.1.74:${PORT}`);
    console.log(`🌐 Endpoints públicos disponibles:`);
    console.log(`   📍 Location: http://192.168.1.74:${PORT}/api/v1/public/location/current`);
    console.log(`   🚌 Routes: http://192.168.1.74:${PORT}/api/v1/public/routes`);
    console.log(`   🔍 Search: http://192.168.1.74:${PORT}/api/v1/public/routes/search`);
    console.log(`   📍 Route Tracking: http://192.168.1.74:${PORT}/api/v1/public/route-tracking/1`);
    console.log(`   🚐 Vehicle Tracking: http://192.168.1.74:${PORT}/api/v1/public/route-tracking/1/vehicles`);
    console.log(`   ⭐ Favorites: http://192.168.1.74:${PORT}/api/v1/public/starred-routes`);
    console.log(`   🚨 Incidents: http://192.168.1.74:${PORT}/api/v1/public/incidents`);
    console.log(`   📍 Tracking: http://192.168.1.74:${PORT}/api/v1/public/tracking`);
    
    // Inicializar WebSocket para seguimiento en tiempo real
    console.log('🔌 Iniciando WebSocket para seguimiento de rutas...');
    routeTracker.startTracking(server);
    console.log(`🔌 WebSocket disponible en: ws://192.168.1.74:${PORT}/ws/route-tracking`);
});