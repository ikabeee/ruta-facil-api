"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPService = void 0;
const otplib_1 = require("otplib");
class OTPService {
    constructor() {
        // Configure OTP settings
        otplib_1.authenticator.options = {
            window: 1, // Allow 1 time step tolerance
            step: 300 // 5 minutes validity
        };
    }
    generateOTP() {
        // Generate a 6-digit OTP
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    verifyOTP(token, userOTP) {
        return token === userOTP;
    }
    generateSecret() {
        return otplib_1.authenticator.generateSecret();
    }
    generateQRCode(secret, label) {
        return otplib_1.authenticator.keyuri(label, 'Ruta Fácil', secret);
    }
}
exports.OTPService = OTPService;
