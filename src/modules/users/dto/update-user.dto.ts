import {
    IsOptional,
    IsString,
    IsEmail,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsPhoneNumber,
    IsEnum,
    IsBoolean,
    IsDate
} from 'class-validator';
import { UserRole, UserStatus } from '../../../../generated/prisma/index';

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres.' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'El apellido debe ser una cadena de texto.' })
    @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres.' })
    lastName?: string;

    @IsOptional()
    @IsEmail({}, { message: 'El correo electrónico no es válido.' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(100, { message: 'La contraseña no puede exceder los 100 caracteres.' })
    password?: string;

    @IsOptional()
    @IsPhoneNumber('MX', { message: 'El número de teléfono no es válido para México' })
    @MaxLength(15, { message: 'El número de teléfono no puede exceder los 15 caracteres.' })
    phone?: string;

    @IsOptional()
    @IsEnum(UserRole, { message: 'El rol debe ser uno de los valores permitidos: ADMIN, USER, DRIVER, OWNER_VEHICLE' })
    role?: UserRole;

    @IsOptional()
    @IsEnum(UserStatus, { message: 'El estado debe ser uno de los valores permitidos: ACTIVE, INACTIVE, PENDING, BAN' })
    status?: UserStatus;

    @IsOptional()
    @IsBoolean({ message: 'El campo debe ser un booleano.' })
    emailVerified?: boolean;
    @IsDate({ message: 'La fecha de creación debe ser una fecha válida.' })
    @IsNotEmpty({ message: 'La fecha de creación es obligatoria.' })
    updatedAt!: Date;
}