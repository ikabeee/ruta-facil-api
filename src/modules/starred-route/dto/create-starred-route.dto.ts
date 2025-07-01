import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateStarredRouteDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
    name!: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto.' })
    @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres.' })
    description?: string;
}
