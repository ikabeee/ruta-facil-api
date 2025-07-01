import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './modules/users/user.routes';
import routesRoutes from './modules/routes/route.routes';
import ratingsRoutes from './modules/ratings/rating.routes';
import starredRoutes from './modules/starred-route/starred-route.routes';
import stopRoutes from './modules/stops/stop.routes';

const app = express();
/* Middlewares */
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
/* */

/* Rutas */
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/routes', routesRoutes);
app.use('/api/v1/ratings', ratingsRoutes);
app.use('/api/v1/starred-routes', starredRoutes);
app.use('/api/v1/stops', stopRoutes);

/* */
dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});