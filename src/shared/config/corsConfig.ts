export const corsConfig = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Permitir peticiones sin origin (como aplicaciones móviles o Postman)
        if (!origin) return callback(null, true);
        
        // Lista de orígenes permitidos
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
            'http://127.0.0.1:3000',
            process.env.CORS_ORIGIN,
            process.env.FRONTEND_URL
        ].filter(Boolean); // Filtrar valores undefined/null
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS: Origen no permitido: ${origin}`);
            callback(new Error('No permitido por CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cache-Control',
        'X-File-Name'
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
    optionsSuccessStatus: 200, // Para soportar navegadores legacy
    preflightContinue: false
};