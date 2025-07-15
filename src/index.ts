/* Dependencias */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
/* Archivos de configuración */
dotenv.config();
import { corsConfig } from './shared/config/corsConfig';
/* Rutas */
import userRoutes from './modules/users/user.routes';
import routesRoutes from './modules/routes/route.routes';
import ratingsRoutes from './modules/ratings/rating.routes';
import starredRoutes from './modules/starred-route/starred-route.routes';
import stopRoutes from './modules/stops/stop.routes';
import routeStopRoutes from './modules/route-stop/route-stop.routes';
import vehicleRoutes from './modules/vehicle/vehicle.routes';
import vehicleLocationRoutes from './modules/vehicle-location/vehicle-location.routes';
import vehicleAssignmentRoutes from './modules/vehicle-assigment/vehicle-assigment.routes';
import ownerVehicleRoutes from './modules/owner-vehicle/owner-vehicle.routes';
import driverRoutes from './modules/driver/driver.routes';
import notificationRoutes from './modules/notification/notification.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import incidentsRoutes from './modules/incidents/incidents.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { setupSwagger } from './shared/config/swagger.config';

const app = express();

/* Middlewares */
app.use(cors(corsConfig));
app.use(morgan('dev'));
app.use(express.json());
/* */

/* Rutas */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/incidents', incidentsRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/routes', routesRoutes);
app.use('/api/v1/ratings', ratingsRoutes);
app.use('/api/v1/starred-routes', starredRoutes);
app.use('/api/v1/stops', stopRoutes);
app.use('/api/v1/route-stops', routeStopRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/vehicle-locations', vehicleLocationRoutes);
app.use('/api/v1/vehicle-assignments', vehicleAssignmentRoutes);
app.use('/api/v1/owner-vehicles', ownerVehicleRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/notifications', notificationRoutes);
/* */

// Configurar Swagger
setupSwagger(app);

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto: ${PORT}`);
    console.log(`Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
});