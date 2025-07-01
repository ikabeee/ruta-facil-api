import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateRouteStopDto {
    @IsInt({ message: 'El ID de la ruta debe ser un número entero.' })
    @IsOptional()
    @Min(1, { message: 'El ID de la ruta debe ser mayor a 0.' })
    routeId?: number;

    @IsInt({ message: 'El ID de la parada debe ser un número entero.' })
    @IsOptional()
    @Min(1, { message: 'El ID de la parada debe ser mayor a 0.' })
    stopId?: number;

    @IsInt({ message: 'El orden debe ser un número entero.' })
    @IsOptional()
    @Min(1, { message: 'El orden debe ser mayor a 0.' })
    order?: number;
}
