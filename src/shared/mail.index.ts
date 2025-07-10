// Exportar el servicio principal
export { MailService } from './services/mail.service';

// Exportar interfaces
export { IMailService } from './interfaces/mail/IMailService.interface';
export { MailOptions, MailResult, MailAttachment } from './interfaces/mail/MailOptions.interface';
export { MailConfig } from './interfaces/mail/MailConfig.interface';
export { MailTransporter } from './interfaces/mail/MailTransporter.interface';

// Exportar configuraciones
export { ConfigMailFactory } from './config/mail/MailConfigFactory';
export { GmailConfig } from './config/mail/GmailConfig';
export { OutlookConfig, SMTPConfig, AmazonSESConfig } from './config/mail/AlternativeConfigs';

// Exportar utilidades
export { EmailTemplates } from './helpers/EmailTemplates';
