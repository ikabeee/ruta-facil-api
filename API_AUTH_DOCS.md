# API de Autenticación - Ruta Fácil

Este documento describe cómo usar la API de autenticación desarrollada para Ruta Fácil.

## Endpoints Disponibles

### 1. Registro de Usuario
**POST** `/api/auth/register`

Registra un nuevo usuario en la plataforma.

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente. Por favor verifica tu correo electrónico.",
  "data": {
    "userId": 1,
    "verificationToken": "uuid-token"
  }
}
```

### 2. Verificación de Correo Electrónico
**GET** `/api/auth/verify-email/:token`

Verifica el correo electrónico del usuario y cambia su estado a ACTIVE.

```bash
curl -X GET http://localhost:3000/api/auth/verify-email/jwt-token-here
```

### 3. Inicio de Sesión (Paso 1)
**POST** `/api/auth/login`

Inicia el proceso de autenticación de dos factores.

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Código OTP enviado a tu correo electrónico",
  "data": {
    "sessionId": "uuid-session-id"
  }
}
```

### 4. Verificación OTP (Paso 2)
**POST** `/api/auth/verify-otp`

Completa el proceso de autenticación verificando el código OTP.

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "uuid-session-id",
    "otp": "123456"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "token": "jwt-token",
    "user": {
      "name": "Juan",
      "lastName": "Pérez",
      "role": "USER",
      "status": "ACTIVE"
    }
  }
}
```

### 5. Solicitar Restablecimiento de Contraseña
**POST** `/api/auth/request-password-reset`

Solicita un enlace para restablecer la contraseña.

```bash
curl -X POST http://localhost:3000/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com"
  }'
```

### 6. Restablecer Contraseña
**POST** `/api/auth/reset-password`

Restablece la contraseña del usuario.

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token",
    "newPassword": "newpassword123"
  }'
```

### 7. Cerrar Sesión
**POST** `/api/auth/logout`

Cierra la sesión del usuario.

```bash
curl -X POST http://localhost:3000/api/auth/logout
```

## Configuración de Variables de Entorno

Para que la API funcione completamente, necesitas configurar las siguientes variables de entorno en tu archivo `.env`:

```env
# Puerto del servidor
PORT=3000

# Configuración de base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/rutafacil?schema=public"

# Configuración de JWT
JWT_SECRET=tu_jwt_secret_aqui

# Configuración de correo electrónico
GMAIL_USER=tu_email@gmail.com
GMAIL_PASS=tu_password_de_aplicacion

# URL del frontend (para enlaces de verificación)
FRONTEND_URL=http://localhost:5173

# Configuración de CORS
CORS_ORIGIN=http://localhost:5173
```

## Cookies de Sesión

Cuando un usuario inicia sesión exitosamente, la API establece una cookie `user_session` que contiene:

- `name`: Nombre del usuario
- `lastName`: Apellido del usuario
- `role`: Rol del usuario (USER, ADMIN, DRIVER, OWNER_VEHICLE)
- `status`: Estado del usuario (ACTIVE, INACTIVE, PENDING, BAN)

Esta cookie se establece como `httpOnly` y `secure` en producción.

## Manejo de Errores

Todos los endpoints devuelven respuestas en el siguiente formato:

**Error:**
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

**Éxito:**
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { /* datos relevantes */ }
}
```

## Arquitectura

El módulo de autenticación sigue los principios SOLID:

- **Single Responsibility**: Cada clase tiene una responsabilidad específica
- **Open/Closed**: Extensible sin modificar código existente
- **Liskov Substitution**: Las implementaciones pueden ser intercambiadas
- **Interface Segregation**: Interfaces específicas para cada funcionalidad
- **Dependency Inversion**: Dependencias inyectadas, no hardcodeadas

### Estructura de Archivos

```
src/
├── modules/
│   └── auth/
│       ├── auth.controller.ts    # Controlador de autenticación
│       ├── auth.service.ts       # Lógica de negocio
│       ├── auth.routes.ts        # Definición de rutas
│       ├── auth.types.ts         # Tipos e interfaces
│       └── auth.validation.ts    # Validaciones
├── shared/
│   ├── services/
│   │   ├── email.service.ts      # Servicio de correo electrónico
│   │   └── otp.service.ts        # Servicio de OTP
│   ├── middleware/
│   │   └── auth.middleware.ts    # Middleware de autenticación
│   └── database/
│       └── prisma.ts             # Cliente de base de datos
└── index.ts                      # Punto de entrada
```