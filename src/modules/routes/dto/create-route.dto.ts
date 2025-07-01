import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRouteDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
    name!: string;

    @IsOptional()
    @IsString({ message: 'La imagen debe ser una cadena de texto.' })
    @MaxLength(255, { message: 'La URL de la imagen no puede exceder los 255 caracteres.' })
    img?: string;

    @IsString({ message: 'El punto inicial debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El punto inicial es obligatorio.' })
    @MaxLength(200, { message: 'El punto inicial no puede exceder los 200 caracteres.' })
    firstPoint!: string;

    @IsString({ message: 'El punto final debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El punto final es obligatorio.' })
    @MaxLength(200, { message: 'El punto final no puede exceder los 200 caracteres.' })
    lastPoint!: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto.' })
    @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres.' })
    description?: string;
}
