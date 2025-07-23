#!/usr/bin/env node

// Script de diagnóstico para Google OAuth
console.log('🔍 DIAGNÓSTICO DE GOOGLE OAUTH');
console.log('================================');

// Verificar variables de entorno
require('dotenv').config();

console.log('\n📋 VARIABLES DE ENTORNO:');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || '❌ NO CONFIGURADA');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ CONFIGURADA' : '❌ NO CONFIGURADA');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ CONFIGURADA' : '❌ NO CONFIGURADA');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || '❌ NO CONFIGURADA');

console.log('\n🌐 URLS ESPERADAS:');
console.log('Servidor backend: http://localhost:7000');
console.log('Health check: http://localhost:7000/health');
console.log('Google OAuth: http://localhost:7000/api/v1/auth/google');
console.log('Google Callback: http://localhost:7000/api/v1/auth/google/callback');
console.log('Frontend: http://localhost:5173');

console.log('\n📝 INSTRUCCIONES:');
console.log('1. Asegúrate de tener un archivo .env en el directorio raíz');
console.log('2. Configura las variables GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET');
console.log('3. Inicia el servidor con: npm run dev');
console.log('4. Verifica que el servidor esté en el puerto 7000');
console.log('5. Prueba la URL: http://localhost:7000/health');

console.log('\n🔧 SOLUCIÓN RÁPIDA:');
console.log('Si ves "Cannot GET /auth/google", significa que:');
console.log('- El servidor no está corriendo en puerto 7000, O');
console.log('- Las rutas OAuth no se registraron correctamente, O');
console.log('- Falta configurar las variables de entorno de Google');

console.log('\n✅ PRÓXIMOS PASOS:');
console.log('1. Copiar .env.development a .env');
console.log('2. Configurar credenciales de Google Cloud Console');
console.log('3. Reiniciar el servidor backend');
console.log('4. Probar nuevamente el botón de Google');
