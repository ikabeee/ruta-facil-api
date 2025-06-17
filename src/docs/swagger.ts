import { SwaggerOptions } from 'swagger-ui-express';

const swaggerDefinition: SwaggerOptions = {
    openapi: '3.0.0',
    info: {
        title: 'Ruta Fácil API',
        version: '1.0.0',
        description: 'API para la aplicación Ruta Fácil - Sistema de Gestión de Rutas de Transporte',
        contact: {
            name: 'Instituto Tecnológico Superior de Huauchinango',
        },
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3000}/api`,
            description: 'Servidor de desarrollo',
        },
    ],
};

export default swaggerDefinition;
