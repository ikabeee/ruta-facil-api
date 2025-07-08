# Servicio de Correo - Ruta Fácil

Este servicio implementa el envío de correos electrónicos usando nodemailer siguiendo los principios SOLID.

## Estructura del Servicio

### Principios SOLID Aplicados

1. **Single Responsibility Principle (SRP)**: Cada clase tiene una única responsabilidad
   - `MailService`: Gestiona el envío de correos
   - `GmailConfig`: Configura el transporter de Gmail
   - `EmailTemplates`: Gestiona las plantillas de correo

2. **Open/Closed Principle (OCP)**: El sistema es extensible sin modificar código existente
   - Fácil agregar nuevos tipos de correo
   - Fácil agregar nuevos proveedores de correo

3. **Liskov Substitution Principle (LSP)**: Las implementaciones pueden ser sustituidas
   - Cualquier implementación de `IMailService` puede ser usada
   - Cualquier implementación de `MailTransporter` puede ser usada

4. **Interface Segregation Principle (ISP)**: Interfaces específicas y cohesivas
   - Interfaces separadas para cada responsabilidad
   - No hay métodos innecesarios en las interfaces

5. **Dependency Inversion Principle (DIP)**: Dependencias por abstracción
   - `MailService` depende de `IMailService` y `MailTransporter`
   - No depende de implementaciones concretas

## Configuración

### Variables de Entorno

```env
# Gmail configuration
GMAIL_USER=tu_email@gmail.com
GMAIL_PASS=tu_app_password_de_gmail
DEFAULT_FROM_EMAIL=noreply@rutafacil.com

# Frontend URL (para enlaces en correos)
FRONTEND_URL=http://localhost:3000
```

### Configuración de Gmail

1. Habilita la autenticación de dos factores en tu cuenta de Gmail
2. Genera una contraseña de aplicación:
   - Ve a tu cuenta de Google
   - Seguridad → Contraseñas de aplicaciones
   - Genera una nueva contraseña para "Correo"
3. Usa esta contraseña en `GMAIL_PASS`

## Uso del Servicio

### Inicialización

```typescript
import { MailService } from './shared/services/mail.service';

// Usando la configuración por defecto (Gmail)
const mailService = new MailService();

// O inyectando una configuración personalizada
const customTransporter = new CustomMailTransporter();
const mailService = new MailService(customTransporter);
```

### Métodos Disponibles

#### 1. Envío de Correo Básico

```typescript
const result = await mailService.sendMail({
    to: 'usuario@example.com',
    subject: 'Título del correo',
    html: '<p>Contenido del correo</p>'
});
```

#### 2. Correo de Bienvenida

```typescript
const result = await mailService.sendWelcomeEmail(
    'usuario@example.com',
    'Juan Pérez'
);
```

#### 3. Restablecimiento de Contraseña

```typescript
const result = await mailService.sendPasswordResetEmail(
    'usuario@example.com',
    'token-de-reset'
);
```

#### 4. Verificación de Email

```typescript
const result = await mailService.sendEmailVerification(
    'usuario@example.com',
    'token-de-verificacion'
);
```

#### 5. Correos en Lote

```typescript
const emails = [
    { to: 'user1@example.com', subject: 'Título', html: '<p>Contenido</p>' },
    { to: 'user2@example.com', subject: 'Título', html: '<p>Contenido</p>' }
];

const results = await mailService.sendBulkEmails(emails);
```

#### 6. Verificación de Conexión

```typescript
const isConnected = await mailService.verifyConnection();
```

## Plantillas de Correo

Las plantillas están centralizadas en `EmailTemplates.ts`:

- `welcomeTemplate()`: Plantilla de bienvenida
- `passwordResetTemplate()`: Plantilla de restablecimiento
- `emailVerificationTemplate()`: Plantilla de verificación
- `routeNotificationTemplate()`: Plantilla de notificaciones

### Personalización de Plantillas

```typescript
// Ejemplo de plantilla personalizada
const customTemplate = EmailTemplates.baseTemplate(`
    <h2>Mi Contenido Personalizado</h2>
    <p>Contenido específico aquí</p>
`);
```

## Manejo de Errores

El servicio devuelve un objeto `MailResult`:

```typescript
interface MailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}
```

Ejemplo de manejo:

```typescript
const result = await mailService.sendWelcomeEmail(email, name);

if (result.success) {
    console.log('Correo enviado:', result.messageId);
} else {
    console.error('Error:', result.error);
}
```

## Extensibilidad

### Agregar Nuevo Proveedor de Correo

1. Crear nueva implementación de `MailTransporter`:

```typescript
export class OutlookConfig implements MailTransporter {
    createTransporter(): Transporter {
        return nodemailer.createTransporter({
            service: 'hotmail',
            auth: {
                user: process.env.OUTLOOK_USER,
                pass: process.env.OUTLOOK_PASS
            }
        });
    }
}
```

2. Agregar al factory:

```typescript
export class ConfigMailFactory {
    public static createOutlookTransporter(): MailTransporter {
        return new OutlookConfig(config);
    }
}
```

### Agregar Nuevos Tipos de Correo

1. Agregar método a `IMailService`:

```typescript
export interface IMailService {
    // ... métodos existentes
    sendPromotionalEmail(to: string, promoCode: string): Promise<MailResult>;
}
```

2. Implementar en `MailService`:

```typescript
public async sendPromotionalEmail(to: string, promoCode: string): Promise<MailResult> {
    const html = EmailTemplates.promotionalTemplate(promoCode);
    return this.sendMail({ to, subject: 'Oferta Especial', html });
}
```

## Mejores Prácticas

1. **Siempre verificar la conexión** antes de enviar correos importantes
2. **Usar templates** para mantener consistencia visual
3. **Manejar errores** apropiadamente
4. **Loguear resultados** para debugging
5. **Validar emails** antes de enviar
6. **Usar rate limiting** para evitar spam

## Testing

Para probar el servicio, puedes usar el archivo de ejemplo:

```typescript
import { sendWelcomeEmailExample } from './shared/examples/mail.service.example';

// Probar envío de correo
await sendWelcomeEmailExample();
```

## Troubleshooting

### Error: "Username and Password not accepted"

- Verifica que estés usando una contraseña de aplicación
- Asegúrate de que la autenticación de dos factores esté habilitada

### Error: "Connection timeout"

- Verifica tu conexión a internet
- Comprueba que el firewall no bloquee el puerto 587

### Error: "Invalid recipients"

- Verifica que los emails sean válidos
- Asegúrate de que no haya espacios en blanco

### Error: "Daily sending quota exceeded"

- Gmail tiene límites diarios (500 correos/día para cuentas gratuitas)
- Considera usar un servicio de correo profesional para mayor volumen
