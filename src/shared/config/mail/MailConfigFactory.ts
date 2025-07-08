import { MailConfig } from '../../interfaces/mail/MailConfig.interface';
import { MailTransporter } from '../../interfaces/mail/MailTransporter.interface';
import { GmailConfig } from './GmailConfig';
export class ConfigMailFactory {
    public static createGmailTransporter(): MailTransporter {
        const config: MailConfig = {
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER || '',
                pass: process.env.GMAIL_PASS || ''
            }
        };
        return new GmailConfig(config);
    }
}