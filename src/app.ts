import express from 'express';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import swaggerDefinition from './docs/swagger';

const app = express();

// Configurar morgan para logging
app.use(morgan('dev'));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

// Ruta raíz con información de la API
app.get('/', (_req, res) => {
  res.json({
    title: 'Ruta Fácil API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// Aquí irán las demás rutas de la aplicación...

export default app;
