import { IsDate, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class UpdateVehicleLocationDto {
    @IsOptional()
    @IsNumber({}, { message: 'El ID del vehículo debe ser un número.' })
    @IsPositive({ message: 'El ID del vehículo debe ser un número positivo.' })
    vehicleId?: number;

    @IsOptional()
    @IsNumber({}, { message: 'La latitud debe ser un número.' })
    @Min(-90, { message: 'La latitud debe estar entre -90 y 90 grados.' })
    @Max(90, { message: 'La latitud debe estar entre -90 y 90 grados.' })
    lat?: number;

    @IsOptional()
    @IsNumber({}, { message: 'La longitud debe ser un número.' })
    @Min(-180, { message: 'La longitud debe estar entre -180 y 180 grados.' })
    @Max(180, { message: 'La longitud debe estar entre -180 y 180 grados.' })
    lng?: number;

    @IsOptional()
    @IsDate({ message: 'La fecha de registro debe ser una fecha válida.' })
    recordedAt?: Date;
}
