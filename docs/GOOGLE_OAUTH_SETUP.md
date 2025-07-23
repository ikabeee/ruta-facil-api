# Configuración de Google OAuth para Ruta Fácil

## Descripción
Esta guía explica cómo configurar y usar la autenticación con Google OAuth en el proyecto Ruta Fácil.

## Características Implementadas

### ✅ Funcionalidades Completadas
- **Autenticación OAuth con Google**: Los usuarios pueden iniciar sesión usando su cuenta de Google
- **Creación automática de usuarios**: Los nuevos usuarios OAuth se crean automáticamente en la base de datos
- **Verificación automática de email**: Los usuarios OAuth tienen su email verificado automáticamente
- **Rol de usuario por defecto**: Nuevos usuarios OAuth obtienen el rol `USER` por defecto
- **Status activo automático**: Los usuarios OAuth se crean con status `ACTIVE`
- **Manejo seguro de contraseñas**: Los usuarios OAuth obtienen una contraseña aleatoria que nunca usarán
- **Tokens JWT**: Generación automática de tokens JWT para usuarios OAuth
- **Cookies de sesión**: Configuración automática de cookies de autenticación
- **Redirección inteligente**: Redirección basada en el rol del usuario después del login
- **Manejo de errores**: Gestión completa de errores OAuth con mensajes específicos

## Configuración

### 1. Variables de Entorno (Backend)
Agregar al archivo `.env`:

```bash
# Configuración de Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:7000/api/v1/auth/google/callback

# URL del frontend para redirecciones
FRONTEND_URL=http://localhost:5173
```

### 2. Variables de Entorno (Frontend)
Agregar al archivo `.env`:

```bash
# API Configuration
VITE_API_URL=http://localhost:7000
```

### 3. Configuración en Google Cloud Console
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto o seleccionar uno existente
3. Habilitar la API de Google+ 
4. Crear credenciales OAuth 2.0:
   - Tipo: Aplicación web
   - URIs de origen autorizados: `http://localhost:5173`, `http://localhost:7000`
   - URIs de redirección autorizados: `http://localhost:7000/api/v1/auth/google/callback`

## Flujo de Autenticación

### 1. Inicio del Proceso
```
Usuario hace clic en "Continuar con Google" → 
Frontend redirige a `/api/v1/auth/google` →
Backend redirige a Google OAuth
```

### 2. Autenticación en Google
```
Usuario se autentica en Google →
Google redirige a `/api/v1/auth/google/callback` →
Backend recibe datos del usuario de Google
```

### 3. Procesamiento del Usuario
```
Backend verifica si el usuario existe →
Si no existe: crea nuevo usuario con email verificado →
Si existe: actualiza información OAuth →
Genera token JWT →
Configura cookies de sesión
```

### 4. Redirección Final
```
Backend redirige a `/auth/callback?token=jwt_token` →
Frontend procesa el token →
Establece datos de autenticación →
Redirige según rol del usuario
```

## Estructura de Archivos

### Backend
```
src/
├── modules/auth/
│   ├── auth.controller.ts         # Maneja googleCallback
│   └── auth.routes.ts            # Define rutas OAuth
├── shared/
│   ├── services/
│   │   └── oauth.service.ts      # Lógica principal OAuth
│   ├── strategies/
│   │   └── google-oauth.strategy.ts # Configuración Passport
│   └── interfaces/
│       └── OAuthStrategy.interface.ts # Tipos TypeScript
```

### Frontend
```
src/
├── shared/components/auth/
│   └── GoogleLoginButton.tsx    # Botón de login con Google
├── views/auth/
│   ├── login/Login.tsx          # Página de login con botón Google
│   └── callback/AuthCallback.tsx # Procesa respuesta OAuth
└── shared/hooks/
    └── useAuth.ts               # Hook de autenticación con setAuthData
```

## Modelo de Datos

### Usuario OAuth en Base de Datos
```typescript
{
  id: number,
  name: string,                    // Desde Google profile
  lastName: string | null,         // Desde Google profile
  email: string,                   // Desde Google profile (único)
  password: string,                // Contraseña aleatoria generada
  role: 'USER',                    // Rol por defecto
  status: 'ACTIVE',                // Status automático
  emailVerified: true,             // Siempre true para OAuth
  authProvider: 'google',          // Proveedor OAuth
  providerId: string,              // ID de Google
  profilePicture: string | null,   // URL de foto de Google
  createdAt: Date,
  updatedAt: Date
}
```

## Casos de Uso

### 1. Nuevo Usuario
- Usuario no existe en la base de datos
- Se crea automáticamente con email verificado
- Obtiene rol `USER` por defecto
- Status `ACTIVE` automático

### 2. Usuario Existente
- Usuario ya existe (mismo email)
- Se actualiza información OAuth si es necesario
- Se mantienen rol y permisos existentes
- Se actualiza foto de perfil si cambió

### 3. Manejo de Errores
- **google_auth_failed**: Error en Google OAuth
- **google_auth_error**: Error en el servidor
- **account_disabled**: Cuenta deshabilitada
- **Token inválido**: Token JWT malformado

## Seguridad

### 1. Validaciones Implementadas
- ✅ Validación de formato de email
- ✅ Validación de presencia de datos obligatorios
- ✅ Validación de formato de token JWT
- ✅ Verificación de status de cuenta activa

### 2. Medidas de Seguridad
- ✅ Contraseñas aleatorias para usuarios OAuth (no reutilizables)
- ✅ Tokens JWT con expiración
- ✅ Cookies HTTP-only para sesiones
- ✅ Validación de dominios permitidos
- ✅ Logs de seguridad para auditoría

## Testing

### Casos de Prueba Recomendados
1. **Login exitoso con Google**
2. **Creación de nuevo usuario OAuth**
3. **Login de usuario OAuth existente**
4. **Manejo de errores de Google**
5. **Validación de tokens inválidos**
6. **Redirección según roles**

### URLs de Prueba Local
- Login: `http://localhost:5173/auth/login`
- Callback: `http://localhost:5173/auth/callback`
- API OAuth: `http://localhost:7000/api/v1/auth/google`

## Troubleshooting

### Errores Comunes
1. **"No se recibió token"**: Verificar configuración de Google Cloud
2. **"Error al procesar"**: Revisar logs del servidor
3. **"Token inválido"**: Verificar JWT_SECRET en variables de entorno
4. **"Cuenta deshabilitada"**: Usuario tiene status diferente a ACTIVE

### Logs Importantes
```bash
# Backend logs
- "Iniciando autenticación con Google..."
- "Callback de Google OAuth recibido"
- "Nuevo usuario OAuth creado: email@domain.com con proveedor google"
- "Usuario OAuth existente actualizado: email@domain.com"
- "Google OAuth exitoso para usuario: email@domain.com"
```

## Próximas Mejoras Sugeridas
- [ ] Implementar refresh tokens para OAuth
- [ ] Agregar soporte para otros proveedores (Facebook, Twitter)
- [ ] Implementar desconexión de cuentas OAuth
- [ ] Agregar más campos de perfil de Google
- [ ] Implementar rate limiting para endpoints OAuth
- [ ] Agregar auditoría completa de eventos OAuth
