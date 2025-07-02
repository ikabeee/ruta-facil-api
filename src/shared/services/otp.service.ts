import { authenticator } from 'otplib';

export class OTPService {
    constructor() {
        // Configure OTP settings
        authenticator.options = {
            window: 1, // Allow 1 time step tolerance
            step: 300 // 5 minutes validity
        };
    }

    generateOTP(): string {
        // Generate a 6-digit OTP
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    verifyOTP(token: string, userOTP: string): boolean {
        return token === userOTP;
    }

    generateSecret(): string {
        return authenticator.generateSecret();
    }

    generateQRCode(secret: string, label: string): string {
        return authenticator.keyuri(label, 'Ruta Fácil', secret);
    }
}