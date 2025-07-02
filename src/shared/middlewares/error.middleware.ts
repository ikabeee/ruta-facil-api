import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array()
        });
    }
    next();
};

export const errorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500;
    const message = error.isOperational ? error.message : 'Something went wrong';

    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method
    });

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};