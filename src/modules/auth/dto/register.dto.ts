import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "../../../../generated/prisma";

export class RegisterDto {
    @IsString({ message: "El nombre debe ser una cadena de texto" })
    @IsNotEmpty({ message: "El nombre es obligatorio" })
    name!: string;
    
    @IsString({ message: "El apellido debe ser una cadena de texto" })
    @IsOptional()
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
    
    @IsOptional()
    @IsString({ message: "El teléfono debe ser una cadena de texto" })
    phone?: string;
    
    // Campos que se establecen automáticamente en el servidor
    @IsOptional()
    @IsEnum(UserRole, { message: "El campo role debe ser uno de los siguientes valores: USER, DRIVER, ADMIN"})
    role?: UserRole;
    
    @IsOptional()
    emailVerified?: boolean;
    
    @IsOptional()
    @IsDate({ message: "createdAt debe ser una fecha válida" })
    createdAt?: Date;
}