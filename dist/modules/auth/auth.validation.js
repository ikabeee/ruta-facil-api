"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassword = exports.validateVerifyOTP = exports.validateLogin = exports.validateRegister = void 0;
const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: 'Nombre, email y contraseña son requeridos'
        });
        return;
    }
    if (!isValidEmail(email)) {
        res.status(400).json({
            success: false,
            message: 'Email inválido'
        });
        return;
    }
    if (password.length < 6) {
        res.status(400).json({
            success: false,
            message: 'La contraseña debe tener al menos 6 caracteres'
        });
        return;
    }
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: 'Email y contraseña son requeridos'
        });
        return;
    }
    if (!isValidEmail(email)) {
        res.status(400).json({
            success: false,
            message: 'Email inválido'
        });
        return;
    }
    next();
};
exports.validateLogin = validateLogin;
const validateVerifyOTP = (req, res, next) => {
    const { sessionId, otp } = req.body;
    if (!sessionId || !otp) {
        res.status(400).json({
            success: false,
            message: 'Session ID y código OTP son requeridos'
        });
        return;
    }
    if (otp.length !== 6) {
        res.status(400).json({
            success: false,
            message: 'El código OTP debe tener 6 dígitos'
        });
        return;
    }
    next();
};
exports.validateVerifyOTP = validateVerifyOTP;
const validateResetPassword = (req, res, next) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        res.status(400).json({
            success: false,
            message: 'Token y nueva contraseña son requeridos'
        });
        return;
    }
    if (newPassword.length < 6) {
        res.status(400).json({
            success: false,
            message: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
        return;
    }
    next();
};
exports.validateResetPassword = validateResetPassword;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
