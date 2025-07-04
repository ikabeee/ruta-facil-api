import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: "El email es obligatorio"})
    @IsEmail({}, { message: "El email debe ser válido"})
    email!: string;
    @IsNotEmpty({ message: "La contraseña es obligatoria"})
    @IsNotEmpty({ message: "La contraseña es obligatoria"})
    password!: string;
}