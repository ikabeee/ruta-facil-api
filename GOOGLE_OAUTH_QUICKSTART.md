# 🚀 Configuración Rápida de Google OAuth

## ⚡ Pasos para Activar el Inicio de Sesión con Google

### 1. 📋 Copiar Variables de Entorno
```bash
# En el backend (ruta-facil-api)
cp .env.example .env

# En el frontend (ruta-facil-web) - si no tienes .env
echo "VITE_API_URL=http://localhost:7000" > .env
```

### 2. 🔧 Configurar Google Cloud Console

#### A. Crear Proyecto
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear nuevo proyecto o seleccionar existente
3. Nombre sugerido: "Ruta Fácil OAuth"

#### B. Habilitar APIs
1. Ir a "APIs y servicios" → "Biblioteca"
2. Buscar "Google+ API" → Habilitar
3. Buscar "People API" → Habilitar (opcional pero recomendado)

#### C. Crear Credenciales OAuth 2.0
1. Ir a "APIs y servicios" → "Credenciales"
2. Clic en "Crear credenciales" → "ID de cliente OAuth 2.0"
3. Configurar pantalla de consentimiento:
   - Tipo: Externa
   - Nombre: "Ruta Fácil"
   - Email de soporte: tu_email@gmail.com
   - Dominios autorizados: `localhost`

#### D. Configurar Cliente OAuth
```
Tipo de aplicación: Aplicación web
Nombre: Ruta Fácil Web App

URIs de origen autorizados:
- http://localhost:5173
- http://localhost:7000

URIs de redirección autorizados:
- http://localhost:7000/api/v1/auth/google/callback
```

#### E. Copiar Credenciales
1. Copiar "ID de cliente" → pegar en `GOOGLE_CLIENT_ID`
2. Copiar "Secreto de cliente" → pegar en `GOOGLE_CLIENT_SECRET`

### 3. 📝 Actualizar archivo .env (Backend)
```bash
# Reemplazar con tus valores reales
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu_secreto_aqui
GOOGLE_CALLBACK_URL=http://localhost:7000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### 4. 🚀 Iniciar Aplicación
```bash
# Terminal 1 - Backend
cd ruta-facil-api
npm run dev

# Terminal 2 - Frontend  
cd ruta-facil-web
npm run dev
```

### 5. ✅ Probar OAuth
1. Ir a `http://localhost:5173/auth/login`
2. Clic en "Continuar con Google"
3. Seleccionar cuenta Google
4. ¡Debería redirigir al dashboard!

## 🎯 ¿Qué Sucede Automáticamente?

### ✨ Para Usuarios Nuevos:
- ✅ Se crea cuenta automáticamente
- ✅ Email verificado instantáneamente  
- ✅ Rol: `USER` por defecto
- ✅ Estado: `ACTIVE` 
- ✅ Foto de perfil de Google
- ✅ Login automático

### 🔄 Para Usuarios Existentes:
- ✅ Actualiza info de Google si cambió
- ✅ Mantiene rol y permisos actuales
- ✅ Login automático

## 🐛 Solución de Problemas

### Error: "No se recibió token"
```bash
# Verificar que las URLs coincidan exactamente
GOOGLE_CALLBACK_URL=http://localhost:7000/api/v1/auth/google/callback
# NO usar https:// en desarrollo local
```

### Error: "redirect_uri_mismatch"
1. Verificar URIs en Google Cloud Console
2. Deben coincidir exactamente (sin slash final)
3. Verificar protocolo (http vs https)

### Error: "access_denied"
- Usuario canceló el proceso
- Verificar configuración de pantalla de consentimiento

### Frontend no conecta con Backend
```bash
# Verificar en ruta-facil-web/.env
VITE_API_URL=http://localhost:7000
```

## 📱 Flujo Visual

```
[Login Page] 
    ↓ Click "Continuar con Google"
[Google OAuth] 
    ↓ Usuario autoriza
[Backend procesa] 
    ↓ Crea/actualiza usuario
[Redirect con token] 
    ↓ Frontend recibe token
[Dashboard según rol]
```

## 🎨 Personalización

### Cambiar Texto del Botón
```tsx
// En GoogleLoginButton.tsx
{loading || isLoading ? 'Iniciando sesión...' : 'Tu texto aquí'}
```

### Agregar más Scopes de Google
```typescript
// En auth.routes.ts
scope: ['profile', 'email', 'openid']
```

### Modificar Redirección por Rol
```typescript
// En AuthCallback.tsx
switch (payload.role) {
  case 'ADMIN': navigate('/admin/dashboard'); break;
  case 'DRIVER': navigate('/driver/dashboard'); break;
  // Agregar más casos...
}
```

---

## 🆘 ¿Necesitas Ayuda?

### 1. Revisar Logs
```bash
# Backend - ver logs en consola
npm run dev

# Buscar mensajes como:
# "Iniciando autenticación con Google..."
# "Google OAuth exitoso para usuario: email@domain.com"
```

### 2. Verificar Base de Datos
```sql
-- Ver usuarios OAuth creados
SELECT id, name, email, "authProvider", "emailVerified", status 
FROM users 
WHERE "authProvider" = 'google';
```

### 3. URLs de Prueba
- Frontend: http://localhost:5173/auth/login
- Backend Health: http://localhost:7000/api/v1/auth/check
- OAuth Start: http://localhost:7000/api/v1/auth/google

¡Listo! 🎉 El inicio de sesión con Google ya está funcionando.
