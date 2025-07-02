"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
    }
    sendVerificationEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create verification token with JWT
                const verificationToken = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });
                const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject: 'Verifica tu correo electrónico - Ruta Fácil',
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">¡Bienvenido a Ruta Fácil!</h2>
                        <p>Gracias por registrarte en nuestra plataforma. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Verificar Correo Electrónico
                            </a>
                        </div>
                        <p style="color: #666; font-size: 14px;">Este enlace expirará en 24 horas.</p>
                        <p style="color: #666; font-size: 14px;">Si no solicitaste esta verificación, puedes ignorar este correo.</p>
                    </div>
                `
                };
                yield this.transporter.sendMail(mailOptions);
                console.log(`Verification email sent to ${email}`);
            }
            catch (error) {
                console.error('Error sending verification email:', error);
                throw new Error('Error al enviar el correo de verificación');
            }
        });
    }
    sendOTPEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject: 'Código de verificación - Ruta Fácil',
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Código de Verificación</h2>
                        <p>Tu código de verificación para iniciar sesión es:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="background-color: #f8f9fa; border: 2px solid #007bff; padding: 15px 25px; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; display: inline-block;">
                                ${otp}
                            </span>
                        </div>
                        <p style="color: #666; font-size: 14px;">Este código expirará en 5 minutos.</p>
                        <p style="color: #666; font-size: 14px;">Si no solicitaste este código, puedes ignorar este correo.</p>
                    </div>
                `
                };
                yield this.transporter.sendMail(mailOptions);
                console.log(`OTP email sent to ${email}`);
            }
            catch (error) {
                console.error('Error sending OTP email:', error);
                throw new Error('Error al enviar el código OTP');
            }
        });
    }
    sendPasswordResetEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject: 'Restablecimiento de contraseña - Ruta Fácil',
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Restablecimiento de Contraseña</h2>
                        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Restablecer Contraseña
                            </a>
                        </div>
                        <p style="color: #666; font-size: 14px;">Este enlace expirará en 1 hora.</p>
                        <p style="color: #666; font-size: 14px;">Si no solicitaste este restablecimiento, puedes ignorar este correo.</p>
                    </div>
                `
                };
                yield this.transporter.sendMail(mailOptions);
                console.log(`Password reset email sent to ${email}`);
            }
            catch (error) {
                console.error('Error sending password reset email:', error);
                throw new Error('Error al enviar el correo de restablecimiento');
            }
        });
    }
}
exports.EmailService = EmailService;
