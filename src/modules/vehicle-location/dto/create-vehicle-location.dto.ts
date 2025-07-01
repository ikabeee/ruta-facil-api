import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class CreateVehicleLocationDto {
    @IsNumber({}, { message: 'El ID del vehículo debe ser un número.' })
    @IsNotEmpty({ message: 'El ID del vehículo es obligatorio.' })
    @IsPositive({ message: 'El ID del vehículo debe ser un número positivo.' })
    vehicleId!: number;

    @IsNumber({}, { message: 'La latitud debe ser un número.' })
    @IsNotEmpty({ message: 'La latitud es obligatoria.' })
    @Min(-90, { message: 'La latitud debe estar entre -90 y 90 grados.' })
    @Max(90, { message: 'La latitud debe estar entre -90 y 90 grados.' })
    lat!: number;

    @IsNumber({}, { message: 'La longitud debe ser un número.' })
    @IsNotEmpty({ message: 'La longitud es obligatoria.' })
    @Min(-180, { message: 'La longitud debe estar entre -180 y 180 grados.' })
    @Max(180, { message: 'La longitud debe estar entre -180 y 180 grados.' })
    lng!: number;

    @IsOptional()
    @IsDate({ message: 'La fecha de registro debe ser una fecha válida.' })
    recordedAt?: Date;
}
