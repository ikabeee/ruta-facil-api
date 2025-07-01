import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateStarredRouteDto {
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto.' })
    @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres.' })
    description?: string;
}
