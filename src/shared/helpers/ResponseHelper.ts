export interface ResponseHelper<T>
{
    success: boolean;
    timestamp: string;
    message: string;
    data?: T;
    statusCode?: number;
    error?: {
        message: string;
        code?: number;
    };
}