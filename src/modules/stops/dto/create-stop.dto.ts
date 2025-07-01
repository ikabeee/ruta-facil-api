import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateStopDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
    name!: string;

    @IsNumber({}, { message: 'La latitud debe ser un número.' })
    @IsNotEmpty({ message: 'La latitud es obligatoria.' })
    lat!: number;

    @IsNumber({}, { message: 'La longitud debe ser un número.' })
    @IsNotEmpty({ message: 'La longitud es obligatoria.' })
    lng!: number;

    @IsOptional()
    @IsString({ message: 'La imagen debe ser una cadena de texto.' })
    @IsUrl({}, { message: 'La imagen debe ser una URL válida.' })
    img?: string;
}
