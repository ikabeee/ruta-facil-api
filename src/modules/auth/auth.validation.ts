import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
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

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
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

export const validateVerifyOTP = (req: Request, res: Response, next: NextFunction): void => {
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

export const validateResetPassword = (req: Request, res: Response, next: NextFunction): void => {
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

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};