import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateVehicleAssignmentDto {
    @IsOptional()
    @IsNumber({}, { message: 'El ID del vehículo debe ser un número.' })
    @Min(1, { message: 'El ID del vehículo debe ser mayor a 0.' })
    vehicleId?: number;

    @IsOptional()
    @IsNumber({}, { message: 'El ID de la ruta debe ser un número.' })
    @Min(1, { message: 'El ID de la ruta debe ser mayor a 0.' })
    routeId?: number;

    @IsOptional()
    @IsNumber({}, { message: 'El ID del conductor debe ser un número.' })
    @Min(1, { message: 'El ID del conductor debe ser mayor a 0.' })
    driverId?: number;

    @IsOptional()
    @IsDate({ message: 'La fecha de inicio debe ser una fecha válida.' })
    startTime?: Date;

    @IsOptional()
    @IsDate({ message: 'La fecha de fin debe ser una fecha válida.' })
    endTime?: Date;
}
