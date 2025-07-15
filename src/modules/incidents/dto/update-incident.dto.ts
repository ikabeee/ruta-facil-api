import { IsOptional, IsString, IsInt, IsPositive } from 'class-validator';

export class UpdateIncidentDto {
    @IsOptional()
    @IsString({ message: 'El título debe ser una cadena de texto.' })
    title?: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto.' })
    description?: string;

    @IsOptional()
    @IsString({ message: 'El tipo debe ser una cadena de texto.' })
    type?: string;

    @IsOptional()
    @IsString({ message: 'La prioridad debe ser LOW, MEDIUM, HIGH o CRITICAL.' })
    priority?: string;

    @IsOptional()
    @IsString({ message: 'La ubicación debe ser una cadena de texto.' })
    location?: string;

    @IsOptional()
    @IsString({ message: 'La unidad debe ser una cadena de texto.' })
    unit?: string;

    @IsOptional()
    @IsString({ message: 'El reportado por debe ser una cadena de texto.' })
    reportedBy?: string;

    @IsOptional()
    @IsString({ message: 'El estado debe ser PENDING, IN_PROGRESS, RESOLVED o CANCELLED.' })
    status?: string;

    @IsOptional()
    @IsInt({ message: 'El ID de la ruta debe ser un número entero.' })
    @IsPositive({ message: 'El ID de la ruta debe ser un número positivo.' })
    routeId?: number;
}
