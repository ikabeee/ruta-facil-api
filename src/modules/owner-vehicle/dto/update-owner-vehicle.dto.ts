import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateOwnerVehicleDto {
    @IsOptional()
    @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0.' })
    userId?: number;

    @IsOptional()
    @IsNumber({}, { message: 'El ID del vehículo debe ser un número.' })
    @Min(1, { message: 'El ID del vehículo debe ser mayor a 0.' })
    vehicleId?: number;

    @IsOptional()
    @IsBoolean({ message: 'El campo isVerified debe ser un booleano.' })
    isVerified?: boolean;
}
