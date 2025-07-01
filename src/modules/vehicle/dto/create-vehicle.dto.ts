import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateVehicleDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
    name!: string;

    @IsString({ message: 'La placa debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La placa es obligatoria.' })
    @MaxLength(20, { message: 'La placa no puede exceder los 20 caracteres.' })
    plate!: string;

    @IsOptional()
    @IsString({ message: 'El modelo debe ser una cadena de texto.' })
    @MaxLength(50, { message: 'El modelo no puede exceder los 50 caracteres.' })
    model?: string;

    @IsOptional()
    @IsString({ message: 'El color debe ser una cadena de texto.' })
    @MaxLength(30, { message: 'El color no puede exceder los 30 caracteres.' })
    color?: string;

    @IsOptional()
    @IsInt({ message: 'El año debe ser un número entero.' })
    @Min(1900, { message: 'El año debe ser mayor a 1900.' })
    @Max(new Date().getFullYear() + 1, { message: 'El año no puede ser mayor al año actual.' })
    year?: number;

    @IsOptional()
    @IsString({ message: 'La imagen debe ser una cadena de texto.' })
    @MaxLength(255, { message: 'La URL de la imagen no puede exceder los 255 caracteres.' })
    img?: string;
}
