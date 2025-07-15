import { IsString, IsNotEmpty, IsOptional, MaxLength, IsInt, IsPositive } from 'class-validator';

export class CreateStarredRouteDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
    name!: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto.' })
    @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres.' })
    description?: string;

    @IsInt({ message: 'El ID de la ruta debe ser un número entero.' })
    @IsPositive({ message: 'El ID de la ruta debe ser un número positivo.' })
    routeId!: number;

    @IsInt({ message: 'El ID del usuario debe ser un número entero.' })
    @IsPositive({ message: 'El ID del usuario debe ser un número positivo.' })
    userId!: number;
}
