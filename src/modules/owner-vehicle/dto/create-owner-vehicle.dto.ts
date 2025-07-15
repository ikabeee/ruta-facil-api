import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOwnerVehicleDto {
    @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0.' })
    userId!: number;

    @IsOptional()
    @IsString({ message: 'La empresa debe ser una cadena de texto.' })
    company?: string;

    @IsOptional()
    @IsString({ message: 'El contacto debe ser una cadena de texto.' })
    contact?: string;

    @IsOptional()
    @IsString({ message: 'El RFC debe ser una cadena de texto.' })
    rfc?: string;

    @IsOptional()
    @IsString({ message: 'La dirección debe ser una cadena de texto.' })
    address?: string;

    @IsOptional()
    @IsNumber({}, { message: 'El total de vehículos debe ser un número.' })
    @Min(0, { message: 'El total de vehículos debe ser mayor o igual a 0.' })
    totalVehicles?: number;

    @IsOptional()
    @IsBoolean({ message: 'El campo isVerified debe ser un booleano.' })
    isVerified?: boolean;
}
