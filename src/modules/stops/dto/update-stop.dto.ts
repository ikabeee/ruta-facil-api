import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateStopDto {
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
    name?: string;

    @IsOptional()
    @IsNumber({}, { message: 'La latitud debe ser un número.' })
    lat?: number;

    @IsOptional()
    @IsNumber({}, { message: 'La longitud debe ser un número.' })
    lng?: number;

    @IsOptional()
    @IsString({ message: 'La imagen debe ser una cadena de texto.' })
    @IsUrl({}, { message: 'La imagen debe ser una URL válida.' })
    img?: string;
}
