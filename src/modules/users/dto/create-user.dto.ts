import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../../../../generated/prisma/index';
export class CreateUserDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres.' })
    name!: string;
    @IsString({ message: 'El apellido debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres.' })
    lastName!: string;
    @IsEmail({}, { message: 'El correo electrónico no es válido.' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    email!: string;
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(100, { message: 'La contraseña no puede exceder los 100 caracteres.' })
    password!: string;
    @IsPhoneNumber()
    @MaxLength(15, { message: 'El número de teléfono no puede exceder los 15 caracteres.' })
    phone?: string;
    @IsEnum(UserRole, { message: 'El rol debe ser uno de los valores permitidos: ADMIN, USER, DRIVER, OWNER_VEHICLE' })
    @IsOptional()
    role?: UserRole;
    @IsEnum(UserStatus, { message: 'El estado debe ser uno de los valores permitidos: ACTIVE, INACTIVE, PENDING, BAN' })
    @IsOptional()
    status?: UserStatus;
    @IsBoolean({ message: 'El campo debe ser un booleano.' })
    @IsOptional()
    emailVerified?: boolean;
    @IsDate({ message: 'La fecha debe ser una fecha válida.' })
    @IsNotEmpty({ message: 'La fecha de creación es obligatoria.' })
    createdAt!: Date;
}