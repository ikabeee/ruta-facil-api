import { MailTransporter } from "../../interfaces/mail/MailTransporter.interface";
import { MailConfig } from "../../interfaces/mail/MailConfig.interface";
import nodemailer, { Transporter } from 'nodemailer';

export class GmailConfig implements MailTransporter {

    constructor(private config: MailConfig) { }
    /**
     * Creates a transporter for sending emails using Gmail.
     * @returns {Transporter} The nodemailer transporter configured for Gmail.
     */

    public createTransporter(): Transporter {
        return nodemailer.createTransport({
            service: this.config.service,
            auth: {
                user: this.config.auth.user,
                pass: this.config.auth.pass
            }
        })
    }
}