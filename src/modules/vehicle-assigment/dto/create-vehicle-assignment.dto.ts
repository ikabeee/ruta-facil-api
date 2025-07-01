import { IsDate, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateVehicleAssignmentDto {
    @IsNumber({}, { message: 'El ID del vehículo debe ser un número.' })
    @IsNotEmpty({ message: 'El ID del vehículo es obligatorio.' })
    @Min(1, { message: 'El ID del vehículo debe ser mayor a 0.' })
    vehicleId!: number;

    @IsNumber({}, { message: 'El ID de la ruta debe ser un número.' })
    @IsNotEmpty({ message: 'El ID de la ruta es obligatorio.' })
    @Min(1, { message: 'El ID de la ruta debe ser mayor a 0.' })
    routeId!: number;

    @IsNumber({}, { message: 'El ID del conductor debe ser un número.' })
    @IsNotEmpty({ message: 'El ID del conductor es obligatorio.' })
    @Min(1, { message: 'El ID del conductor debe ser mayor a 0.' })
    driverId!: number;

    @IsDate({ message: 'La fecha de inicio debe ser una fecha válida.' })
    @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
    startTime!: Date;

    @IsOptional()
    @IsDate({ message: 'La fecha de fin debe ser una fecha válida.' })
    endTime?: Date;
}
