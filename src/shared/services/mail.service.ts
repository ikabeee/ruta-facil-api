import { Transporter } from 'nodemailer';
import { MailTransporter } from '../interfaces/mail/MailTransporter.interface';
import { IMailService } from '../interfaces/mail/IMailService.interface';
import { MailOptions, MailResult } from '../interfaces/mail/MailOptions.interface';
import { ConfigMailFactory } from '../config/mail/MailConfigFactory';
import { EmailTemplates } from '../helpers/EmailTemplates';

export class MailService implements IMailService {
    private transporter: Transporter;
    private defaultFrom: string;

    constructor(mailTransporter?: MailTransporter) {
        // Principio de Inversión de Dependencias: inyección de dependencias
        const transporterConfig = mailTransporter || ConfigMailFactory.createGmailTransporter();
        this.transporter = transporterConfig.createTransporter();
        this.defaultFrom = process.env.DEFAULT_FROM_EMAIL || process.env.GMAIL_USER || '';
    }

    /**
     * Envía un correo electrónico con las opciones especificadas
     * @param options - Opciones del correo electrónico
     * @returns Promise<MailResult> - Resultado del envío
     */
    public async sendMail(options: MailOptions): Promise<MailResult> {
        try {
            const mailOptions = {
                from: options.from || this.defaultFrom,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
                cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
                bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
                attachments: options.attachments
            };

            const info = await this.transporter.sendMail(mailOptions);
            
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Error enviando correo:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }

    /**
     * Envía un correo de bienvenida a un nuevo usuario
     * @param to - Correo del destinatario
     * @param userName - Nombre del usuario
     * @returns Promise<MailResult>
     */
    public async sendWelcomeEmail(to: string, userName: string): Promise<MailResult> {
        const subject = '¡Bienvenido a Ruta Fácil!';
        const html = EmailTemplates.welcomeTemplate(userName);

        return this.sendMail({
            to,
            subject,
            html
        });
    }

    /**
     * Envía un correo para restablecer la contraseña
     * @param to - Correo del destinatario
     * @param resetToken - Token de restablecimiento
     * @returns Promise<MailResult>
     */
    public async sendPasswordResetEmail(to: string, resetToken: string): Promise<MailResult> {
        const subject = 'Restablecimiento de Contraseña - Ruta Fácil';
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const html = EmailTemplates.passwordResetTemplate(resetUrl);

        return this.sendMail({
            to,
            subject,
            html
        });
    }

    /**
     * Envía un correo de notificación genérico
     * @param to - Correo del destinatario
     * @param subject - Asunto del correo
     * @param message - Mensaje del correo
     * @returns Promise<MailResult>
     */
    public async sendNotificationEmail(to: string, subject: string, message: string): Promise<MailResult> {
        const html = EmailTemplates.routeNotificationTemplate(message);

        return this.sendMail({
            to,
            subject,
            html
        });
    }

    /**
     * Envía un correo de verificación de email
     * @param to - Correo del destinatario
     * @param verificationToken - Token de verificación
     * @returns Promise<MailResult>
     */
    public async sendEmailVerification(to: string, verificationToken: string): Promise<MailResult> {
        const subject = 'Verificación de Correo Electrónico - Ruta Fácil';
        const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
        const html = EmailTemplates.emailVerificationTemplate(verificationUrl);

        return this.sendMail({
            to,
            subject,
            html
        });
    }

    /**
     * Envía múltiples correos en lote
     * @param emails - Array de opciones de correo
     * @returns Promise<MailResult[]>
     */
    public async sendBulkEmails(emails: MailOptions[]): Promise<MailResult[]> {
        const promises = emails.map(email => this.sendMail(email));
        return Promise.all(promises);
    }

    /**
     * Verifica la configuración del transporter
     * @returns Promise<boolean>
     */
    public async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error('Error verificando conexión de correo:', error);
            return false;
        }
    }
}