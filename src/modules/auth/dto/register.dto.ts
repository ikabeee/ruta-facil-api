import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "../../../../generated/prisma";

export class RegisterDto {
    @IsString({ message: "El nombre debe ser una cadena de texto" })
    @IsNotEmpty({ message: "El nombre es obligatorio" })
    name!: string;
    @IsString({ message: "El apellido debe ser una cadena de texto" })
    @IsOptional({ message: "El apellido es opcional" })
    lastName?: string;
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    @IsNotEmpty({ message: "El correo electrónico es obligatorio" })
    email!: string;
    @IsString({ message: "La contraseña debe ser una cadena de texto" })
    @IsNotEmpty({ message: "La contraseña es obligatoria" })
    password!: string;
    @IsString({ message: "La confirmación de contraseña debe ser una cadena de texto" })
    @IsNotEmpty({ message: "La confirmación de contraseña es obligatoria" })
    confirmPassword!: string;
    @IsString({ message: "El teléfono debe ser una cadena de texto" })
    phone?: string;
    @IsNotEmpty({ message: "El campo role es obligatorio" })
    @IsEnum(UserRole, { message: "El campo role debe ser uno de los siguientes valores: USER, DRIVER, ADMIN"})
    role!: UserRole;
    @IsNotEmpty({ message: "El campo emailVerified es obligatorio" })
    emailVerified!: boolean;
    @IsNotEmpty({ message: "El campo createdAt es obligatorio" })
    @IsDate({ message: "createdAt debe ser una fecha válida" })
    createdAt!: Date;
}