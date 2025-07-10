import { Transporter } from "nodemailer";

export interface MailTransporter {
    createTransporter(): Transporter;
}