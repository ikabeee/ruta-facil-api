import { IsString, IsNotEmpty, MaxLength, IsOptional, IsEnum, IsDate } from 'class-validator';
import { RatingStatus } from '../../../../generated/prisma/index';

export class CreateRatingDto {
    @IsString({ message: 'El título debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El título es obligatorio.' })
    @MaxLength(100, { message: 'El título no puede exceder los 100 caracteres.' })
    title!: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto.' })
    @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres.' })
    description?: string;

    @IsEnum(RatingStatus, { message: 'El estado debe ser uno de los valores permitidos: ACTIVE, INACTIVE, BAN' })
    @IsOptional()
    status?: RatingStatus;

    @IsDate({ message: 'La fecha debe ser una fecha válida.' })
    @IsNotEmpty({ message: 'La fecha de creación es obligatoria.' })
    createdAt!: Date;
}
