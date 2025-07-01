import { IsOptional, IsString, MaxLength, IsEnum, IsDate, IsNotEmpty } from 'class-validator';
import { RatingStatus } from '../../../../generated/prisma/index';

export class UpdateRatingDto {
    @IsOptional()
    @IsString({ message: 'El título debe ser una cadena de texto.' })
    @MaxLength(100, { message: 'El título no puede exceder los 100 caracteres.' })
    title?: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto.' })
    @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres.' })
    description?: string;

    @IsOptional()
    @IsEnum(RatingStatus, { message: 'El estado debe ser uno de los valores permitidos: ACTIVE, INACTIVE, BAN' })
    status?: RatingStatus;

    @IsOptional()
    @IsDate({ message: 'La fecha de creación debe ser una fecha válida.' })
    createdAt?: Date;

    @IsNotEmpty({ message: 'La fecha de actualización es obligatoria.' })
    updatedAt!: Date;
}
