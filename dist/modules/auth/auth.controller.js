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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, lastName, email, password, phone } = req.body;
                const result = yield this.authService.register({
                    name,
                    lastName,
                    email,
                    password,
                    phone
                });
                res.status(201).json({
                    success: true,
                    message: 'Usuario registrado exitosamente. Por favor verifica tu correo electrónico.',
                    data: result
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Error en el registro'
                });
            }
        });
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                yield this.authService.verifyEmail(token);
                res.status(200).json({
                    success: true,
                    message: 'Correo electrónico verificado exitosamente'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Error en la verificación'
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.authService.initiateLogin(email, password);
                res.status(200).json({
                    success: true,
                    message: 'Código OTP enviado a tu correo electrónico',
                    data: { sessionId: result.sessionId }
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Credenciales inválidas'
                });
            }
        });
    }
    verifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId, otp } = req.body;
                const result = yield this.authService.verifyOTP(sessionId, otp);
                // Set cookie with user information
                res.cookie('user_session', {
                    name: result.user.name,
                    lastName: result.user.lastName,
                    role: result.user.role,
                    status: result.user.status
                }, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 24 * 60 * 60 * 1000 // 24 hours
                });
                res.status(200).json({
                    success: true,
                    message: 'Inicio de sesión exitoso',
                    data: {
                        token: result.token,
                        user: {
                            name: result.user.name,
                            lastName: result.user.lastName,
                            role: result.user.role,
                            status: result.user.status
                        }
                    }
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Código OTP inválido'
                });
            }
        });
    }
    requestPasswordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this.authService.requestPasswordReset(email);
                res.status(200).json({
                    success: true,
                    message: 'Se ha enviado un enlace de restablecimiento a tu correo electrónico'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Error al solicitar restablecimiento'
                });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = req.body;
                yield this.authService.resetPassword(token, newPassword);
                res.status(200).json({
                    success: true,
                    message: 'Contraseña restablecida exitosamente'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Error al restablecer contraseña'
                });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('user_session');
                res.status(200).json({
                    success: true,
                    message: 'Sesión cerrada exitosamente'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error al cerrar sesión'
                });
            }
        });
    }
}
exports.AuthController = AuthController;
