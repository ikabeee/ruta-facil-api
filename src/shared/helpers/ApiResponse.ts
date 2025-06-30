import { time } from 'console';
import { Response } from 'express';

export class ApiResponse {
    static success(res: Response, data: any, statusCode: number = 200): Response {
        return res.status(statusCode).json({
            success: true,
            timestamp: new Date().toISOString(),
            message: 'Petición exitosa',
            data: data,
        });
    }

    static error(res: Response, message: string | string[], statusCode: number = 500): Response {
        return res.status(statusCode).json({
            success: false,
            timestamp: new Date().toISOString(),
            statusCode: statusCode,
            ...(Array.isArray(message) ? { error: { message } } : { message }),
        });
    }
}