import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateRouteStopDto {
    @IsInt({ message: 'El ID de la ruta debe ser un número entero.' })
    @IsNotEmpty({ message: 'El ID de la ruta es obligatorio.' })
    @Min(1, { message: 'El ID de la ruta debe ser mayor a 0.' })
    routeId!: number;

    @IsInt({ message: 'El ID de la parada debe ser un número entero.' })
    @IsNotEmpty({ message: 'El ID de la parada es obligatorio.' })
    @Min(1, { message: 'El ID de la parada debe ser mayor a 0.' })
    stopId!: number;

    @IsInt({ message: 'El orden debe ser un número entero.' })
    @IsNotEmpty({ message: 'El orden es obligatorio.' })
    @Min(1, { message: 'El orden debe ser mayor a 0.' })
    order!: number;
}
