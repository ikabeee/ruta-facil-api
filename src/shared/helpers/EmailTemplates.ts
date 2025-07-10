export class EmailTemplates {
    
    /**
     * Plantilla base para todos los correos
     */
    private static baseTemplate(content: string): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ruta Fácil</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #3498db;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        background-color: #f8f9fa;
                        padding: 30px;
                        border-radius: 0 0 5px 5px;
                    }
                    .button {
                        background-color: #3498db;
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        color: #7f8c8d;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Ruta Fácil</h1>
                </div>
                <div class="content">
                    ${content}
                </div>
                <div class="footer">
                    <p>© 2025 Ruta Fácil. Todos los derechos reservados.</p>
                    <p>Este es un correo automático, por favor no responder.</p>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Plantilla para correo de bienvenida
     */
    public static welcomeTemplate(userName: string): string {
        const content = `
            <h2>¡Bienvenido, ${userName}!</h2>
            <p>Gracias por registrarte en Ruta Fácil. Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>¿Qué puedes hacer con Ruta Fácil?</h3>
                <ul>
                    <li><strong>Encontrar rutas optimizadas:</strong> Descubre las mejores rutas de transporte público</li>
                    <li><strong>Planificar viajes:</strong> Organiza tus traslados de manera eficiente</li>
                    <li><strong>Información en tiempo real:</strong> Accede a datos actualizados sobre el transporte</li>
                    <li><strong>Compartir rutas:</strong> Comparte tus rutas favoritas con otros usuarios</li>
                </ul>
            </div>
            
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
            <p><strong>¡Que tengas un excelente viaje!</strong></p>
        `;
        
        return this.baseTemplate(content);
    }

    /**
     * Plantilla para restablecimiento de contraseña
     */
    public static passwordResetTemplate(resetUrl: string): string {
        const content = `
            <h2>Restablecimiento de Contraseña</h2>
            <p>Hemos recibido una solicitud para restablecer tu contraseña en Ruta Fácil.</p>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>⚠️ Importante:</strong> Si no solicitaste este cambio, puedes ignorar este correo.
            </div>
            
            <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px;">
                <strong>Nota de seguridad:</strong> Este enlace expirará en 1 hora por tu seguridad.
            </p>
            
            <p style="color: #7f8c8d; font-size: 14px;">
                Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:<br>
                <code>${resetUrl}</code>
            </p>
        `;
        
        return this.baseTemplate(content);
    }

    /**
     * Plantilla para notificaciones de rutas
     */
    public static routeNotificationTemplate(message: string, routeName?: string): string {
        const content = `
            <h2>Notificación de Ruta</h2>
            ${routeName ? `<p><strong>Ruta:</strong> ${routeName}</p>` : ''}
            
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db;">
                ${message}
            </div>
            
            <p>Mantente al día con las últimas actualizaciones de tu ruta favorita.</p>
        `;
        
        return this.baseTemplate(content);
    }

    /**
     * Plantilla para verificación de email
     */
    public static emailVerificationTemplate(verificationUrl: string): string {
        const content = `
            <h2>Verificación de Correo Electrónico</h2>
            <p>¡Estás a un paso de completar tu registro en Ruta Fácil!</p>
            
            <p>Para verificar tu correo electrónico y activar tu cuenta, haz clic en el siguiente botón:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verificar Correo</a>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px;">
                Si no creaste una cuenta en Ruta Fácil, puedes ignorar este correo.
            </p>
        `;
        
        return this.baseTemplate(content);
    }
}
