import swaggerJSDoc from 'swagger-jsdoc';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT;

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ruta Fácil API',
            version: '1.0.0',
            description: 'API para la gestión de rutas de transporte público',
            contact: {
                name: 'Ruta Fácil Team',
                email: 'support@rutafacil.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api/v1`,
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'auth_token'
                }
            },
            schemas: {
                // Schemas comunes
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Indica si la operación fue exitosa'
                        },
                        message: {
                            type: 'string',
                            description: 'Mensaje descriptivo de la respuesta'
                        },
                        data: {
                            type: 'object',
                            description: 'Datos de respuesta'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha y hora de la respuesta'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            description: 'Mensaje de error'
                        },
                        statusCode: {
                            type: 'integer',
                            description: 'Código de estado HTTP'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                // Auth schemas
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único del usuario'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del usuario'
                        },
                        lastName: {
                            type: 'string',
                            description: 'Apellido del usuario'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Correo electrónico'
                        },
                        phone: {
                            type: 'string',
                            description: 'Número de teléfono'
                        },
                        role: {
                            type: 'string',
                            enum: ['USER', 'ADMIN', 'DRIVER', 'OWNER'],
                            description: 'Rol del usuario'
                        },
                        emailVerified: {
                            type: 'boolean',
                            description: 'Indica si el email está verificado'
                        },
                        status: {
                            type: 'string',
                            enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
                            description: 'Estado del usuario'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                // Route schemas
                Route: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único de la ruta'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre de la ruta'
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción de la ruta'
                        },
                        origin: {
                            type: 'string',
                            description: 'Punto de origen'
                        },
                        destination: {
                            type: 'string',
                            description: 'Punto de destino'
                        },
                        distance: {
                            type: 'number',
                            description: 'Distancia en kilómetros'
                        },
                        estimatedTime: {
                            type: 'integer',
                            description: 'Tiempo estimado en minutos'
                        },
                        price: {
                            type: 'number',
                            description: 'Precio del viaje'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Indica si la ruta está activa'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                // Vehicle schemas
                Vehicle: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único del vehículo'
                        },
                        licensePlate: {
                            type: 'string',
                            description: 'Placa del vehículo'
                        },
                        brand: {
                            type: 'string',
                            description: 'Marca del vehículo'
                        },
                        model: {
                            type: 'string',
                            description: 'Modelo del vehículo'
                        },
                        year: {
                            type: 'integer',
                            description: 'Año del vehículo'
                        },
                        capacity: {
                            type: 'integer',
                            description: 'Capacidad de pasajeros'
                        },
                        color: {
                            type: 'string',
                            description: 'Color del vehículo'
                        },
                        type: {
                            type: 'string',
                            enum: ['BUS', 'MINIBUS', 'VAN', 'TAXI'],
                            description: 'Tipo de vehículo'
                        },
                        status: {
                            type: 'string',
                            enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'],
                            description: 'Estado del vehículo'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                // Stop schemas
                Stop: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único de la parada'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre de la parada'
                        },
                        address: {
                            type: 'string',
                            description: 'Dirección de la parada'
                        },
                        latitude: {
                            type: 'number',
                            description: 'Latitud de la parada'
                        },
                        longitude: {
                            type: 'number',
                            description: 'Longitud de la parada'
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción de la parada'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Indica si la parada está activa'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                // Rating schemas
                Rating: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único de la calificación'
                        },
                        userId: {
                            type: 'integer',
                            description: 'ID del usuario que califica'
                        },
                        driverId: {
                            type: 'integer',
                            description: 'ID del conductor calificado'
                        },
                        routeId: {
                            type: 'integer',
                            description: 'ID de la ruta calificada'
                        },
                        rating: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 5,
                            description: 'Puntuación de 1 a 5'
                        },
                        comment: {
                            type: 'string',
                            description: 'Comentario opcional'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                // Driver schemas
                Driver: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único del conductor'
                        },
                        userId: {
                            type: 'integer',
                            description: 'ID del usuario asociado'
                        },
                        licenseNumber: {
                            type: 'string',
                            description: 'Número de licencia de conducir'
                        },
                        licenseExpiry: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de vencimiento de la licencia'
                        },
                        experienceYears: {
                            type: 'integer',
                            description: 'Años de experiencia'
                        },
                        rating: {
                            type: 'number',
                            description: 'Calificación promedio'
                        },
                        totalTrips: {
                            type: 'integer',
                            description: 'Total de viajes realizados'
                        },
                        status: {
                            type: 'string',
                            enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
                            description: 'Estado del conductor'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                // Notification schemas
                Notification: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único de la notificación'
                        },
                        userId: {
                            type: 'integer',
                            description: 'ID del usuario destinatario'
                        },
                        title: {
                            type: 'string',
                            description: 'Título de la notificación'
                        },
                        message: {
                            type: 'string',
                            description: 'Mensaje de la notificación'
                        },
                        type: {
                            type: 'string',
                            enum: ['INFO', 'WARNING', 'ERROR', 'SUCCESS'],
                            description: 'Tipo de notificación'
                        },
                        isRead: {
                            type: 'boolean',
                            description: 'Indica si fue leída'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            },
            {
                cookieAuth: []
            }
        ]
    },
    apis: [
        './src/modules/**/*.controller.ts',
        './src/modules/**/*.routes.ts',
        './src/modules/**/*.dto.ts'
    ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Application): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Ruta Fácil API Documentation'
    }));
    
    // Endpoint para obtener la especificación JSON
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};
