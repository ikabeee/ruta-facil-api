import { body, ValidationChain } from 'express-validator';

export class ValidationUtil {
    static validateEmail(): ValidationChain {
        return body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address');
    }

    static validatePassword(): ValidationChain {
        return body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    static validateName(): ValidationChain {
        return body('name')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage('Name must contain only letters and spaces');
    }

    static validateOptionalLastName(): ValidationChain {
        return body('lastName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage('Last name must contain only letters and spaces');
    }

    static validatePhone(): ValidationChain {
        return body('phone')
            .optional()
            .isMobilePhone('any')
            .withMessage('Please provide a valid phone number');
    }

    static validateOtpCode(): ValidationChain {
        return body('otpCode')
            .isLength({ min: 6, max: 6 })
            .isNumeric()
            .withMessage('OTP code must be a 6-digit number');
    }

    static validateToken(): ValidationChain {
        return body('token')
            .notEmpty()
            .withMessage('Token is required');
    }
}