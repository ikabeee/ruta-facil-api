import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ForgotPasswordDto {
    @IsNotEmpty({ message: "El email es obligatorio" })
    @IsEmail({}, { message: "El email debe ser válido" })
    email!: string;
}

export class ResetPasswordDto {
    @IsNotEmpty({ message: "El token es obligatorio" })
    @IsString({ message: "El token debe ser una cadena de texto" })
    token!: string;

    @IsNotEmpty({ message: "La nueva contraseña es obligatoria" })
    @IsString({ message: "La nueva contraseña debe ser una cadena de texto" })
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    newPassword!: string;

    @IsNotEmpty({ message: "La confirmación de contraseña es obligatoria" })
    @IsString({ message: "La confirmación de contraseña debe ser una cadena de texto" })
    confirmPassword!: string;
}

export class ChangePasswordDto {
    @IsNotEmpty({ message: "La contraseña actual es obligatoria" })
    @IsString({ message: "La contraseña actual debe ser una cadena de texto" })
    currentPassword!: string;

    @IsNotEmpty({ message: "La nueva contraseña es obligatoria" })
    @IsString({ message: "La nueva contraseña debe ser una cadena de texto" })
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    newPassword!: string;

    @IsNotEmpty({ message: "La confirmación de contraseña es obligatoria" })
    @IsString({ message: "La confirmación de contraseña debe ser una cadena de texto" })
    confirmPassword!: string;
}

export class VerifyEmailDto {
    @IsNotEmpty({ message: "El token es obligatorio" })
    @IsString({ message: "El token debe ser una cadena de texto" })
    token!: string;
}

export class ResendVerificationDto {
    @IsNotEmpty({ message: "El email es obligatorio" })
    @IsEmail({}, { message: "El email debe ser válido" })
    email!: string;
}
