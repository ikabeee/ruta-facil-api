import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOwnerVehicleDto {
    @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0.' })
    userId!: number;

    @IsNumber({}, { message: 'El ID del vehículo debe ser un número.' })
    @IsNotEmpty({ message: 'El ID del vehículo es obligatorio.' })
    @Min(1, { message: 'El ID del vehículo debe ser mayor a 0.' })
    vehicleId!: number;

    @IsOptional()
    @IsBoolean({ message: 'El campo isVerified debe ser un booleano.' })
    isVerified?: boolean;
}
