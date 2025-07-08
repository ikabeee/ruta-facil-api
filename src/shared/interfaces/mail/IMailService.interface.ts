import { MailOptions, MailResult } from "./MailOptions.interface";

export interface IMailService {
    sendMail(options: MailOptions): Promise<MailResult>;
    sendWelcomeEmail(to: string, userName: string): Promise<MailResult>;
    sendPasswordResetEmail(to: string, resetToken: string): Promise<MailResult>;
    sendNotificationEmail(to: string, subject: string, message: string): Promise<MailResult>;
    sendEmailVerification(to: string, verificationToken: string): Promise<MailResult>;
    sendBulkEmails(emails: MailOptions[]): Promise<MailResult[]>;
    verifyConnection(): Promise<boolean>;
}
