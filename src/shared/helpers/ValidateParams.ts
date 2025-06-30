export class ValidateParams {
    /**
     * Valida que el parámetro sea un número entero positivo.
     * @param param Valor a validar.
     * @returns {string | null} Un mensaje de error en caso de fallo o null si es válido.
     */
    static validatePositiveInteger(param: any): string | null {
        const num = +param;
        if (!param || isNaN(num)) {
            return "Parámetro inválido";
        }
        if (num <= 0) {
            return "El parámetro debe ser mayor a 0";
        }
        if (!Number.isInteger(num)) {
            return "El parámetro debe ser un número entero";
        }
        return null;
    }
}