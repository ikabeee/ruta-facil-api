import bcrypt from 'bcrypt';
import { ApiError } from '../errors/ApiError';

export class HashHelper {
    private static readonly SALT_ROUNDS = 12;

    /**
     * Hashea una contraseña
     * @param password - Contraseña a hashear
     * @returns Promise con la contraseña hasheada
     */
    public static async hashPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new ApiError(500, 'Error al hashear contraseña');
        }
    }

    /**
     * Compara una contraseña con su hash
     * @param password - Contraseña en texto plano
     * @param hash - Hash a comparar
     * @returns Promise con el resultado de la comparación
     */
    public static async comparePassword(password: string, hash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            throw new ApiError(500, 'Error al comparar contraseña');
        }
    }

    /**
     * Genera una contraseña temporal aleatoria
     * @param length - Longitud de la contraseña (default: 12)
     * @returns Contraseña temporal
     */
    public static generateTemporaryPassword(length: number = 12): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return password;
    }

    /**
     * Valida la fortaleza de una contraseña
     * @param password - Contraseña a validar
     * @returns Objeto con el resultado de la validación
     */
    public static validatePasswordStrength(password: string): {
        isValid: boolean;
        errors: string[];
        strength: 'weak' | 'medium' | 'strong';
    } {
        const errors: string[] = [];
        let score = 0;

        // Verificar longitud mínima
        if (password.length < 8) {
            errors.push('La contraseña debe tener al menos 8 caracteres');
        } else {
            score += 1;
        }

        // Verificar mayúsculas
        if (!/[A-Z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una letra mayúscula');
        } else {
            score += 1;
        }

        // Verificar minúsculas
        if (!/[a-z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una letra minúscula');
        } else {
            score += 1;
        }

        // Verificar números
        if (!/\d/.test(password)) {
            errors.push('La contraseña debe contener al menos un número');
        } else {
            score += 1;
        }

        // Verificar caracteres especiales
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
            errors.push('La contraseña debe contener al menos un carácter especial');
        } else {
            score += 1;
        }

        // Determinar fortaleza
        let strength: 'weak' | 'medium' | 'strong';
        if (score < 3) {
            strength = 'weak';
        } else if (score < 5) {
            strength = 'medium';
        } else {
            strength = 'strong';
        }

        return {
            isValid: errors.length === 0,
            errors,
            strength
        };
    }
}
