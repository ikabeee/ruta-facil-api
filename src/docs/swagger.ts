import { SwaggerOptions } from 'swagger-ui-express';

const swaggerDefinition: SwaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'Ruta Fácil API',
    version: '1.0.0',
    description: 'API para la aplicación Ruta Fácil - Sistema de Gestión de Rutas de Transporte',
    contact: {
      name: 'Equipo Ruta Fácil',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
  ],
};

export default swaggerDefinition;
