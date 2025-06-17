import express from 'express';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import swaggerDefinition from './docs/swagger';

const app = express();

/* 
  * Morgan para logging de solicitudes HTTP 
*/
app.use(morgan('dev'));

/* 
  * Middleware para parsear JSON
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 
  * Documentación de la API
*/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

/* 
  * Información del API
*/
app.get('/', (_req, res) => {
  res.json({
    title: 'Ruta Fácil API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});


export default app;
