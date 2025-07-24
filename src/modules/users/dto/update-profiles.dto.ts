import {
    IsOptional,
    IsString,
    IsNumber,
    IsDate,
    IsBoolean,
    Max,
    Min
} from 'class-validator';

export class UpdateDriverProfileDto {
    @IsOptional()
    @IsString({ message: 'La licencia debe ser una cadena de texto.' })
    license?: string;

    @IsOptional()
    @IsDate({ message: 'La fecha de vencimiento de licencia debe ser una fecha válida.' })
    licenseExpiration?: Date;

    @IsOptional()
    @IsString({ message: 'La experiencia debe ser una cadena de texto.' })
    driverExperience?: string;

    @IsOptional()
    @IsNumber({}, { message: 'El rating debe ser un número.' })
    @Min(1, { message: 'El rating mínimo es 1.' })
    @Max(5, { message: 'El rating máximo es 5.' })
    driverRating?: number;

    @IsOptional()
    @IsNumber({}, { message: 'El total de viajes debe ser un número.' })
    @Min(0, { message: 'El total de viajes no puede ser negativo.' })
    totalTrips?: number;

    @IsOptional()
    @IsBoolean({ message: 'La verificación de conductor debe ser un booleano.' })
    isDriverVerified?: boolean;
}

export class UpdateOwnerProfileDto {
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
    @Min(0, { message: 'El total de vehículos no puede ser negativo.' })
    totalVehicles?: number;

    @IsOptional()
    @IsDate({ message: 'La fecha del último pago debe ser una fecha válida.' })
    lastPayment?: Date;

    @IsOptional()
    @IsBoolean({ message: 'La verificación de propietario debe ser un booleano.' })
    isOwnerVerified?: boolean;
}
