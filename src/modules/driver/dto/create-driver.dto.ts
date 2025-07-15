import { Rating } from './../../../../generated/prisma/index.d';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Min , IsString, IsDate, Max, isObject } from 'class-validator';

export class CreateDriverDto {
    @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0.' })
    userId!: number;
    @IsString({message: 'La licencia debe ser una cadena de texto.'})
    @IsOptional()
    license!: string;
    @IsDate({ message: 'La fecha de expiración debe ser una fecha válida.' })
    @IsOptional()
    licenseExpiration!: Date;
    @IsString({ message: 'La experiencia debe ser una cadena de texto.' })
    @IsOptional()
    experience!: string;
    @IsNumber({}, { message: 'La calificación debe ser un número.' })
    @IsOptional()
    rating!:number;
    @IsBoolean({ message: 'El campo isVerified debe ser un booleano.' })
    isVerified?: boolean;
}
