# Ruta Fácil API

API backend para la plataforma Ruta Fácil - Sistema de gestión de rutas de transporte público.

## 🚀 Características

### Módulo de Autenticación
- ✅ Registro de usuarios con verificación por correo electrónico
- ✅ Autenticación de dos factores (2FA) con código OTP
- ✅ Restablecimiento de contraseña seguro
- ✅ Gestión de sesiones con JWT y cookies
- ✅ Validación de entrada y manejo de errores
- ✅ Rate limiting para seguridad

## 🏗️ Arquitectura

El proyecto sigue los principios SOLID y una arquitectura modular:

```
src/
├── modules/
│   └── auth/                    # Módulo de autenticación
│       ├── auth.controller.ts   # Controlador HTTP
│       ├── auth.service.ts      # Lógica de negocio
│       ├── auth.routes.ts       # Definición de rutas
│       ├── auth.types.ts        # Tipos e interfaces
│       └── auth.validation.ts   # Validaciones de entrada
├── shared/
│   ├── services/
│   │   ├── email.service.ts     # Servicio de correo electrónico
│   │   └── otp.service.ts       # Servicio de códigos OTP
│   ├── middleware/
│   │   └── auth.middleware.ts   # Middleware de autenticación
│   ├── database/
│   │   └── prisma.ts           # Cliente de base de datos
│   └── constants/
│       └── corsConfig.ts       # Configuración CORS
└── index.ts                    # Punto de entrada de la aplicación
```

## 🛠️ Tecnologías

- **Runtime**: Node.js con TypeScript
- **Framework**: Express.js 4.x
- **Base de datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT + Cookies HTTP-only
- **Correo electrónico**: Nodemailer (Gmail)
- **Validación**: Validaciones personalizadas
- **Seguridad**: bcrypt, rate limiting, CORS

## 📋 Requisitos Previos

- Node.js 16+ 
- PostgreSQL
- npm o yarn

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/ikabeee/ruta-facil-api.git
   cd ruta-facil-api
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```env
   # Server
   PORT=3000
   NODE_ENV=development
   
   # Database
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/rutafacil"
   
   # JWT
   JWT_SECRET=tu_jwt_secret_muy_seguro
   
   # Email (Gmail)
   GMAIL_USER=tu_email@gmail.com
   GMAIL_PASS=tu_contraseña_de_aplicacion
   
   # Frontend
   FRONTEND_URL=http://localhost:5173
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Configurar la base de datos**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Compilar el proyecto**
   ```bash
   npm run build
   ```

6. **Iniciar el servidor**
   ```bash
   npm start
   ```

   El servidor estará disponible en `http://localhost:3000`

## 📚 Documentación de la API

### Endpoints de Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Registro de usuario |
| `GET` | `/api/auth/verify-email/:token` | Verificación de correo |
| `POST` | `/api/auth/login` | Inicio de sesión (paso 1) |
| `POST` | `/api/auth/verify-otp` | Verificación OTP (paso 2) |
| `POST` | `/api/auth/request-password-reset` | Solicitar restablecimiento |
| `POST` | `/api/auth/reset-password` | Restablecer contraseña |
| `POST` | `/api/auth/logout` | Cerrar sesión |

### Otros Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Estado de la API |

Para documentación detallada, consulta: [API_AUTH_DOCS.md](./API_AUTH_DOCS.md)

## 🧪 Testing

1. **Iniciar el servidor**
   ```bash
   npm start
   ```

2. **Ejecutar pruebas básicas**
   ```bash
   ./test-auth-api.sh
   ```

   O probar manualmente:
   ```bash
   # Verificar estado de la API
   curl http://localhost:3000/health
   
   # Registrar usuario
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Juan","email":"juan@example.com","password":"password123"}'
   ```

## 📄 Scripts Disponibles

- `npm start` - Iniciar servidor en modo desarrollo
- `npm run build` - Compilar TypeScript
- `npm test` - Ejecutar pruebas (placeholder)

## 🌍 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://...` |
| `JWT_SECRET` | Clave secreta para JWT | `mi_secreto_super_seguro` |
| `GMAIL_USER` | Email de Gmail para envíos | `email@gmail.com` |
| `GMAIL_PASS` | Contraseña de aplicación de Gmail | `contraseña_app` |
| `FRONTEND_URL` | URL del frontend | `http://localhost:5173` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:5173` |
| `NODE_ENV` | Entorno de ejecución | `development/production` |

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- El proyecto usa una implementación mock de Prisma para desarrollo cuando no se puede conectar a la base de datos
- Para producción, asegúrate de configurar variables de entorno reales
- Los tokens JWT expiran en 24 horas
- Los códigos OTP expiran en 5 minutos
- Los enlaces de verificación expiran en 24 horas
- Los enlaces de restablecimiento expiran en 1 hora

## 📞 Soporte

Para soporte y dudas, abre un issue en el repositorio.

## 📋 TODO

- [ ] Implementar tests unitarios
- [ ] Agregar documentación OpenAPI/Swagger
- [ ] Implementar logging estructurado
- [ ] Agregar monitoreo de salud
- [ ] Implementar refresh tokens
- [ ] Agregar soporte para múltiples proveedores de email