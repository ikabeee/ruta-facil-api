import { MailTransporter } from "../../interfaces/mail/MailTransporter.interface";
import { MailConfig } from "../../interfaces/mail/MailConfig.interface";
import nodemailer, { Transporter } from 'nodemailer';

/**
 * Configuración para Outlook/Hotmail
 */
export class OutlookConfig implements MailTransporter {
    constructor(private config: MailConfig) { }

    public createTransporter(): Transporter {
        return nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: this.config.auth.user,
                pass: this.config.auth.pass
            }
        });
    }
}

/**
 * Configuración SMTP personalizada
 */
export class SMTPConfig implements MailTransporter {
    constructor(
        private host: string,
        private port: number,
        private secure: boolean,
        private config: MailConfig
    ) { }

    public createTransporter(): Transporter {
        return nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: this.secure,
            auth: {
                user: this.config.auth.user,
                pass: this.config.auth.pass
            }
        });
    }
}

/**
 * Configuración para Amazon SES
 */
export class AmazonSESConfig implements MailTransporter {
    constructor(
        private region: string,
        private accessKeyId: string,
        private secretAccessKey: string
    ) { }

    public createTransporter(): Transporter {
        return nodemailer.createTransport({
            SES: {
                region: this.region,
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey
            }
        });
    }
}
